/**
 * Category type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

/**
 * Category type: unlike transactions, categories can only be expense or
 * income — transfers move money between accounts and are never categorized.
 */
export const CategoryTypeEnum = {
  EXPENSE: "expense",
  INCOME: "income",
} as const

export type CategoryType =
  (typeof CategoryTypeEnum)[keyof typeof CategoryTypeEnum]

/**
 * Category domain type for UI/API usage.
 *
 * Category domain type. Single source of truth for the Category shape.
 *
 * Color scheme is stored as `colorSchemeName` and resolved
 * at runtime via the theme registry as `colorScheme`.
 *
 * Icon can be:
 * - MaterialCommunityIcons name (e.g., "wallet", "cart-outline")
 * - Single emoji (e.g., "🍕", "💰")
 * - Single letter (e.g., "F", "G")
 * - (Future) Image URL or path
 */
export interface Category {
  id: string
  name: string
  type: CategoryType
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  transactionCount: number
  createdAt: Date
  updatedAt: Date
}
