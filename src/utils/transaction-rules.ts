import type { RuleMatchType, TransactionRule } from "~/types/transaction-rules"

/** The parts of a transaction draft a rule reads and may fill. */
export interface RuleTarget {
  title: string | null
  description: string | null
  categoryId: string | null
  subtype: string | null
  tags: string[]
  isTransfer: boolean
}

export interface RulePatch {
  categoryId?: string
  subtype?: string
  tags?: string[]
  /** Set only when `categoryId` is filled by a rule. */
  categorySource?: "rule"
}

function fieldMatches(
  field: string,
  type: RuleMatchType,
  rawValue: string,
): boolean {
  const f = field.trim().toLowerCase()
  const v = rawValue.trim().toLowerCase()
  if (!v) return false
  if (type === "equals") return f === v
  if (type === "starts_with") return f.startsWith(v)
  return f.includes(v)
}

/**
 * First active rule (ascending priority, id as tie-break) whose match
 * succeeds and that has something to contribute wins. Rules only fill an
 * empty target field and never touch transfers.
 */
export function applyRules(
  target: RuleTarget,
  rules: TransactionRule[],
): RulePatch {
  if (target.isTransfer) return {}

  const ordered = rules
    .filter((r) => r.isActive)
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))

  for (const rule of ordered) {
    const field =
      rule.matchField === "title" ? target.title : target.description
    if (!field) continue
    if (!fieldMatches(field, rule.matchType, rule.matchValue)) continue

    const patch: RulePatch = {}
    if (rule.setCategoryId && !target.categoryId) {
      patch.categoryId = rule.setCategoryId
      patch.categorySource = "rule"
    }
    if (rule.setSubtype && !target.subtype) {
      patch.subtype = rule.setSubtype
    }
    if (
      rule.setTagIds &&
      rule.setTagIds.length > 0 &&
      target.tags.length === 0
    ) {
      patch.tags = [...rule.setTagIds]
    }
    if (Object.keys(patch).length > 0) return patch
  }

  return {}
}
