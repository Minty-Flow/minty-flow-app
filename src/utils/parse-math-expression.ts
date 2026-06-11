/**
 * Safe math expression parser — no eval, no Function.
 * Supports: numbers, + - * / with correct precedence, unary minus.
 * Returns { value } or { error } for division by zero and invalid expressions.
 */

const ALLOWED_INPUT_REGEX = /[^0-9+\-*/.]/g

export function sanitizeAmountInput(text: string): string {
  return text.replace(ALLOWED_INPUT_REGEX, "")
}

type Token =
  | { type: "number"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" }

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
        const value = parseFloat(num)
        if (Number.isNaN(value)) return null
        tokens.push({ type: "number", value: -value })
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
      const value = parseFloat(num)
      if (Number.isNaN(value)) return null
      tokens.push({ type: "number", value })
      continue
    }

    i++
  }

  return tokens
}

export type ParseResult = { value: number } | { error: string }

export function parseMathExpression(expression: string): ParseResult {
  const raw = tokenize(expression)
  if (!raw || raw.length === 0) return { error: "Invalid expression" }
  const tokenList = raw as Token[]

  let pos = 0

  function parseFactor(): number | { error: string } {
    if (pos >= tokenList.length) return { error: "Invalid expression" }
    const t = tokenList[pos]
    if (t.type === "number") {
      pos++
      return t.value
    }
    if (t.type === "op" && t.value === "-") {
      pos++
      const f = parseFactor()
      if (typeof f === "object") return f
      return -f
    }
    return { error: "Invalid expression" }
  }

  function parseTerm(): number | { error: string } {
    let left = parseFactor()
    if (typeof left === "object") return left
    while (
      pos < tokenList.length &&
      tokenList[pos].type === "op" &&
      (tokenList[pos].value === "*" || tokenList[pos].value === "/")
    ) {
      const op = tokenList[pos].value
      pos++
      const right = parseFactor()
      if (typeof right === "object") return right
      if (op === "/" && right === 0) return { error: "Cannot divide by zero" }
      left = op === "*" ? left * right : left / right
    }
    return left
  }

  function parseExpr(): number | { error: string } {
    let left = parseTerm()
    if (typeof left === "object") return left
    while (
      pos < tokenList.length &&
      tokenList[pos].type === "op" &&
      (tokenList[pos].value === "+" || tokenList[pos].value === "-")
    ) {
      const op = tokenList[pos].value
      pos++
      const right = parseTerm()
      if (typeof right === "object") return right
      left = op === "+" ? left + right : left - right
    }
    return left
  }

  const result = parseExpr()
  if (typeof result === "object") return result
  if (pos < tokenList.length) return { error: "Invalid expression" }
  if (!Number.isFinite(result)) return { error: "Invalid result" }
  return { value: result }
}
