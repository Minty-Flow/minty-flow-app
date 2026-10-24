/**
 * Exchange Rates Service
 *
 * Fetches exchange rates from external APIs with fallback support.
 * Uses in-memory caching (no database storage as per requirements).
 */

import i18n, { type TranslationKey } from "~/i18n/config"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { currencyRegistryService } from "./currency-registry"
import {
  fillMissingRates,
  GAP_FILL_SOURCES,
  OPEN_ER_API,
  RATE_SOURCES,
  type RateSource,
  type SourceRates,
} from "./exchange-rate-sources"

// Normalized structure we use internally
export interface ExchangeRates {
  date: string
  baseCurrency: string
  rates: Record<string, number>
}

interface ExchangeRatesCacheEntry {
  rates: ExchangeRates
  fetchedAt: Date
}

/**
 * Normalizes currency code to lowercase (as required by API).
 *
 * @param code - Currency code to normalize
 * @returns Lowercase trimmed currency code
 * @internal
 */
const normalizeCurrencyCode = (code: string): string => {
  return code.trim().toLowerCase()
}

/**
 * Exchange Rates Service.
 *
 * @remarks
 * Singleton service for fetching and caching exchange rates.
 * Uses in-memory caching with 1-hour TTL.
 * Supports fallback API sources for reliability.
 */
class ExchangeRatesService {
  private static instance: ExchangeRatesService | null = null

  // In-memory cache: Map<currencyCode, ExchangeRatesCacheEntry>
  // Always uses "latest" rates for consistency
  private cache: Map<string, ExchangeRatesCacheEntry> = new Map()

  // Cache TTL: 1 hour in milliseconds
  private readonly CACHE_TTL_MS = 60 * 60 * 1000

  // Network fetches in progress, by base currency, so a burst of callers for
  // the same base makes one request (open.er-api.com answers bursts with 429).
  private inflight: Map<string, Promise<ExchangeRates | null>> = new Map()

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Gets the singleton instance of the service.
   *
   * @returns The singleton ExchangeRatesService instance
   */
  static getInstance(): ExchangeRatesService {
    if (!ExchangeRatesService.instance) {
      ExchangeRatesService.instance = new ExchangeRatesService()
    }
    return ExchangeRatesService.instance
  }

  /**
   * Shows toast notification (only in browser environment).
   *
   * @param message - Message to display
   * @param type - Toast type (error or success)
   * @internal
   */
  private showToast(
    key: TranslationKey,
    type: "error" | "success" | "warn" = "error",
  ): void {
    const description = i18n.t(key)
    const title = i18n.t(
      type === "warn"
        ? "common.toast.warning"
        : type === "success"
          ? "common.toast.success"
          : "common.toast.error",
    )
    if (type === "warn") {
      Toast.warn({ title, description })
    } else if (type === "success") {
      Toast.success({ title, description })
    } else {
      Toast.error({ title, description })
    }
  }

