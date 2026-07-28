import { currencyRegistryService } from "~/services/currency-registry"

export function getMinorUnitDigits(currencyCode: string): number {
  const digits = currencyRegistryService.getCurrencyMinorUnits(currencyCode)
  if (!Number.isInteger(digits) || digits < 0 || digits > 8) {
    throw new Error(`Invalid minor-unit digits for ${currencyCode}: ${digits}`)
  }
  return digits
}

export function assertMinorUnits(value: number): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Money must be a safe integer, received: ${value}`)
  }
  return value
}

export function roundToSafeInteger(value: number): number {
  if (!Number.isFinite(value)) throw new Error(`Invalid number: ${value}`)
  return assertMinorUnits(Math.sign(value) * Math.round(Math.abs(value)))
}

export function parseMajorUnits(input: string, currencyCode: string): number {
  const normalized = normalizeMajorUnitInput(input)
  if (normalized === null) {
    throw new Error(`Invalid monetary value: ${input}`)
  }
  if (!/^[+-]?(?:\d+|\d*\.\d+)$/.test(normalized)) {
    throw new Error(`Invalid monetary value: ${input}`)
  }

  const negative = normalized.startsWith("-")
  const unsigned = normalized.replace(/^[+-]/, "")
  const [whole, fraction = ""] = unsigned.split(".")
  const digits = getMinorUnitDigits(currencyCode)
  if (fraction.length > digits) {
    throw new Error(`${currencyCode} supports at most ${digits} decimal places`)
  }

  const scale = 10n ** BigInt(digits)
  const minor =
    BigInt(whole || "0") * scale + BigInt(fraction.padEnd(digits, "0") || "0")
  return assertMinorUnits(Number(negative ? -minor : minor))
}

export function normalizeMajorUnitInput(input: string): string | null {
  const compact = input.trim().replace(/\s/gu, "")
  const parts = compact.split(/([+\-*/])/)
  for (let index = 0; index < parts.length; index += 2) {
    const value = parts[index]
    if (!value) continue
    if (/^\d*(?:\.\d*)?$/.test(value)) continue
    if (/^\d{1,3}(?:,\d{3})+(?:\.\d*)?$/.test(value)) {
      parts[index] = value.replaceAll(",", "")
      continue
    }
    return null
  }
  return parts.join("")
}

/** Legacy migration boundary only. Runtime input must use parseMajorUnits. */
export function majorNumberToMinorUnits(
  value: number,
  currencyCode: string,
): number {
  if (!Number.isFinite(value)) throw new Error(`Invalid legacy money: ${value}`)
  const scale = 10 ** getMinorUnitDigits(currencyCode)
  return roundToSafeInteger(value * scale)
}

export function toMajorUnits(minorUnits: number, currencyCode: string): number {
  return assertMinorUnits(minorUnits) / 10 ** getMinorUnitDigits(currencyCode)
}

export function convertMinorUnits(
  minorUnits: number,
  fromCurrency: string,
  toCurrency: string,
  rate: number,
): number {
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Invalid conversion rate: ${rate}`)
  }
  const converted =
    toMajorUnits(minorUnits, fromCurrency) *
    rate *
    10 ** getMinorUnitDigits(toCurrency)
  return roundToSafeInteger(converted)
}

/** Preserve the displayed decimal amount when only its currency exponent changes. */
export function rescaleMinorUnits(
  minorUnits: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  assertMinorUnits(minorUnits)
  const difference =
    getMinorUnitDigits(toCurrency) - getMinorUnitDigits(fromCurrency)
  if (difference >= 0) {
    return assertMinorUnits(minorUnits * 10 ** difference)
  }

  const divisor = 10n ** BigInt(-difference)
  const value = BigInt(minorUnits)
  let rounded = value / divisor
  const remainder = value % divisor
  if (
    remainder !== 0n &&
    2n * (remainder < 0n ? -remainder : remainder) >= divisor
  ) {
    rounded += value < 0n ? -1n : 1n
  }
  return assertMinorUnits(Number(rounded))
}

export function minorUnitsToDecimalString(
  minorUnits: number,
  currencyCode: string,
): string {
  assertMinorUnits(minorUnits)
  const digits = getMinorUnitDigits(currencyCode)
  const sign = minorUnits < 0 ? "-" : ""
  const absolute = Math.abs(minorUnits)
    .toString()
    .padStart(digits + 1, "0")
  if (digits === 0) return `${sign}${absolute}`
  return `${sign}${absolute.slice(0, -digits)}.${absolute.slice(-digits)}`
}
