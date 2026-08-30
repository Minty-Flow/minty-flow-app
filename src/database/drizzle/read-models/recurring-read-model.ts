/**
 * Parse helpers for the JSON columns on `recurring_transactions`. Shared by
 * read-models that reason about recurring templates (e.g. safe-to-spend).
 */

export interface ParsedRecurringTemplate {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
}

export function parseRecurringTemplate(
  json: string,
): ParsedRecurringTemplate | null {
  try {
    const t = JSON.parse(json) as ParsedRecurringTemplate
    if (typeof t.amount !== "number" || typeof t.accountId !== "string") {
      return null
    }
    return t
  } catch {
    return null
  }
}

export function parseRecurringRange(
  json: string,
): { from: number; to: number } | null {
  try {
    const r = JSON.parse(json) as { from: number; to: number }
    if (typeof r.from !== "number" || typeof r.to !== "number") return null
    return r
  } catch {
    return null
  }
}

export function parseRecurringRules(json: string): string[] {
  try {
    const r = JSON.parse(json) as string[]
    return Array.isArray(r) ? r : []
  } catch {
    return []
  }
}
