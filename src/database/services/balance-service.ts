import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type TransactionModel from "../models/transaction"
import { getBalanceDelta } from "../utils/get-balance-delta"

/**
 * Compute the account's running balance AFTER a given transaction.
 *
 * Optimizations:
 * - O(1): if transaction has a snapshot (`accountBalanceBefore`)
 * - O(k): find nearest previous snapshot and sum only the gap
 *
 * Assumptions:
 * - `accountBalanceBefore` is `number | null` (null = no snapshot)
 * - All transaction amounts are normalized (income +, expense -, transfer signed)
 */
export async function getBalanceAtTransaction(
  transaction: TransactionModel,
): Promise<number> {
  const txCollection = database.get<TransactionModel>("transactions")

  // --- 1. Fast path: snapshot exists ---
  if (transaction.accountBalanceBefore != null) {
    return (
      transaction.accountBalanceBefore +
      getBalanceDelta(transaction.amount, transaction.type)
    )
  }

  // --- 2. Find nearest previous snapshot ---
  const [snapshotTx] = await txCollection
    .query(
      Q.where("account_id", transaction.accountId),
      Q.where("is_pending", false),
      Q.where("is_deleted", false),
      Q.where("transaction_date", Q.lte(transaction.transactionDate.getTime())),
      Q.where("account_balance_before", Q.notEq(null)),
      Q.sortBy("transaction_date", Q.desc),
      Q.take(1),
    )
    .fetch()

  let baseBalance = 0
  let startDate = 0

  if (snapshotTx) {
    baseBalance =
      snapshotTx.accountBalanceBefore +
      getBalanceDelta(snapshotTx.amount, snapshotTx.type)
    startDate = snapshotTx.transactionDate.getTime()
  }

  // --- 3. Fetch only transactions AFTER snapshot up to current ---
  const txs = await txCollection
    .query(
      Q.where("account_id", transaction.accountId),
      Q.where("is_pending", false),
      Q.where("is_deleted", false),
      Q.where(
        "transaction_date",
        Q.between(startDate, transaction.transactionDate.getTime()),
      ),
      Q.sortBy("transaction_date", Q.asc),
    )
    .fetch()

  // --- 4. Accumulate balance ---
  let balance = baseBalance

  for (const tx of txs) {
    // Skip snapshotTx itself if included
    if (snapshotTx && tx.id === snapshotTx.id) continue
    balance += getBalanceDelta(tx.amount, tx.type)
  }

  return balance
}
