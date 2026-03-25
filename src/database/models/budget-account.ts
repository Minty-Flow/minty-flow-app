import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

/**
 * Join table model linking budgets to accounts.
 *
 * A budget can track spending across multiple accounts.
 * Each row represents a single budget ↔ account relationship.
 */
export default class BudgetAccountModel extends Model {
  static table = "budget_accounts"

  @field("budget_id") budgetId!: string
  @field("account_id") accountId!: string
  @readonly @date("created_at") createdAt!: Date
}
