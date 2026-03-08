import { Model } from "@nozbe/watermelondb"
import { date, field, relation } from "@nozbe/watermelondb/decorators"

import type { BudgetPeriod, Budget as BudgetType } from "../../types/budgets"
import type CategoryModel from "./category"

/**
 * Budget model representing budget limits.
 *
 * Implements the Budget domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 * - Relations use _id suffix for foreign keys
 */
export default class BudgetModel extends Model implements BudgetType {
  static table = "budgets"

  @field("name") name!: string
  @field("amount") amount!: number
  @field("spent_amount") spentAmount!: number
  @field("currency_code") currencyCode!: string
  @field("period") period!: BudgetPeriod
  @date("start_date") startDate!: Date
  @date("end_date") endDate!: Date | null
  @field("category_id") categoryId!: string | null
  @relation("categories", "category_id") category!: CategoryModel | null
  @field("alert_threshold") alertThreshold!: number | null
  @field("is_active") isActive!: boolean
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the remaining amount in the budget.
   * This computed property satisfies the domain type's remainingAmount requirement.
   */
  get remainingAmount(): number {
    return Math.max(0, this.amount - this.spentAmount)
  }

  /**
   * Gets the spending percentage (0-100+).
   * This computed property satisfies the domain type's spentPercentage requirement.
   */
  get spentPercentage(): number {
    if (this.amount === 0) return 0
    return (this.spentAmount / this.amount) * 100
  }

  /**
   * Checks if the budget has exceeded the alert threshold.
   * This computed property satisfies the domain type's isAboveAlertThreshold requirement.
   */
  get isAboveAlertThreshold(): boolean {
    if (!this.alertThreshold) return false
    return this.spentPercentage >= this.alertThreshold
  }

  /**
   * Checks if the budget has been exceeded.
   * This computed property satisfies the domain type's isExceeded requirement.
   */
  get isExceeded(): boolean {
    return this.spentAmount > this.amount
  }

  /**
   * Checks if the budget is currently active based on dates.
   * This computed property satisfies the domain type's isCurrentlyActive requirement.
   */
  get isCurrentlyActive(): boolean {
    if (!this.isActive) return false
    const now = new Date()
    if (now < this.startDate) return false
    if (this.endDate && now > this.endDate) return false
    return true
  }
}
