/**
 * Goal type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

export const GoalTypeEnum = {
  SAVINGS: "savings",
  EXPENSE: "expense",
} as const

export type GoalType = (typeof GoalTypeEnum)[keyof typeof GoalTypeEnum]

/**
 * Goal domain type for UI/API usage.
 *
 * Goal domain type. Single source of truth for the Goal shape.
 *
 * accountIds is a derived field populated from the goal_accounts
 * join table by the service layer.
 *
 * Icon can be:
 * - MaterialCommunityIcons name
 * - Single emoji
 * - Single letter
 * - (Future) Image URL or path
 */
export interface Goal {
  id: string
  name: string
  goalType: GoalType
  description: string | null
  targetAmount: number
  currencyCode: string
  targetDate: Date | null
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  isArchived: boolean
  accountIds: string[] // Derived from goal_accounts join table by service
  createdAt: Date
  updatedAt: Date
}
