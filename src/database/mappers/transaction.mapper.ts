import type {
  Transaction,
  TransactionSubType,
  TransactionType,
} from "~/types/transactions"
import { logger } from "~/utils/logger"

import type { RowTransaction } from "../types/rows"

/** Defensive parse: a single corrupt `extra` blob must not break list hydration. */
function parseExtra(
  raw: string | null,
  id: string,
): Record<string, string> | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    logger.warn("Failed to parse transaction.extra; treating as null", { id })
    return null
  }
}

export function mapTransaction(row: RowTransaction): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    transactionDate: new Date(row.transaction_date),
    title: row.title,
    description: row.description,
    amount: row.amount,
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    isPending: !!row.is_pending,
    requiresManualConfirmation: !!row.requires_manual_confirmation,
    accountBalanceBefore: row.account_balance_before,
    subtype: row.subtype as TransactionSubType,
    extra: parseExtra(row.extra, row.id),
    categoryId: row.category_id,
    accountId: row.account_id,
    goalId: row.goal_id,
    budgetId: row.budget_id,
    loanId: row.loan_id,
    location: row.location,
    recurringId: row.recurring_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
