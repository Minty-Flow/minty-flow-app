/**
 * Budget type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

export const BudgetPeriodEnum = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  CUSTOM: "custom",
} as const

export type BudgetPeriod =
  (typeof BudgetPeriodEnum)[keyof typeof BudgetPeriodEnum]

/**
 * Budget domain type for UI/API usage.
 *
 * Budget domain type. Single source of truth for the Budget shape.
 *
 * Spending is computed at query time from linked transactions —
 * spent_amount is not stored in the database.
 *
 * accountIds is a derived field populated from the budget_accounts
 * join table by the service layer.
 *
 * Icon can be:
 * - MaterialCommunityIcons name
 * - Single emoji
 * - Single letter
 * - (Future) Image URL or path
 */
export interface Budget {
  id: string
  name: string
  amount: number
  currencyCode: string
  period: BudgetPeriod
  startDate: Date
  endDate: Date | null
  alertThreshold: number | null
  isActive: boolean
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  accountIds: string[] // Derived from budget_accounts join table by service
  categoryIds: string[] // Derived from budget_categories join table by service
  createdAt: Date
  updatedAt: Date
}
