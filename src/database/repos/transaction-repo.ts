import { and, desc, eq, gte, inArray, lte, type SQL } from "drizzle-orm"

import { drizzleDb } from "../drizzle/db"
import { transactions } from "../drizzle/schema"
import type { RowTransaction } from "../types/rows"

const txSelection = {
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

export async function getPendingTransactions(): Promise<RowTransaction[]> {
  return drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(and(eq(transactions.isPending, 1), eq(transactions.isDeleted, 0)))
    .all()
}

export async function getTransactionsByFilter(params: {
  from?: string
  to?: string
  accountIds?: string[]
  categoryIds?: string[]
  categoryId?: string
  loanId?: string
  goalId?: string
  isPending?: boolean
  deletedOnly?: boolean
  limit?: number
  offset?: number
}): Promise<RowTransaction[]> {
  const conditions: SQL[] = [
    eq(transactions.isDeleted, params.deletedOnly ? 1 : 0),
  ]
  if (params.isPending) conditions.push(eq(transactions.isPending, 1))
  if (params.from)
    conditions.push(gte(transactions.transactionDate, params.from))
  if (params.to) conditions.push(lte(transactions.transactionDate, params.to))
  if (params.accountIds?.length)
    conditions.push(inArray(transactions.accountId, params.accountIds))
  if (params.categoryIds?.length)
    conditions.push(inArray(transactions.categoryId, params.categoryIds))
  if (params.categoryId)
    conditions.push(eq(transactions.categoryId, params.categoryId))
  if (params.loanId) conditions.push(eq(transactions.loanId, params.loanId))
  if (params.goalId) conditions.push(eq(transactions.goalId, params.goalId))

  return drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
    .limit(params.limit ?? 100)
    .offset(params.offset ?? 0)
    .all()
}
