/**
 * Category type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

import type { TransactionType } from "./transactions"

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
  type: TransactionType
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  transactionCount: number
  createdAt: Date
  updatedAt: Date
}
