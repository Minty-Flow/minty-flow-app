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
