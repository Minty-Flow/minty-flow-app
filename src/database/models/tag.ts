import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

import { getThemeStrict } from "~/styles/theme/registry"

import type { Tag, TagKindType } from "../../types/tags"

/**
 * Tag model representing tags for categorizing transactions.
 *
 * Implements the Tag domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 */
export default class TagModel extends Model implements Tag {
  static table = "tags"

  @field("name") name!: string
  @field("type") type!: TagKindType
  @field("color_scheme_name") colorSchemeName!: string | null
  @field("icon") icon!: string | null
  @field("transaction_count") transactionCount!: number
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  /**
   * Gets the color scheme object from the theme registry.
   * This is computed at runtime, not stored in the database.
   * To change the scheme, assign `colorSchemeName` directly inside a `model.update()` callback.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }
}
