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

// Types for API response
// The API returns: { date: string, [baseCurrency]: { [currencyCode]: number } }
interface ExchangeRatesResponse {
  date: string
  [baseCurrency: string]: string | Record<string, number>
}

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
   * Fetches exchange rates from the API.
   *
   * @remarks
   * Always fetches latest rates for consistency.
   * Tries main source first, then fallback source.
   *
   * @param baseCurrency - Base currency code (e.g., "USD")
   * @returns Exchange rates object or null if fetch fails
   */
  async fetchRates(baseCurrency: string): Promise<ExchangeRates | null> {
    const normalizedCurrency = normalizeCurrencyCode(baseCurrency)

    // Use registry service for validation
    if (!currencyRegistryService.isCurrencyCodeValid(baseCurrency)) {
      const errorMessage = `Invalid currency code: ${baseCurrency}. Please use a valid ISO 4217 currency code.`
      this.showToast(
        "screens.settings.exchangeRates.errors.invalidCurrencyCode",
      )
      logger.error("Invalid currency code", {
        baseCurrency,
        error: errorMessage,
      })
      return null
    }

    // Check cache first
    const cached = this.getCachedRates(normalizedCurrency)
    if (cached) {
      return cached
    }

    let apiResponse: ExchangeRatesResponse | null = null

    // Try main source first
    try {
      const mainUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${normalizedCurrency}.min.json`
      logger.debug("Fetching from main source", { url: mainUrl })

      const response = await fetch(mainUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = (await response.json()) as ExchangeRatesResponse
      logger.debug("Successfully fetched rates", {
        baseCurrency,
        date: data.date,
        responseKeys: Object.keys(data),
        hasBaseCurrency: normalizedCurrency in data,
        ratesDataExists: typeof data[normalizedCurrency] === "object",
      })
      apiResponse = data
    } catch (error) {
      logger.warn("Failed to fetch exchange rates from main source", {
        baseCurrency,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Try fallback source if main source failed
    if (!apiResponse) {
      try {
        const fallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/${normalizedCurrency}.min.json`
        logger.debug("Trying fallback source", { url: fallbackUrl })

        const response = await fetch(fallbackUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as ExchangeRatesResponse
        logger.debug("Successfully fetched rates from fallback", {
          baseCurrency,
          date: data.date,
          responseKeys: Object.keys(data),
          hasBaseCurrency: normalizedCurrency in data,
          ratesDataExists: typeof data[normalizedCurrency] === "object",
        })
        apiResponse = data
      } catch (error) {
        logger.warn("Failed to fetch exchange rates from fallback source", {
          baseCurrency,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    if (!apiResponse) {
      const errorMessage = `Failed to fetch exchange rates for ${baseCurrency} from all sources. Please check your internet connection and try again.`
      this.showToast("screens.settings.exchangeRates.errors.fetchFailed")
      logger.error(errorMessage)
      return null
    }

    // Normalize the response structure
    // API returns: { date: string, [baseCurrency]: { [currencyCode]: number } }
    const ratesData = apiResponse[normalizedCurrency]

    if (
      !ratesData ||
      typeof ratesData !== "object" ||
      Array.isArray(ratesData)
    ) {
      this.showToast("screens.settings.exchangeRates.errors.invalidData")
      logger.error("Invalid API response structure", {
        baseCurrency: normalizedCurrency,
        responseKeys: Object.keys(apiResponse),
        ratesDataType: typeof ratesData,
        isArray: Array.isArray(ratesData),
      })
      return null
    }

    const normalizedRates: ExchangeRates = {
      date:
        typeof apiResponse.date === "string"
          ? apiResponse.date
          : (new Date().toISOString().split("T")[0] ?? ""),
      baseCurrency: normalizedCurrency,
      rates: Object.fromEntries(
        Object.entries(ratesData as Record<string, unknown>).filter(
          ([, v]) =>
            typeof v === "number" &&
            Number.isFinite(v as number) &&
            (v as number) > 0,
        ),
      ) as Record<string, number>,
    }

    logger.debug("Normalized rates", {
      baseCurrency,
      date: normalizedRates.date,
      rateCount: Object.keys(normalizedRates.rates).length,
      sampleRates: Object.keys(normalizedRates.rates).slice(0, 5),
    })
    // Update cache
    this.updateCache(normalizedCurrency, normalizedRates)
    return normalizedRates
  }
  /**
   * Tries to fetch rates, returning cached value if fetch fails.
   *
   * @param baseCurrency - Base currency code
   * @returns Exchange rates or null if unavailable
   */
  async tryFetchRates(baseCurrency: string): Promise<ExchangeRates | null> {
    logger.debug("Fetching exchange rates", { baseCurrency })
    const rates = await this.fetchRates(baseCurrency)

    // If fetch failed, try to return cached value
    if (!rates) {
      const normalizedCurrency = normalizeCurrencyCode(baseCurrency)
      const cached = this.getCachedRates(normalizedCurrency)
      if (cached) {
        this.showToast(
          "screens.settings.exchangeRates.errors.usingCachedRates",
          "warn",
        )
      }
      return cached
    }

    return rates
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

    let rates = await this.tryFetchRates(fromCurrency)
    const fromCurrencyLower = normalizeCurrencyCode(fromCurrency)
    const toCurrencyLower = normalizeCurrencyCode(toCurrency)

    if (rates?.rates && typeof rates.rates[toCurrencyLower] === "number") {
      return rates.rates[toCurrencyLower]
    }

    // Fallback: many APIs only support USD (or a few bases). Try fetching with toCurrency as base and invert.
    rates = await this.tryFetchRates(toCurrency)
    if (rates?.rates && typeof rates.rates[fromCurrencyLower] === "number") {
      const inverse = rates.rates[fromCurrencyLower]
      if (inverse !== 0) return 1 / inverse
    }

    const errorMessage = `Exchange rate not found for ${fromCurrency} to ${toCurrency}. Please try again or set a custom rate in Settings.`
    this.showToast("screens.settings.exchangeRates.errors.rateNotFound")
    logger.error("Exchange rate not found", {
      fromCurrency,
      toCurrency,
      error: errorMessage,
    })
    return null
  }

  /**
   * Gets cached rates if available and not expired.
   *
   * @param currencyCode - Currency code
   * @returns Cached rates or null if expired/not found
   * @internal
   */
  private getCachedRates(currencyCode: string): ExchangeRates | null {
    const entry = this.cache.get(currencyCode)
    if (!entry) {
      return null
    }

    // Check if cache is expired
    const now = new Date()
    const age = now.getTime() - entry.fetchedAt.getTime()
    if (age > this.CACHE_TTL_MS) {
      // Remove expired entry
      this.cache.delete(currencyCode)
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
