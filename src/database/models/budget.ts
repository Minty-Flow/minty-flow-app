import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Budget, BudgetPeriod } from "~/types/budgets"

/**
 * Budget model representing spending limits tied to categories and accounts.
 *
 * Implements the Budget domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 *
 * accountIds is NOT stored directly on this model — it is derived from the
 * budget_accounts join table by the service layer and passed in at mapping time.
 */
export default class BudgetModel extends Model implements Budget {
  static table = "budgets"

  static associations = {
    budget_accounts: { type: "has_many", foreignKey: "budget_id" },
    budget_categories: { type: "has_many", foreignKey: "budget_id" },
  } as const

  @field("name") name!: string
  @field("amount") amount!: number
  @field("currency_code") currencyCode!: string
  @field("period") period!: BudgetPeriod
  @date("start_date") startDate!: Date
  @date("end_date") endDate!: Date | null
  @field("alert_threshold") alertThreshold!: number | null
  @field("is_active") isActive!: boolean
  @field("icon") icon!: string | null
  @field("color_scheme_name") colorSchemeName!: string | null
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  /**
   * Satisfies the Budget interface contract.
   * Populated externally by the service layer from the budget_accounts join table.
   */
  accountIds: string[] = []

  /**
   * Satisfies the Budget interface contract.
   * Populated externally by the service layer from the budget_categories join table.
   */
  categoryIds: string[] = []

  /**
   * Gets the color scheme object from the theme registry.
   * To change the scheme, assign `colorSchemeName` directly inside a `model.update()` callback.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }
}
