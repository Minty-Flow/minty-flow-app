import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type TransactionModel from "../models/transaction"

/**
 * Compute the account's running balance at the moment a transaction settled.
 * This is the value shown next to the account name on the transaction detail screen.
 *
 * Uses `<=` (inclusive) so the transaction itself is included in the sum.
 * Result = balance AFTER this transaction was applied (snapshot behavior).
 *
 * @param accountId       - WatermelonDB id of the account
 * @param transactionDateMs - Unix ms timestamp of the transaction
 */
export async function getBalanceAtTransaction(
  accountId: string,
  transactionDateMs: number,
): Promise<number> {
  const txs = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("account_id", accountId),
      Q.where("is_pending", false),
      Q.where("is_deleted", false),
      Q.where("transaction_date", Q.lte(transactionDateMs)),
    )
    .fetch()

  return txs.reduce((sum, tx) => {
    if (tx.type === "income") return sum + tx.amount
    if (tx.type === "expense") return sum - tx.amount
    return sum + tx.amount // transfer rows carry signed amounts
  }, 0)
}
