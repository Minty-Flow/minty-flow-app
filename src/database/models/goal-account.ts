import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

/**
 * Join table model linking goals to accounts.
 *
 * A goal can track savings progress across multiple accounts.
 * Each row represents a single goal ↔ account relationship.
 */
export default class GoalAccountModel extends Model {
  static table = "goal_accounts"

  @field("goal_id") goalId!: string
  @field("account_id") accountId!: string
  @readonly @date("created_at") createdAt!: Date
}
