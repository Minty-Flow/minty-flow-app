/**
 * Account type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

import type { MintyColorScheme } from "~/styles/theme"

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
 * This is the single source of truth for the Account shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
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
  isArchived: boolean
  isPrimary: boolean
  excludeFromBalance: boolean
  createdAt: Date
  updatedAt: Date
  sortOrder: number | null
}

/**
 * Account summary type for list views and cards.
 * Includes calculated fields like monthly stats.
 */
// export interface AccountSummary {
//   id: string
//   name: string
//   type: string
//   icon: IconSymbolName
//   iconColor: string
//   balance: number
//   currency: string
//   currencySymbol: string
//   monthlyIn: number
//   monthlyOut: number
//   monthlyNet: number
// }
