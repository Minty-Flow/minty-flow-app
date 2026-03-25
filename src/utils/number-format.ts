import * as Localization from "expo-localization"

import { currencyRegistryService } from "~/services/currency-registry"

const DEFAULT_LOCALE = "en-US"

// ------------------------
// Calculator Configuration
// ------------------------
export const CALCULATOR_CONFIG = {
  MAX_DIGITS: 14,
  MAX_DECIMALS: 2,
  DEFAULT_DISPLAY: "0",
} as const

// ------------------------
// Locale Resolution (cached)
// ------------------------
let cachedLocale: string | null = null

const getDefaultLocale = (): string => {
  if (cachedLocale) return cachedLocale
  cachedLocale = Localization.getLocales()[0]?.languageTag ?? DEFAULT_LOCALE
  return cachedLocale
}

// ------------------------
// Internal helpers
// ------------------------
const getCurrencyLabel = (
  currency: string,
  currencyDisplay: Intl.NumberFormatOptions["currencyDisplay"] = "symbol",
): string => {
  if (currencyDisplay === "code") return currency
  if (currencyDisplay === "name") {
    return currencyRegistryService.getCurrencyName(currency)
  }
  return currencyRegistryService.getCurrencySymbol(currency)
}

const getSignPrefix = (
  signDisplay: Intl.NumberFormatOptions["signDisplay"],
  value: number,
): string => {
  if (signDisplay === "never") return ""
  if (value === 0 && signDisplay === "exceptZero") return ""
  if (value < 0) return "-"
  if (signDisplay === "always" || signDisplay === "exceptZero") return "+"
  return ""
}

const formatDecimal = (
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions,
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = "standard",
    signDisplay = "auto",
  } = options

  const sign = getSignPrefix(signDisplay, value)

  const formatted = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(Math.abs(value))

  return `${sign}${formatted}`
}

interface NumberFormatterOptions
  extends Omit<Intl.NumberFormatOptions, "style" | "currencySign"> {
  showCurrency?: boolean
}

const numberFormatter = (
  value: number,
  options: NumberFormatterOptions,
  locale: string,
): string => {
  const {
    currency,
    currencyDisplay,
    showCurrency = true,
    signDisplay = "auto",
    ...decimalOptions
  } = options

  const base = formatDecimal(value, locale, {
    ...decimalOptions,
    signDisplay,
  })

  if (!currency || !showCurrency) return base

  const label = getCurrencyLabel(currency, currencyDisplay)
  const sign = base.startsWith("-") || base.startsWith("+") ? base[0] : ""
  const number = base.replace(/^[+-]/, "")

  return `${sign}${label}${number}`
}

// ------------------------
// Formatter memoization
// ------------------------
const CACHE_MAX_SIZE = 500

type CacheKey = string
const cache = new Map<CacheKey, string>()

const getCachedFormatted = (
  value: number,
  locale: string,
  options: NumberFormatterOptions,
): string => {
  const key = `${locale}|${value}|${options.currency ?? ""}|${options.currencyDisplay ?? "symbol"}|${options.minimumFractionDigits}|${options.maximumFractionDigits}|${options.signDisplay}|${options.notation ?? "standard"}|${options.showCurrency ?? true}`

  // Check cache
  const cached = cache.get(key)
  if (cached) {
    // Move to end to mark as recently used (true LRU)
    cache.delete(key)
    cache.set(key, cached)
    return cached
  }

  // Compute formatted value
  const formatted = numberFormatter(value, options, locale)

  // Evict oldest if over limit
  if (cache.size >= CACHE_MAX_SIZE) {
    const firstKey = cache.keys().next().value
    if (firstKey !== undefined) cache.delete(firstKey)
  }

  // Store new value
  cache.set(key, formatted)
  return formatted
}

// ------------------------
// Public formatter options
// ------------------------
interface FormatDisplayValueOptions {
  currency?: string
  currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"]
  locale?: string
  compact?: boolean
  hideSign?: boolean
  showSign?: boolean
  hideSymbol?: boolean
  addParentheses?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

// ------------------------
// Public formatter (single source of truth)
// ------------------------
export const formatDisplayValue = (
  raw: string | number,
  options: FormatDisplayValueOptions = {},
): string => {
  const {
    currency,
    currencyDisplay,
    locale,
    compact = false,
    hideSign = false,
    showSign = false,
    hideSymbol = false,
    addParentheses = false,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options

  // Convert number to string
  const stringValue = typeof raw === "number" ? raw.toString() : raw
  const resolvedLocale = locale ?? getDefaultLocale()

  // Determine sign display
  const signDisplayValue: Intl.NumberFormatOptions["signDisplay"] = hideSign
    ? "never"
    : showSign
      ? "exceptZero"
      : "auto"

  // Allow "." or "123."
  if (stringValue.endsWith(".")) {
    const base = stringValue.slice(0, -1)
    const num = base === "" ? 0 : Number(base)
    if (Number.isNaN(num)) return "0."

    const formatted = getCachedFormatted(num, resolvedLocale, {
      currency: hideSymbol ? undefined : currency,
      currencyDisplay,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      signDisplay: signDisplayValue,
      notation: compact ? "compact" : "standard",
      showCurrency: !hideSymbol,
    })

    return `${formatted}.`
  }

  const num = Number(stringValue)
  if (Number.isNaN(num)) {
    if (stringValue === ".") return "0."
    return CALCULATOR_CONFIG.DEFAULT_DISPLAY
  }

  // Determine fraction digits
  let minDecimals = minimumFractionDigits ?? 0
  const maxDecimals = maximumFractionDigits ?? CALCULATOR_CONFIG.MAX_DECIMALS

  // If raw string has decimals and no explicit min was set, preserve them
  // Only check for string inputs (numbers won't have trailing decimals)
  if (
    minimumFractionDigits === undefined &&
    typeof raw === "string" &&
    stringValue.includes(".")
  ) {
    const decimals = stringValue.split(".")[1]?.length ?? 0
    minDecimals = Math.min(decimals, maxDecimals)
  }

  let result = getCachedFormatted(num, resolvedLocale, {
    currency: hideSymbol ? undefined : currency,
    currencyDisplay,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
    signDisplay: signDisplayValue,
    notation: compact ? "compact" : "standard",
    showCurrency: !hideSymbol,
  })

  // Handle parentheses for negative values
  if (addParentheses && num < 0) {
    result = result.replace(/^-/, "")
    return `(${result})`
  }

  return result
}
