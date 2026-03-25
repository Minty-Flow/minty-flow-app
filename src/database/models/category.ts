import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

import type { TransactionType } from "~/types/transactions"

import { getThemeStrict } from "../../styles/theme/registry"
import type { Category } from "../../types/categories"

/**
 * Category model representing transaction categories.
 *
 * Implements the Category domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 *
 * Color scheme is stored as a name (color_scheme_name) and resolved at runtime
 * from the theme registry.
 */
export default class CategoryModel extends Model implements Category {
  static table = "categories"

  static associations = {
    transactions: { type: "has_many", foreignKey: "category_id" },
  } as const

  @field("name") name!: string
  @field("type") type!: TransactionType
  @field("icon") icon!: string | null
  @field("color_scheme_name") colorSchemeName!: string | null
  @field("transaction_count") transactionCount!: number
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  /**
   * Gets the color scheme object from the theme registry.
   * To change the scheme, assign `colorSchemeName` directly inside a `model.update()` callback.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }
}