  /**
   * Tries each source in order and returns the first usable response.
   *
   * @returns The rates and the source that answered, or null if none did (or
   * the request was aborted).
   */
  private async fetchFromSources(
    sources: readonly RateSource[],
    baseCurrency: string,
    signal?: AbortSignal,
  ): Promise<{ source: RateSource; rates: SourceRates } | null> {
    for (const source of sources) {
      try {
        const url = source.url(baseCurrency)
        logger.debug("Fetching exchange rates", { source: source.name, url })
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const rates = source.parse(await response.json(), baseCurrency)
        if (rates) return { source, rates }
        logger.warn("Exchange rate source returned unusable data", {
          source: source.name,
          baseCurrency,
        })
      } catch (error) {
        if (signal?.aborted) return null
        logger.warn("Failed to fetch exchange rates", {
          source: source.name,
          baseCurrency,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }
    return null
  }

  /**
   * Fresh rates for a base currency: the cache while it is still valid,
   * otherwise one network fetch shared by every caller asking at the same time.
   * Never shows a toast. A caller's `signal` only stops that caller waiting;
   * the shared fetch finishes and fills the cache for the others.
   */
  private async loadFreshRates(
    normalizedCurrency: string,
    signal?: AbortSignal,
  ): Promise<ExchangeRates | null> {
    const cached = this.getCachedRates(normalizedCurrency)
    if (cached) return cached
    if (signal?.aborted) return null

    let shared = this.inflight.get(normalizedCurrency)
    if (!shared) {
      shared = this.fetchRatesFromNetwork(normalizedCurrency).finally(() => {
        this.inflight.delete(normalizedCurrency)
      })
      this.inflight.set(normalizedCurrency, shared)
    }
    if (!signal) return shared

    return new Promise((resolve, reject) => {
      const onAbort = () => resolve(null)
      signal.addEventListener("abort", onAbort, { once: true })
      shared.then(resolve, reject).finally(() => {
        signal.removeEventListener("abort", onAbort)
      })
    })
  }

  private async fetchRatesFromNetwork(
    normalizedCurrency: string,
  ): Promise<ExchangeRates | null> {
    const primary = await this.fetchFromSources(
      RATE_SOURCES,
      normalizedCurrency,
    )
    if (!primary) {
      logger.error(
        `Failed to fetch exchange rates for ${normalizedCurrency} from all sources.`,
      )
      return null
    }

    // open.er-api.com has no crypto and a few ISO codes; fill those from
    // fawazahmed0 on a best-effort basis. Never needed when a fawazahmed0
    // source was already the one that answered.
    const sourceRates =
      primary.source === OPEN_ER_API
        ? fillMissingRates(
            primary.rates,
            (await this.fetchFromSources(GAP_FILL_SOURCES, normalizedCurrency))
              ?.rates ?? null,
          )
        : primary.rates

    const normalizedRates: ExchangeRates = {
      date: sourceRates.date,
      baseCurrency: normalizedCurrency,
      rates: sourceRates.rates,
    }

    logger.debug("Normalized rates", {
      baseCurrency: normalizedCurrency,
      date: normalizedRates.date,
      rateCount: Object.keys(normalizedRates.rates).length,
      sampleRates: Object.keys(normalizedRates.rates).slice(0, 5),
    })
    this.updateCache(normalizedCurrency, normalizedRates)
    return normalizedRates
  }

  /**
   * Rates for a base currency, falling back to an expired cache entry when the
   * network gives nothing. `stale` says which one the caller got. No toasts.
   */
  private async loadRates(
    normalizedCurrency: string,
    signal?: AbortSignal,
  ): Promise<{ rates: ExchangeRates; stale: boolean } | null> {
    const fresh = await this.loadFreshRates(normalizedCurrency, signal)
    if (fresh) return { rates: fresh, stale: false }
    const stale = this.getCachedRates(normalizedCurrency, true)
    return stale ? { rates: stale, stale: true } : null
  }

  private warnInvalidCurrency(): void {
    this.showToast("screens.settings.exchangeRates.errors.invalidCurrencyCode")
  }

  /**
   * Fetches exchange rates from the API.
   *
   * @remarks
   * Serves a still-valid cache entry, otherwise fetches the latest rates.
   * Tries main source first, then fallback source.
   *
   * @param baseCurrency - Base currency code (e.g., "USD")
   * @returns Exchange rates object or null if fetch fails
   */
  async fetchRates(
    baseCurrency: string,
    signal?: AbortSignal,
  ): Promise<ExchangeRates | null> {
    const normalizedCurrency = normalizeCurrencyCode(baseCurrency)

    // Use registry service for validation
    if (!currencyRegistryService.isCurrencyCodeValid(baseCurrency)) {
      this.warnInvalidCurrency()
      logger.error("Invalid currency code", {
        baseCurrency,
        error: `Invalid currency code: ${baseCurrency}. Please use a valid ISO 4217 currency code.`,
      })
      return null
    }

    const rates = await this.loadFreshRates(normalizedCurrency, signal)
    if (!rates && !signal?.aborted) {
      this.showToast("screens.settings.exchangeRates.errors.fetchFailed")
    }
    return rates
  }

  /**
   * Tries to fetch rates, returning an expired cached value if the fetch fails.
   * One toast per call: the failure, or that cached rates are in use.
   *
   * @param baseCurrency - Base currency code
   * @returns Exchange rates or null if unavailable
   */
  async tryFetchRates(
    baseCurrency: string,
    signal?: AbortSignal,
  ): Promise<ExchangeRates | null> {
    const normalizedCurrency = normalizeCurrencyCode(baseCurrency)
    if (!currencyRegistryService.isCurrencyCodeValid(baseCurrency)) {
      this.warnInvalidCurrency()
      return null
    }

    const loaded = await this.loadRates(normalizedCurrency, signal)
    if (signal?.aborted) return null
    if (!loaded) {
      this.showToast("screens.settings.exchangeRates.errors.fetchFailed")
      return null
    }
    if (loaded.stale) {
      this.showToast(
        "screens.settings.exchangeRates.errors.usingCachedRates",
        "warn",
      )
    }
    return loaded.rates
  }

  /**
   * Gets exchange rate for a specific currency pair.
   *
   * @remarks
   * Always returns latest rates. Direction matches Flutter: "to per 1 from"
   * so that creditAmount = amount * rate. Returns 1 if both currencies are the same.
   *
   * @param fromCurrency - Source currency code (debit account)
   * @param toCurrency - Target currency code (credit account)
   * @returns Exchange rate (amount of toCurrency per 1 fromCurrency) or null
   */
  async getRate(
    fromCurrency: string,
    toCurrency: string,
    signal?: AbortSignal,
  ): Promise<number | null> {
    // Validate both currencies
    if (!currencyRegistryService.isCurrencyCodeValid(fromCurrency)) {
      const errorMessage = `Invalid source currency code: ${fromCurrency}. Please use a valid ISO 4217 currency code.`
      this.showToast(
        "screens.settings.exchangeRates.errors.invalidCurrencyCode",
      )
      logger.error("Invalid source currency code", {
        fromCurrency,
        error: errorMessage,
      })
      return null
    }

    if (!currencyRegistryService.isCurrencyCodeValid(toCurrency)) {
      const errorMessage = `Invalid target currency code: ${toCurrency}. Please use a valid ISO 4217 currency code.`
      this.showToast(
        "screens.settings.exchangeRates.errors.invalidCurrencyCode",
      )
      logger.error("Invalid target currency code", {
        toCurrency,
        error: errorMessage,
      })
      return null
    }

    // Same currency
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
      return 1
    }

    const fromCurrencyLower = normalizeCurrencyCode(fromCurrency)
    const toCurrencyLower = normalizeCurrencyCode(toCurrency)
    let usedStale = false

    const direct = await this.loadRates(fromCurrencyLower, signal)
    if (signal?.aborted) return null
    const directRate = direct?.rates.rates[toCurrencyLower]
    if (direct && typeof directRate === "number") {
      if (direct.stale) this.warnUsingCachedRates()
      return directRate
    }
    usedStale ||= direct?.stale ?? false

    // Fallback: many APIs only support USD (or a few bases). Try fetching with toCurrency as base and invert.
    const reverse = await this.loadRates(toCurrencyLower, signal)
    if (signal?.aborted) return null
    const inverse = reverse?.rates.rates[fromCurrencyLower]
    if (reverse && typeof inverse === "number" && inverse !== 0) {
      if (usedStale || reverse.stale) this.warnUsingCachedRates()
      return 1 / inverse
    }

    const errorMessage = `Exchange rate not found for ${fromCurrency} to ${toCurrency}. Please try again or set a custom rate in Settings.`
    this.showToast("screens.settings.exchangeRates.errors.rateNotFound", "warn")
    logger.warn("Exchange rate not found", {
      fromCurrency,
      toCurrency,
      error: errorMessage,
    })
    return null
  }

  private warnUsingCachedRates(): void {
    this.showToast(
      "screens.settings.exchangeRates.errors.usingCachedRates",
      "warn",
    )
  }

  /**
   * Gets cached rates if available and not expired.
   *
   * @param currencyCode - Currency code
   * @param allowStale - Also return an expired entry. Expired entries stay in
   * the cache until a fetch replaces them, so they can back a failed fetch.
   * @returns Cached rates or null if expired/not found
   * @internal
   */
  private getCachedRates(
    currencyCode: string,
    allowStale = false,
  ): ExchangeRates | null {
    const entry = this.cache.get(currencyCode)
    if (!entry) {
      return null
    }

    // Check if cache is expired
    const now = new Date()
    const age = now.getTime() - entry.fetchedAt.getTime()
    if (age > this.CACHE_TTL_MS && !allowStale) {
      return null
    }

    return entry.rates
  }

  /**
   * Updates cache with new rates.
   *
   * @param currencyCode - Currency code
   * @param rates - Exchange rates to cache
   * @internal
   */
  private updateCache(currencyCode: string, rates: ExchangeRates): void {
    this.cache.set(currencyCode, {
      rates,
      fetchedAt: new Date(),
    })
  }

  /**
   * Clears all cached exchange rates.
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clears cache for a specific currency.
   *
   * @param currencyCode - Currency code to clear from cache
   */
  clearCacheForCurrency(currencyCode: string): void {
    const normalizedCurrency = normalizeCurrencyCode(currencyCode)
    this.cache.delete(normalizedCurrency)
  }
}

// Export singleton instance
export const exchangeRatesService = ExchangeRatesService.getInstance()
