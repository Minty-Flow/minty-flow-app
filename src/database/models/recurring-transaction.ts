import { Model } from "@nozbe/watermelondb"
import { date, field, readonly } from "@nozbe/watermelondb/decorators"

export const RECURRING_EXTENSION_KEY = "@mintyflow/default-recurring"

interface RecurringTimeRange {
  from: number // Unix ms
  to: number // Unix ms
}

export interface RecurringTransactionTemplate {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
  description: string | null
  subtype: string | null
  tags: string[] | null
  extra: Record<string, string> | null
}

export default class RecurringTransactionModel extends Model {
  static table = "recurring_transactions"

  @field("json_transaction_template") jsonTransactionTemplate!: string
  @field("transfer_to_account_id") transferToAccountId!: string | null
  @field("range") rangeEncoded!: string
  @field("rules") rulesEncoded!: string
  @readonly @date("created_at") createdAt!: Date
  @date("last_generated_transaction_date")
  lastGeneratedTransactionDate!: Date | null
  @field("disabled") disabled!: boolean

  get template(): RecurringTransactionTemplate {
    try {
      return JSON.parse(
        this.jsonTransactionTemplate,
      ) as RecurringTransactionTemplate
    } catch {
      return {
        amount: 0,
        type: "expense",
        accountId: "",
        categoryId: null,
        title: null,
        description: null,
        subtype: null,
        tags: null,
        extra: null,
      }
    }
  }

  get timeRange(): RecurringTimeRange {
    try {
      return JSON.parse(this.rangeEncoded) as RecurringTimeRange
    } catch {
      return { from: 0, to: 0 }
    }
  }

  get recurrenceRules(): string[] {
    try {
      return JSON.parse(this.rulesEncoded) as string[]
    } catch {
      return []
    }
  }

  /** Tag name to mark generated transactions (uses WatermelonDB id). */
  get extensionIdentifierTag(): string {
    return `${RECURRING_EXTENSION_KEY}:${this.id}`
  }
}
