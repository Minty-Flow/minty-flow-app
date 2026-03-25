import { Model } from "@nozbe/watermelondb"
import { date, field, readonly, relation } from "@nozbe/watermelondb/decorators"

import type { Transfer } from "~/types/transfers"

import type AccountModel from "./account"
import type TransactionModel from "./transaction"

/**
 * Transfer model — first-class metadata for a transfer pair.
 * Links the debit (from) and credit (to) transaction rows and stores conversion_rate.
 * Implements the Transfer domain type.
 */
export default class TransferModel extends Model implements Transfer {
  static table = "transfers"

  @field("from_transaction_id") fromTransactionId!: string
  @field("to_transaction_id") toTransactionId!: string
  @field("from_account_id") fromAccountId!: string
  @field("to_account_id") toAccountId!: string
  @field("conversion_rate") conversionRate!: number
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  @relation("transactions", "from_transaction_id")
  fromTransaction!: TransactionModel
  @relation("transactions", "to_transaction_id")
  toTransaction!: TransactionModel
  @relation("accounts", "from_account_id") fromAccount!: AccountModel
  @relation("accounts", "to_account_id") toAccount!: AccountModel
}
