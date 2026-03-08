import { Model } from "@nozbe/watermelondb"
import { date, field } from "@nozbe/watermelondb/decorators"

import type { Goal as GoalType } from "../../types/goals"

/**
 * Goal model representing financial goals.
 *
 * Implements the Goal domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 */
export default class GoalModel extends Model implements GoalType {
  static table = "goals"

  @field("name") name!: string
  @field("description") description!: string | null
  @field("target_amount") targetAmount!: number
  @field("current_amount") currentAmount!: number
  @field("currency_code") currencyCode!: string
  @date("target_date") targetDate!: Date | null
  @field("icon") icon!: string | null
  @field("color") color!: string | null
  @field("is_completed") isCompleted!: boolean
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the progress percentage (0-100).
   * This computed property satisfies the domain type's progressPercentage requirement.
   */
  get progressPercentage(): number {
    if (this.targetAmount === 0) return 0
    return Math.min(100, (this.currentAmount / this.targetAmount) * 100)
  }

  /**
   * Gets the remaining amount to reach the goal.
   * This computed property satisfies the domain type's remainingAmount requirement.
   */
  get remainingAmount(): number {
    return Math.max(0, this.targetAmount - this.currentAmount)
  }
}
