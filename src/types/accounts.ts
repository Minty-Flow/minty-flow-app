/**
 * Account type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

export const AccountTypeEnum = {
  CHECKING: "checking",
  SAVINGS: "savings",
  CREDIT: "credit",
  INVESTMENT: "investment",
  OTHER: "other",
} as const

export type AccountType = (typeof AccountTypeEnum)[keyof typeof AccountTypeEnum]

/**
 * Account domain type for UI/API usage.
 *
 * Account domain type. Single source of truth for the Account shape.
 *
 * Icon can be:
 * - MaterialCommunityIcons name
 * - Single emoji
 * - Single letter
 * - (Future) Image URL or path
 */
export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currencyCode: string
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  isPrimary: boolean
  excludeFromBalance: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
  sortOrder: number | null
}
