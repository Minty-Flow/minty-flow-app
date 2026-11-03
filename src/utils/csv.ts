/** Quote a value for a CSV cell when it holds a comma, quote or line break. */
export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Same as {@link escapeCsvField} for text the user typed. A spreadsheet reads a
 * cell that starts with `=`, `+`, `-`, `@`, a tab or a carriage return as a
 * formula, so those get a leading apostrophe, which the spreadsheet hides.
 * Numeric columns must use {@link escapeCsvField}: `-5.00` is a number, not
 * text.
 */
export function escapeCsvText(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  return escapeCsvField(/^[=+\-@\t\r]/.test(str) ? `'${str}` : str)
}
