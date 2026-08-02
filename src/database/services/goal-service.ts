import { eq } from "drizzle-orm"

import { goalAccounts, goals, transactions } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  AddGoalFormSchema,
  UpdateGoalFormSchema,
} from "~/schemas/goals.schema"
import { assertMinorUnits } from "~/utils/money"

export async function createGoal(data: AddGoalFormSchema): Promise<string> {
  assertMinorUnits(data.targetAmount)
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("goal.create", (db) => {
    db.insert(goals)
      .values({
        id,
        name: data.name,
        goalType: data.goalType ?? "savings",
        description: data.description ?? null,
        targetAmount: data.targetAmount,
        currencyCode: data.currencyCode,
        targetDate:
          data.targetDate != null
            ? new Date(data.targetDate).toISOString()
            : null,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        isArchived: 0,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    if (data.accountIds.length) {
      db.insert(goalAccounts)
        .values(
          data.accountIds.map((accountId) => ({
            goalId: id,
            accountId,
            createdAt: now,
          })),
        )
        .run()
    }
  })
  return id
}

export async function updateGoalById(
  id: string,
  data: Partial<UpdateGoalFormSchema>,
): Promise<void> {
  if (data.targetAmount !== undefined) assertMinorUnits(data.targetAmount)
  const now = new Date().toISOString()

  await runInTransaction("goal.update", (db) => {
    db.update(goals)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.goalType !== undefined ? { goalType: data.goalType } : {}),
        ...(data.description !== undefined
          ? { description: data.description ?? null }
          : {}),
        ...(data.targetAmount !== undefined
          ? { targetAmount: data.targetAmount }
          : {}),
        ...(data.currencyCode !== undefined
          ? { currencyCode: data.currencyCode }
          : {}),
        ...(data.targetDate !== undefined
          ? {
              targetDate:
                data.targetDate != null
                  ? new Date(data.targetDate).toISOString()
                  : null,
            }
          : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(goals.id, id))
      .run()

    if (data.accountIds !== undefined) {
      db.delete(goalAccounts).where(eq(goalAccounts.goalId, id)).run()
      if (data.accountIds.length) {
        db.insert(goalAccounts)
          .values(
            data.accountIds.map((accountId) => ({
              goalId: id,
              accountId,
              createdAt: now,
            })),
          )
          .run()
      }
    }
  })
}

export async function archiveGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("goal.archive", (db) => {
    db.update(goals)
      .set({ isArchived: 1, updatedAt: now })
      .where(eq(goals.id, id))
      .run()
  })
}

export async function unarchiveGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("goal.unarchive", (db) => {
    db.update(goals)
      .set({ isArchived: 0, updatedAt: now })
      .where(eq(goals.id, id))
      .run()
  })
}

export async function deleteGoalById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("goal.delete", (db) => {
    db.update(transactions)
      .set({ goalId: null, updatedAt: now })
      .where(eq(transactions.goalId, id))
      .run()
    db.delete(goalAccounts).where(eq(goalAccounts.goalId, id)).run()
    db.delete(goals).where(eq(goals.id, id)).run()
  })
}
