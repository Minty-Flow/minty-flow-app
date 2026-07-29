import type { SQLiteBindValue } from "expo-sqlite"

import type { BudgetPeriod } from "~/types/budgets"
import { getBudgetPeriodBounds } from "~/utils/planning-progress"

import { query, queryOne } from "../sql"
import type {
  RowBudget,
  RowBudgetAccount,
  RowBudgetCategory,
} from "../types/rows"

export async function getAllBudgets(): Promise<RowBudget[]> {
  return query<RowBudget>(`SELECT * FROM budgets ORDER BY name ASC`)
}

export async function getBudgetAccountIds(budgetId: string): Promise<string[]> {
  const rows = await query<RowBudgetAccount>(
    `SELECT * FROM budget_accounts WHERE budget_id = ?`,
    [budgetId],
  )
  return rows.map((r) => r.account_id)
}

export async function getBudgetCategoryIds(
  budgetId: string,
): Promise<string[]> {
  const rows = await query<RowBudgetCategory>(
    `SELECT * FROM budget_categories WHERE budget_id = ?`,
    [budgetId],
  )
  return rows.map((r) => r.category_id)
}

export function getBudgetPeriodRange(
  period: BudgetPeriod,
  startDateIso: string,
  endDateIso: string | null,
): { periodStart: string; periodEnd: string } {
  const { periodStart, periodEnd } = getBudgetPeriodBounds(
    period,
    new Date(startDateIso),
    endDateIso != null ? new Date(endDateIso) : null,
  )

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  }
}

export async function getBudgetSpent(
  accountIds: string[],
  categoryIds: string[],
  currencyCode: string,
  period: BudgetPeriod,
  startDateIso: string,
  endDateIso: string | null,
): Promise<number> {
  if (accountIds.length === 0) return 0

  const { periodStart, periodEnd } = getBudgetPeriodRange(
    period,
    startDateIso,
    endDateIso,
  )

  const conditions = [
    "t.is_deleted = 0",
    "t.is_pending = 0",
    "t.type = 'expense'",
    "a.currency_code = ?",
    "t.id NOT IN (SELECT from_transaction_id FROM transfers UNION SELECT to_transaction_id FROM transfers)",
    `t.account_id IN (${accountIds.map(() => "?").join(",")})`,
    "t.transaction_date >= ?",
    "t.transaction_date <= ?",
  ]
  const values: SQLiteBindValue[] = [
    currencyCode,
    ...accountIds,
    periodStart,
    periodEnd,
  ]

  if (categoryIds.length > 0) {
    conditions.push(
      `t.category_id IN (${categoryIds.map(() => "?").join(",")})`,
    )
    values.push(...categoryIds)
  }

  const row = await queryOne<{ total: number }>(
    `SELECT COALESCE(SUM(CASE WHEN t.subtype = 'refund' THEN -t.amount ELSE t.amount END), 0) as total
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE ${conditions.join(" AND ")}`,
    values,
  )
  return Math.max(row?.total ?? 0, 0)
}

export async function getBudgetSpentByCategory(
  accountIds: string[],
  categoryIds: string[],
  currencyCode: string,
  period: BudgetPeriod,
  startDateIso: string,
  endDateIso: string | null,
): Promise<Record<string, number>> {
  if (accountIds.length === 0) return {}

  const { periodStart, periodEnd } = getBudgetPeriodRange(
    period,
    startDateIso,
    endDateIso,
  )

  const conditions = [
    "t.is_deleted = 0",
    "t.is_pending = 0",
    "t.type = 'expense'",
    "a.currency_code = ?",
    "t.id NOT IN (SELECT from_transaction_id FROM transfers UNION SELECT to_transaction_id FROM transfers)",
    `t.account_id IN (${accountIds.map(() => "?").join(",")})`,
    "t.transaction_date >= ?",
    "t.transaction_date <= ?",
    "t.category_id IS NOT NULL",
  ]
  const values: SQLiteBindValue[] = [
    currencyCode,
    ...accountIds,
    periodStart,
    periodEnd,
  ]

  if (categoryIds.length > 0) {
    conditions.push(
      `t.category_id IN (${categoryIds.map(() => "?").join(",")})`,
    )
    values.push(...categoryIds)
  }

  const rows = await query<{ category_id: string; total: number }>(
    `SELECT t.category_id, COALESCE(SUM(CASE WHEN t.subtype = 'refund' THEN -t.amount ELSE t.amount END), 0) as total
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE ${conditions.join(" AND ")}
     GROUP BY t.category_id`,
    values,
  )
  const result: Record<string, number> = {}
  for (const row of rows) {
    result[row.category_id] = Math.max(row.total, 0)
  }
  return result
}
