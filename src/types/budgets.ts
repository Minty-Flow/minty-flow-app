/**
 * Budget type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

export type BudgetPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom"

/**
 * Budget domain type for UI/API usage.
 *
 * This is the single source of truth for the Budget shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
 */
export interface Budget {
  id: string
  name: string
  amount: number
  spentAmount: number
  currencyCode: string
  period: BudgetPeriod
  startDate: Date
  endDate: Date | null
  categoryId: string | null
  alertThreshold: number | null // Percentage (e.g., 80 for 80%)
  isActive: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
  // Computed properties (from model getters)
  remainingAmount: number
  spentPercentage: number
  isAboveAlertThreshold: boolean
  isExceeded: boolean
  isCurrentlyActive: boolean
}

export interface BudgetFormData {
  name: string
  amount: number
  currencyCode: string
  period: BudgetPeriod
  startDate: Date
  endDate?: Date
  categoryId?: string
  alertThreshold?: number
  isActive?: boolean
}
