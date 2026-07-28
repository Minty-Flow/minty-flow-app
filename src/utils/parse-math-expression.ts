/**
 * Safe math expression parser — no eval, no Function.
 * Supports: numbers, + - * / with correct precedence, unary minus.
 * Returns { value } or { error } for division by zero and invalid expressions.
 */

const ALLOWED_INPUT_REGEX = /[^0-9+\-*/.]/g

export function sanitizeAmountInput(text: string): string {
  return text.replace(ALLOWED_INPUT_REGEX, "")
}

export function exceedsFractionDigits(
  expression: string,
  maximumFractionDigits: number,
): boolean {
  return expression.split(/[+\-*/]/).some((value) => {
    const fraction = value.split(".")[1]
    return maximumFractionDigits === 0
      ? fraction !== undefined
      : fraction !== undefined && fraction.length > maximumFractionDigits
  })
}

type Token =
  | { type: "number"; value: Rational }
  | { type: "op"; value: "+" | "-" | "*" | "/" }

type Rational = { numerator: bigint; denominator: bigint }

function decimalToRational(value: string, negative = false): Rational {
  const [whole, fraction = ""] = value.split(".")
  const denominator = 10n ** BigInt(fraction.length)
  const numerator = BigInt(whole || "0") * denominator + BigInt(fraction || "0")
  return { numerator: negative ? -numerator : numerator, denominator }
}

function tokenize(expression: string): Token[] | null {
  const sanitized = expression.replace(/[^0-9+\-*/.]/g, "").trim()
  if (!sanitized) return null

  const tokens: Token[] = []
  let i = 0

  while (i < sanitized.length) {
    const c = sanitized[i]

    if (c === "+" || c === "*" || c === "/") {
      tokens.push({ type: "op", value: c })
      i++
      continue
    }

    if (c === "-") {
      const last = tokens[tokens.length - 1]
      const isUnary = tokens.length === 0 || last?.type === "op"
      if (isUnary) {
        i++
        let num = ""
        while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
          num += sanitized[i]
          i++
        }
        if (num === "" || num === ".") return null
        if (/\.\d*\./.test(num)) return null
        tokens.push({ type: "number", value: decimalToRational(num, true) })
      } else {
        tokens.push({ type: "op", value: "-" })
        i++
      }
      continue
    }

    if (/[0-9.]/.test(c)) {
      let num = ""
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        num += sanitized[i]
        i++
      }
      if (/\.\d*\./.test(num)) return null
      tokens.push({ type: "number", value: decimalToRational(num) })
      continue
    }

    i++
  }

  return tokens
}

export type MathErrorCode =
  | "invalidExpression"
  | "divisionByZero"
  | "invalidResult"

export type ParseResult = { value: number } | { error: MathErrorCode }

function evaluateMathExpression(
  expression: string,
): Rational | { error: MathErrorCode } {
  const raw = tokenize(expression)
  if (!raw || raw.length === 0) return { error: "invalidExpression" }
  const tokenList = raw as Token[]

  let pos = 0

  function parseFactor(): Rational | { error: MathErrorCode } {
    if (pos >= tokenList.length) return { error: "invalidExpression" }
    const t = tokenList[pos]
    if (t.type === "number") {
      pos++
      return t.value
    }
    if (t.type === "op" && t.value === "-") {
      pos++
      const f = parseFactor()
      if ("error" in f) return f
      return { numerator: -f.numerator, denominator: f.denominator }
    }
    return { error: "invalidExpression" }
  }

  function parseTerm(): Rational | { error: MathErrorCode } {
    let left = parseFactor()
    if ("error" in left) return left
    while (
      pos < tokenList.length &&
      tokenList[pos].type === "op" &&
      (tokenList[pos].value === "*" || tokenList[pos].value === "/")
    ) {
      const op = tokenList[pos].value
      pos++
      const right = parseFactor()
      if ("error" in right) return right
      if (op === "/" && right.numerator === 0n) {
        return { error: "divisionByZero" }
      }
      left =
        op === "*"
          ? {
              numerator: left.numerator * right.numerator,
              denominator: left.denominator * right.denominator,
            }
          : {
              numerator: left.numerator * right.denominator,
              denominator: left.denominator * right.numerator,
            }
    }
    return left
  }

  function parseExpr(): Rational | { error: MathErrorCode } {
    let left = parseTerm()
    if ("error" in left) return left
    while (
      pos < tokenList.length &&
      tokenList[pos].type === "op" &&
      (tokenList[pos].value === "+" || tokenList[pos].value === "-")
    ) {
      const op = tokenList[pos].value
      pos++
      const right = parseTerm()
      if ("error" in right) return right
      left = {
        numerator:
          left.numerator * right.denominator +
          (op === "+" ? 1n : -1n) * right.numerator * left.denominator,
        denominator: left.denominator * right.denominator,
      }
    }
    return left
  }

  const result = parseExpr()
  if ("error" in result) return result
  if (pos < tokenList.length) return { error: "invalidExpression" }
  return result
}

export function parseScaledMathExpression(
  expression: string,
  fractionDigits: number,
): ParseResult {
  const result = evaluateMathExpression(expression)
  if ("error" in result) return result

  let numerator = result.numerator * 10n ** BigInt(fractionDigits)
  let denominator = result.denominator
  if (denominator < 0n) {
    numerator = -numerator
    denominator = -denominator
  }
  let rounded = numerator / denominator
  const remainder = numerator % denominator
  if (
    remainder !== 0n &&
    2n * (remainder < 0n ? -remainder : remainder) >= denominator
  ) {
    rounded += numerator < 0n ? -1n : 1n
  }
  const value = Number(rounded)
  if (!Number.isSafeInteger(value)) return { error: "invalidResult" }
  return { value }
}
