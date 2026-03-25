import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

import { getThemeStrict } from "~/styles/theme/registry"

import type { Account, AccountType } from "../../types/accounts"

/**
 * Account model representing user financial accounts.
 *
 * Implements the Account domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 */
export default class AccountModel extends Model implements Account {
  static table = "accounts"

  static associations = {
    transactions: { type: "has_many", foreignKey: "account_id" },
  } as const

  @field("name") name!: string
  @field("type") type!: AccountType
  @field("balance") balance!: number
  @field("currency_code") currencyCode!: string
  @field("icon") icon!: string | null
  @field("color_scheme_name") colorSchemeName!: string | null
  @field("is_primary") isPrimary!: boolean
  @field("exclude_from_balance") excludeFromBalance!: boolean
  @field("is_archived") isArchived!: boolean
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date
  @field("sort_order") sortOrder!: number | null

  /**
   * Gets the color scheme object from the theme registry.
   * To change the scheme, assign `colorSchemeName` directly inside a `model.update()` callback.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }
}
