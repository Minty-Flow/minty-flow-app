import { emit } from "~/database/events"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  AddGoalFormSchema,
  UpdateGoalFormSchema,
} from "~/schemas/goals.schema"

export async function createGoal(data: AddGoalFormSchema): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("goal.create", async (db) => {
    await db.runAsync(
      `INSERT INTO goals (id, name, goal_type, description, target_amount, currency_code,
        target_date, icon, color_scheme_name, is_archived, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        data.name,
        data.goalType ?? "savings",
        data.description ?? null,
        data.targetAmount,
        data.currencyCode,
        data.targetDate != null
          ? new Date(data.targetDate).toISOString()
          : null,
        data.icon ?? null,
        data.colorSchemeName ?? null,
        now,
        now,
      ],
    )

    for (const accountId of data.accountIds) {
      await db.runAsync(
        `INSERT INTO goal_accounts (goal_id, account_id, created_at) VALUES (?, ?, ?)`,
        [id, accountId, now],
      )
    }
  })

  emit("goals:dirty", undefined)
  return id
}

export async function updateGoalById(
  id: string,
  data: Partial<UpdateGoalFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("goal.update", async (db) => {
    await db.runAsync(
      `UPDATE goals SET
        name = COALESCE(?, name),
        goal_type = COALESCE(?, goal_type),
        description = CASE WHEN ? THEN ? ELSE description END,
        target_amount = COALESCE(?, target_amount),
        currency_code = COALESCE(?, currency_code),
        target_date = CASE WHEN ? THEN ? ELSE target_date END,
        icon = CASE WHEN ? THEN ? ELSE icon END,
        color_scheme_name = CASE WHEN ? THEN ? ELSE color_scheme_name END,
        updated_at = ?
       WHERE id = ?`,
      [
        data.name ?? null,
        data.goalType ?? null,
        data.description !== undefined ? 1 : 0,
        data.description ?? null,
        data.targetAmount ?? null,
        data.currencyCode ?? null,
        data.targetDate !== undefined ? 1 : 0,
        data.targetDate != null
          ? new Date(data.targetDate).toISOString()
          : null,
        data.icon !== undefined ? 1 : 0,
        data.icon ?? null,
        data.colorSchemeName !== undefined ? 1 : 0,
        data.colorSchemeName ?? null,
        now,
        id,
      ],
    )

    if (data.accountIds !== undefined) {
      await db.runAsync(`DELETE FROM goal_accounts WHERE goal_id = ?`, [id])
      for (const accountId of data.accountIds) {
        await db.runAsync(
          `INSERT INTO goal_accounts (goal_id, account_id, created_at) VALUES (?, ?, ?)`,
          [id, accountId, now],
        )
      }
    }
  })

  emit("goals:dirty", undefined)
}

export async function archiveGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("goal.archive", async (db) => {
    await db.runAsync(
      `UPDATE goals SET is_archived = 1, updated_at = ? WHERE id = ?`,
      [now, id],
    )
  })
  emit("goals:dirty", undefined)
}

export async function unarchiveGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("goal.unarchive", async (db) => {
    await db.runAsync(
      `UPDATE goals SET is_archived = 0, updated_at = ? WHERE id = ?`,
      [now, id],
    )
  })
  emit("goals:dirty", undefined)
}

export async function deleteGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("goal.delete", async (db) => {
    // Null out FK on child transactions so they survive goal deletion as
    // un-linked rows instead of holding a dangling reference.
    await db.runAsync(
      `UPDATE transactions SET goal_id = NULL, updated_at = ? WHERE goal_id = ?`,
      [now, id],
    )
    await db.runAsync(`DELETE FROM goal_accounts WHERE goal_id = ?`, [id])
    await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id])
  })

  emit("goals:dirty", undefined)
  emit("transactions:dirty", {})
}
