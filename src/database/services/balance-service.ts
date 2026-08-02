import { and, eq, lt, or, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { transactions } from "~/database/drizzle/schema"
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
  const targetDate = transaction.transactionDate.toISOString()
  const target = drizzleDb
    .select({ createdAt: transactions.createdAt })
    .from(transactions)
    .where(eq(transactions.id, transaction.id))
    .get()

  const rows = drizzleDb
    .select({
      id: transactions.id,
      amount: transactions.amount,
      type: transactions.type,
      subtype: transactions.subtype,
      transaction_date: transactions.transactionDate,
      created_at: transactions.createdAt,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.accountId, transaction.accountId),
        eq(transactions.isPending, 0),
        eq(transactions.isDeleted, 0),
        or(
          lt(transactions.transactionDate, targetDate),
          and(
            eq(transactions.transactionDate, targetDate),
            lt(transactions.createdAt, target?.createdAt ?? ""),
          ),
        ),
        sql`${transactions.id} != ${transaction.id}`,
      ),
    )
    .orderBy(transactions.transactionDate, transactions.createdAt)
    .all() satisfies Pick<
    RowTransaction,
    "id" | "amount" | "type" | "subtype" | "transaction_date" | "created_at"
  >[]

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
