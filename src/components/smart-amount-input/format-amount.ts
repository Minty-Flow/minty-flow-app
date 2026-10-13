import { formatMoney } from "~/utils/number-format"

/**
 * The amount as the input shows it while it is not being edited: grouped, no
 * currency symbol (the symbol sits beside the field), empty for zero. A negative
 * amount keeps its minus sign, as it does once the field is focused; the field is
 * also used for balances that can be below zero.
 */
export function formatAmountText(
  valueMinor: number,
  currencyCode: string,
): string {
  if (valueMinor === 0) return ""
  return formatMoney(valueMinor, currencyCode, { hideSymbol: true })
}

/** The result of a typed calculation, with its sign (it can come out negative). */
export function formatAmountPreview(
  valueMinor: number,
  currencyCode: string,
): string {
  return formatMoney(valueMinor, currencyCode)
}
