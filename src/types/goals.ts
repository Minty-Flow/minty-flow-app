/**
 * Goal type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

/**
 * Goal domain type for UI/API usage.
 *
 * This is the single source of truth for the Goal shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
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
  description: string | null
  targetAmount: number
  currentAmount: number
  currencyCode: string
  targetDate: Date | null
  icon: string | null
  color: string | null
  isCompleted: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
  // Computed properties (from model getters)
  progressPercentage: number
  remainingAmount: number
}

export interface GoalFormData {
  name: string
  description?: string
  targetAmount: number
  currencyCode: string
  targetDate?: Date
  icon?: string
  color?: string
}
