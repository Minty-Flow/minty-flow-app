import { eq, or } from "drizzle-orm"

import { transactions, transfers } from "~/database/drizzle/schema"
import type { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"

// Read helpers the ledger, recurring-instance and trash services share.

export type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

export const txSelection = {
  id: transactions.id,
  account_id: transactions.accountId,
  category_id: transactions.categoryId,
  amount: transactions.amount,
  type: transactions.type,
  transaction_date: transactions.transactionDate,
  title: transactions.title,
  description: transactions.description,
  is_deleted: transactions.isDeleted,
  deleted_at: transactions.deletedAt,
  is_pending: transactions.isPending,
  requires_manual_confirmation: transactions.requiresManualConfirmation,
  account_balance_before: transactions.accountBalanceBefore,
  subtype: transactions.subtype,
  kind: transactions.kind,
  extra: transactions.extra,
  has_attachments: transactions.hasAttachments,
  recurring_id: transactions.recurringId,
  location: transactions.location,
  goal_id: transactions.goalId,
  budget_id: transactions.budgetId,
  loan_id: transactions.loanId,
  created_at: transactions.createdAt,
  updated_at: transactions.updatedAt,
}

export function requireTx(db: Db, id: string): RowTransaction {
  const row = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, id))
    .get()
  if (!row) throw new Error(`Transaction ${id} not found`)
  return row
}

export function getPartnerTxId(
  txId: string,
  db: Db,
): { partnerId: string; isDebit: boolean } | null {
  const row = db
    .select({
      fromTransactionId: transfers.fromTransactionId,
      toTransactionId: transfers.toTransactionId,
    })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, txId),
        eq(transfers.toTransactionId, txId),
      ),
    )
    .get()
  if (!row) return null
  if (row.fromTransactionId === txId) {
    return { partnerId: row.toTransactionId, isDebit: true }
  }
  return { partnerId: row.fromTransactionId, isDebit: false }
}

export function getTransferRow(
  txId: string,
  db: Db,
): {
  id: string
  fromTransactionId: string
  toTransactionId: string
  fromAccountId: string
  toAccountId: string
  conversionRate: number
} | null {
  return (
    db
      .select()
      .from(transfers)
      .where(
        or(
          eq(transfers.fromTransactionId, txId),
          eq(transfers.toTransactionId, txId),
        ),
      )
      .get() ?? null
  )
}

export function getTransferLegs(txId: string, db: Db): RowTransaction[] {
  const tx = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, txId))
    .get()
  if (!tx) return []

  const legs: RowTransaction[] = [tx]
  const partner = getPartnerTxId(txId, db)
  if (!partner) return legs

  const paired = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, partner.partnerId))
    .get()
  if (paired) legs.push(paired)
  return legs
}
