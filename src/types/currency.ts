/**
 * Currency information interface.
 */
export interface Currency {
  /** ISO 4217 currency code (e.g., "USD", "EUR") */
  code: string
  /** Currency name (e.g., "US Dollar", "Euro") */
  name: string
  /** Country or region name */
  country: string
  /** Currency symbol (e.g., "$", "€") */
  symbol?: string
  /** Whether this is a cryptocurrency */
  isCrypto?: boolean
  /** Whether this is a custom user-defined currency */
  isCustom?: boolean
  /** ISO-style exponent used to store monetary values as minor-unit integers. */
  minorUnitDigits: number
}

/**
 * Custom currency data with exchange rate function.
 */
export interface CustomCurrencyData extends Currency {
  /** Always true for custom currencies */
  isCustom: true
  /** Optional function to get exchange rate for a given currency code */
  rateFor?: (currencyCode: string) => number | null
}

/**
 * Map of currency codes to their symbols.
 */
export interface CurrencySymbolMap {
  [code: string]: string
}
