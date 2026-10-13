import { and, eq, gt, or, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type { Transaction, TransactionType } from "~/types/transactions"

/**
 * Compute the account's running balance AFTER a given transaction.
 *
 * Starts from the account's current balance (which already includes its
 * initial balance and every confirmed row) and takes off the confirmed,
 * non-deleted rows that come after the target (ordered by transaction_date,
 * created_at). Pending rows never touch the balance, so a pending target shows
 * the balance at its position. O(k) where k = transactions after this one.
 */
export async function getBalanceAtTransaction(
  transaction: Pick<Transaction, "id" | "accountId" | "transactionDate">,
): Promise<number> {
  const targetDate = transaction.transactionDate.toISOString()
  const target = drizzleDb
    .select({ createdAt: transactions.createdAt })
    .from(transactions)
    .where(eq(transactions.id, transaction.id))
    .get()
  const account = drizzleDb
    .select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, transaction.accountId))
    .get()

  const laterRows = drizzleDb
    .select({
      amount: transactions.amount,
      type: transactions.type,
      subtype: transactions.subtype,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.accountId, transaction.accountId),
        eq(transactions.isPending, 0),
        eq(transactions.isDeleted, 0),
        or(
          gt(transactions.transactionDate, targetDate),
          and(
            eq(transactions.transactionDate, targetDate),
            gt(transactions.createdAt, target?.createdAt ?? ""),
          ),
        ),
        sql`${transactions.id} != ${transaction.id}`,
      ),
    )
    .all()

  let balance = account?.balance ?? 0
  for (const row of laterRows) {
    balance -= getBalanceDelta(
      row.amount,
      row.type as TransactionType,
      row.subtype,
    )
  }
  return balance
}
