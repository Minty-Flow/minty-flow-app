import type { SQLiteBindValue } from "expo-sqlite"

import { query } from "../sql"
import type { RowTransaction } from "../types/rows"

export async function getPendingTransactions(): Promise<RowTransaction[]> {
  return query<RowTransaction>(
    `SELECT * FROM transactions WHERE is_pending = 1 AND is_deleted = 0`,
  )
}

// export async function getTransactionsByIds(
//   ids: string[],
// ): Promise<RowTransaction[]> {
//   if (ids.length === 0) return []
//   const placeholders = ids.map(() => "?").join(",")
//   return query<RowTransaction>(
//     `SELECT * FROM transactions WHERE id IN (${placeholders})`,
//     ids,
//   )
// }

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
  const conditions = [params.deletedOnly ? "is_deleted = 1" : "is_deleted = 0"]
  if (params.isPending) conditions.push("is_pending = 1")
  const values: SQLiteBindValue[] = []

  if (params.from) {
    conditions.push("transaction_date >= ?")
    values.push(params.from)
  }

  if (params.to) {
    conditions.push("transaction_date <= ?")
    values.push(params.to)
  }

  if (params.accountIds?.length) {
    const placeholders = params.accountIds.map(() => "?").join(",")
    conditions.push(`account_id IN (${placeholders})`)
    values.push(...params.accountIds)
  }

  if (params.categoryIds?.length) {
    const placeholders = params.categoryIds.map(() => "?").join(",")
    conditions.push(`category_id IN (${placeholders})`)
    values.push(...params.categoryIds)
  }

  if (params.categoryId) {
    conditions.push("category_id = ?")
    values.push(params.categoryId)
  }

  if (params.loanId) {
    conditions.push("loan_id = ?")
    values.push(params.loanId)
  }

  if (params.goalId) {
    conditions.push("goal_id = ?")
    values.push(params.goalId)
  }

  const where = conditions.join(" AND ")

  return query<RowTransaction>(
    `SELECT * FROM transactions
     WHERE ${where}
     ORDER BY transaction_date DESC, created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, params.limit ?? 100, params.offset ?? 0],
  )
}
