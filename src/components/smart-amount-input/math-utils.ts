export const MAX_AMOUNT_INPUT_LENGTH = 14

/**
 * Longest major-unit text that cannot overflow `Number.MAX_SAFE_INTEGER` minor
 * units for a currency with `minorUnitDigits` fraction digits. The old flat 14
 * let a field show 14 nines while the form kept 13 (map §4.3).
 */
export function maxAmountInputLength(minorUnitDigits: number): number {
  return Math.max(
    1,
    Math.floor(Math.log10(Number.MAX_SAFE_INTEGER)) - minorUnitDigits,
  )
}

// Leading minus is a sign (negative number), not an operator — so "Entered:" chip can show
export const hasMathOperation = (text: string) => {
  const trimmed = text.trim()
  const withoutLeadingMinus = trimmed.startsWith("-")
    ? trimmed.slice(1).trim()
    : trimmed
  return /[+\-*/]/.test(withoutLeadingMinus)
}

const MATH_OPERATORS = ["+", "-", "*", "/"] as const

export function isOperator(
  char: string,
): char is (typeof MATH_OPERATORS)[number] {
  return MATH_OPERATORS.includes(char as (typeof MATH_OPERATORS)[number])
}
