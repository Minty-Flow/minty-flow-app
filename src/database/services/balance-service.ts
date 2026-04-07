import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type TransactionModel from "../models/transaction"

/**
 * Compute the account's running balance at the moment a transaction settled.
 * This is the value shown next to the account name on the transaction detail screen.
 * Result = balance AFTER this transaction was applied.
 *
 * Fast path (O(1)): when `accountBalanceBefore` is non-zero (stored by
 * `createTransactionWriter` for confirmed transactions since the snapshot was
 * introduced), returns `accountBalanceBefore + delta` directly.
 *
 * Fallback (O(N) query): used for legacy rows where `accountBalanceBefore === 0`
 * (transactions created before the snapshot was stored, or transactions on
 * accounts that genuinely had a zero balance before them — rare but valid).
 *
 * @param transaction - The transaction model whose post-settlement balance is needed.
 */
export async function getBalanceAtTransaction(
  transaction: TransactionModel,
): Promise<number> {
  // O(1) fast path: snapshot was stored at creation time.
  // Zero-balance guard: if accountBalanceBefore is 0, fall through to the full
  // query rather than risk returning a wrong value for legacy rows.
  if (transaction.accountBalanceBefore !== 0) {
    const delta =
      transaction.type === "income"
        ? transaction.amount
        : transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount // transfer: amount is already signed
    return transaction.accountBalanceBefore + delta
  }

  // O(N) fallback for legacy rows or genuine zero-balance-before transactions.
  const txs = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("account_id", transaction.accountId),
      Q.where("is_pending", false),
      Q.where("is_deleted", false),
      Q.where("transaction_date", Q.lte(transaction.transactionDate.getTime())),
    )
    .fetch()

  return txs.reduce((sum, tx) => {
    if (tx.type === "income") return sum + tx.amount
    if (tx.type === "expense") return sum - tx.amount
    return sum + tx.amount // transfer rows carry signed amounts
  }, 0)
}
