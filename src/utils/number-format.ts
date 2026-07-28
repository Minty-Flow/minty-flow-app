import { currencyRegistryService } from "~/services/currency-registry"
import {
  assertMinorUnits,
  getMinorUnitDigits,
  minorUnitsToDecimalString,
} from "~/utils/money"

export const NUMBER_FORMAT_LOCALE = "en-US"

export interface FormatNumberOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  notation?: Intl.NumberFormatOptions["notation"]
  signDisplay?: Intl.NumberFormatOptions["signDisplay"]
  useGrouping?: boolean
}

export interface FormatMoneyOptions {
  currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"]
  compact?: boolean
  hideSign?: boolean
  showSign?: boolean
  hideSymbol?: boolean
  addParentheses?: boolean
}

export interface FormatPercentOptions {
  maximumFractionDigits?: number
  showSign?: boolean
}

const formatterCache = new Map<string, Intl.NumberFormat>()

function getFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${NUMBER_FORMAT_LOCALE}:${JSON.stringify(options)}`
  const cached = formatterCache.get(key)
  if (cached) return cached
  const formatter = new Intl.NumberFormat(NUMBER_FORMAT_LOCALE, options)
  formatterCache.set(key, formatter)
  return formatter
}

function getCurrencyLabel(
  currency: string,
  display: Intl.NumberFormatOptions["currencyDisplay"] = "symbol",
): string {
  if (display === "code") return currency
  if (display === "name")
    return currencyRegistryService.getCurrencyName(currency)
  return currencyRegistryService.getCurrencySymbol(currency)
}

function getSign(value: number, hideSign: boolean, showSign: boolean): string {
  if (hideSign || value === 0) return ""
  if (value < 0) return "-"
  return showSign ? "+" : ""
}

function groupDigits(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  if (!Number.isFinite(value)) return "0"
  return getFormatter({
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    notation: options.notation ?? "standard",
    signDisplay: options.signDisplay ?? "auto",
    useGrouping: options.useGrouping ?? true,
  }).format(value)
}

export function formatPercent(
  percent: number,
  options: FormatPercentOptions = {},
): string {
  return `${formatNumber(percent, {
    maximumFractionDigits: options.maximumFractionDigits ?? 1,
    signDisplay: options.showSign ? "exceptZero" : "auto",
  })}%`
}

export function formatEditableNumber(raw: string): string {
  const match = /^(\d+)(?:\.(\d*))?$/.exec(raw)
  if (!match) return raw
  const whole = groupDigits(match[1])
  return match[2] === undefined ? whole : `${whole}.${match[2]}`
}

export function formatMoney(
  minorUnits: number,
  currency: string,
  options: FormatMoneyOptions = {},
): string {
  assertMinorUnits(minorUnits)
  const digits = getMinorUnitDigits(currency)
  const decimal = minorUnitsToDecimalString(minorUnits, currency)
  const negative = minorUnits < 0
  const unsigned = decimal.replace(/^-/, "")
  const [whole, rawFraction = ""] = unsigned.split(".")
  const fraction = rawFraction.replace(/0+$/, "")

  const number = options.compact
    ? formatNumber(Number(unsigned), {
        maximumFractionDigits: digits,
        notation: "compact",
      })
    : `${groupDigits(whole)}${fraction ? `.${fraction}` : ""}`

  const sign = getSign(
    minorUnits,
    options.hideSign ?? false,
    options.showSign ?? false,
  )
  const label = options.hideSymbol
    ? ""
    : getCurrencyLabel(currency, options.currencyDisplay)
  const result = `${sign}${label}${number}`

  return options.addParentheses && negative
    ? `(${result.replace(/^-/, "")})`
    : result
}
