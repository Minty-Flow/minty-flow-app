import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Goal, GoalType } from "~/types/goals"

/**
 * Goal model representing financial savings targets.
 *
 * Implements the Goal domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 *
 * accountIds is NOT stored directly on this model — it is derived from the
 * goal_accounts join table by the service layer and passed in at mapping time.
 */
export default class GoalModel extends Model implements Goal {
  static table = "goals"

  static associations = {
    goal_accounts: { type: "has_many", foreignKey: "goal_id" },
  } as const

  @field("goal_type") goalType!: GoalType
  @field("name") name!: string
  @field("description") description!: string | null
  @field("target_amount") targetAmount!: number
  @field("currency_code") currencyCode!: string
  @date("target_date") targetDate!: Date | null
  @field("icon") icon!: string | null
  @field("color_scheme_name") colorSchemeName!: string | null
  @field("is_archived") isArchived!: boolean
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  /**
   * Satisfies the Goal interface contract.
   * Populated externally by the service layer from the goal_accounts join table.
   */
  accountIds: string[] = []

  /**
   * Gets the color scheme object from the theme registry.
   * To change the scheme, assign `colorSchemeName` directly inside a `model.update()` callback.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }
}
