import { getDb } from "~/database/db"
import type { RowTransaction } from "~/database/types/rows"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type { Transaction, TransactionType } from "~/types/transactions"

/**
 * Compute the account's running balance AFTER a given transaction.
 *
 * Sums all non-pending, non-deleted transactions on the account up to and
 * including the target transaction (ordered by transaction_date, created_at).
 * O(k) where k = transactions before this one in the account.
 */
export async function getBalanceAtTransaction(
  transaction: Pick<
    Transaction,
    "id" | "accountId" | "transactionDate" | "amount" | "type"
  >,
): Promise<number> {
  const db = getDb()
  const targetDate = transaction.transactionDate.toISOString()

  const rows = await db.getAllAsync<
    Pick<
      RowTransaction,
      "id" | "amount" | "type" | "subtype" | "transaction_date" | "created_at"
    >
  >(
    `SELECT id, amount, type, subtype, transaction_date, created_at
     FROM transactions
     WHERE account_id = ?
       AND is_pending = 0
       AND is_deleted = 0
       AND (
         transaction_date < ?
         OR (transaction_date = ? AND created_at < (
           SELECT created_at FROM transactions WHERE id = ?
         ))
       )
       AND id != ?
     ORDER BY transaction_date ASC, created_at ASC`,
    [
      transaction.accountId,
      targetDate,
      targetDate,
      transaction.id,
      transaction.id,
    ],
  )

  let balance = 0
  for (const row of rows) {
    balance += getBalanceDelta(
      row.amount,
      row.type as TransactionType,
      row.subtype,
    )
  }
  // Add target transaction itself
  balance += getBalanceDelta(transaction.amount, transaction.type)
  return balance
}
