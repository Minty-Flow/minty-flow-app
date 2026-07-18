import { query, queryOne } from "../sql"
import type { RowGoal, RowGoalAccount } from "../types/rows"

export async function getAllGoals(): Promise<RowGoal[]> {
  return query<RowGoal>(
    `SELECT * FROM goals WHERE is_archived = 0 ORDER BY name ASC`,
  )
}

export async function getArchivedGoals(): Promise<RowGoal[]> {
  return query<RowGoal>(
    `SELECT * FROM goals WHERE is_archived = 1 ORDER BY name ASC`,
  )
}

export async function getGoalAccountIds(goalId: string): Promise<string[]> {
  const rows = await query<RowGoalAccount>(
    `SELECT * FROM goal_accounts WHERE goal_id = ?`,
    [goalId],
  )
  return rows.map((r) => r.account_id)
}

export async function getGoalsByType(goalType: string): Promise<RowGoal[]> {
  return query<RowGoal>(
    `SELECT * FROM goals WHERE is_archived = 0 AND goal_type = ? ORDER BY name ASC`,
    [goalType],
  )
}

export async function getGoalProgress(
  goalId: string,
  goalType: "savings" | "expense",
): Promise<number> {
  const typeFilter = goalType === "expense" ? "expense" : "income"
  const row = await queryOne<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE goal_id = ?
       AND type = ?
       AND is_deleted = 0
       AND is_pending = 0`,
    [goalId, typeFilter],
  )
  return row?.total ?? 0
}
