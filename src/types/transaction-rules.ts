/**
 * Auto-categorisation rules. Deterministic string matches only — no ML.
 */

export const RuleMatchFieldEnum = {
  TITLE: "title",
  DESCRIPTION: "description",
} as const
export type RuleMatchField =
  (typeof RuleMatchFieldEnum)[keyof typeof RuleMatchFieldEnum]

export const RuleMatchTypeEnum = {
  CONTAINS: "contains",
  EQUALS: "equals",
  STARTS_WITH: "starts_with",
} as const
export type RuleMatchType =
  (typeof RuleMatchTypeEnum)[keyof typeof RuleMatchTypeEnum]

export interface TransactionRule {
  id: string
  matchField: RuleMatchField
  matchType: RuleMatchType
  matchValue: string
  setCategoryId: string | null
  setSubtype: string | null
  setTagIds: string[] | null
  priority: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type CategorySource = "manual" | "rule"
