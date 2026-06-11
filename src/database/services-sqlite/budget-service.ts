import { emit } from "~/database/events"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  AddBudgetFormSchema,
  UpdateBudgetFormSchema,
} from "~/schemas/budgets.schema"

import type {
  RowBudget,
  RowBudgetAccount,
  RowBudgetCategory,
} from "../types/rows"

export async function createBudget(data: AddBudgetFormSchema): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("budget.create", async (db) => {
    await db.runAsync(
      `INSERT INTO budgets (id, name, amount, currency_code, period, start_date, end_date,
        alert_threshold, is_active, icon, color_scheme_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.amount,
        data.currencyCode,
        data.period,
        new Date(data.startDate).toISOString(),
        data.endDate != null ? new Date(data.endDate).toISOString() : null,
        data.alertThreshold ?? null,
        data.isActive ? 1 : 0,
        data.icon ?? null,
        data.colorSchemeName ?? null,
        now,
        now,
      ],
    )

    for (const accountId of data.accountIds) {
      await db.runAsync(
        `INSERT INTO budget_accounts (budget_id, account_id, created_at) VALUES (?, ?, ?)`,
        [id, accountId, now],
      )
    }

    for (const categoryId of data.categoryIds) {
      await db.runAsync(
        `INSERT INTO budget_categories (budget_id, category_id, created_at) VALUES (?, ?, ?)`,
        [id, categoryId, now],
      )
    }
  })

  emit("budgets:dirty", undefined)
  return id
}

export async function updateBudgetById(
  id: string,
  data: Partial<UpdateBudgetFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("budget.update", async (db) => {
    await db.runAsync(
      `UPDATE budgets SET
        name = COALESCE(?, name),
        amount = COALESCE(?, amount),
        currency_code = COALESCE(?, currency_code),
        period = COALESCE(?, period),
        start_date = COALESCE(?, start_date),
        end_date = CASE WHEN ? THEN ? ELSE end_date END,
        alert_threshold = CASE WHEN ? THEN ? ELSE alert_threshold END,
        is_active = COALESCE(?, is_active),
        icon = CASE WHEN ? THEN ? ELSE icon END,
        color_scheme_name = CASE WHEN ? THEN ? ELSE color_scheme_name END,
        updated_at = ?
       WHERE id = ?`,
      [
        data.name ?? null,
        data.amount ?? null,
        data.currencyCode ?? null,
        data.period ?? null,
        data.startDate != null ? new Date(data.startDate).toISOString() : null,
        data.endDate !== undefined ? 1 : 0,
        data.endDate != null ? new Date(data.endDate).toISOString() : null,
        data.alertThreshold !== undefined ? 1 : 0,
        data.alertThreshold ?? null,
        data.isActive !== undefined ? (data.isActive ? 1 : 0) : null,
        data.icon !== undefined ? 1 : 0,
        data.icon ?? null,
        data.colorSchemeName !== undefined ? 1 : 0,
        data.colorSchemeName ?? null,
        now,
        id,
      ],
    )

    if (data.accountIds !== undefined) {
      await db.runAsync(`DELETE FROM budget_accounts WHERE budget_id = ?`, [id])
      for (const accountId of data.accountIds) {
        await db.runAsync(
          `INSERT INTO budget_accounts (budget_id, account_id, created_at) VALUES (?, ?, ?)`,
          [id, accountId, now],
        )
      }
    }

    if (data.categoryIds !== undefined) {
      await db.runAsync(`DELETE FROM budget_categories WHERE budget_id = ?`, [
        id,
      ])
      for (const categoryId of data.categoryIds) {
        await db.runAsync(
          `INSERT INTO budget_categories (budget_id, category_id, created_at) VALUES (?, ?, ?)`,
          [id, categoryId, now],
        )
      }
    }
  })

  emit("budgets:dirty", undefined)
}

export async function deleteBudgetById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("budget.delete", async (db) => {
    // Null out FK on child transactions so they survive budget deletion as
    // un-budgeted rows instead of holding a dangling reference.
    await db.runAsync(
      `UPDATE transactions SET budget_id = NULL, updated_at = ? WHERE budget_id = ?`,
      [now, id],
    )
    await db.runAsync(`DELETE FROM budget_accounts WHERE budget_id = ?`, [id])
    await db.runAsync(`DELETE FROM budget_categories WHERE budget_id = ?`, [id])
    await db.runAsync(`DELETE FROM budgets WHERE id = ?`, [id])
  })

  emit("budgets:dirty", undefined)
  emit("transactions:dirty", {})
}

export async function duplicateBudgetById(id: string): Promise<string> {
  const newId = generateId()
  const now = new Date().toISOString()

  await runInTransaction("budget.duplicate", async (db) => {
    const budget = await db.getFirstAsync<RowBudget>(
      `SELECT
        name,
        amount,
        currency_code,
        period,
        start_date,
        end_date,
        alert_threshold,
        is_active,
        icon,
        color_scheme_name
       FROM budgets
       WHERE id = ?`,
      [id],
    )

    if (!budget) {
      throw new Error(`Budget not found: ${id}`)
    }

    const accounts = await db.getAllAsync<Pick<RowBudgetAccount, "account_id">>(
      `SELECT account_id
       FROM budget_accounts
       WHERE budget_id = ?`,
      [id],
    )

    const categories = await db.getAllAsync<
      Pick<RowBudgetCategory, "category_id">
    >(
      `SELECT category_id
       FROM budget_categories
       WHERE budget_id = ?`,
      [id],
    )

    await db.runAsync(
      `INSERT INTO budgets (
        id,
        name,
        amount,
        currency_code,
        period,
        start_date,
        end_date,
        alert_threshold,
        is_active,
        icon,
        color_scheme_name,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        // TODO: this should be added to a key in the translation
        `Copy of ${budget.name}`,
        budget.amount,
        budget.currency_code,
        budget.period,
        budget.start_date,
        budget.end_date,
        budget.alert_threshold,
        1, // duplicated budgets start active
        budget.icon,
        budget.color_scheme_name,
        now,
        now,
      ],
    )

    for (const account of accounts) {
      await db.runAsync(
        `INSERT INTO budget_accounts (
          budget_id,
          account_id,
          created_at
        ) VALUES (?, ?, ?)`,
        [newId, account.account_id, now],
      )
    }

    for (const category of categories) {
      await db.runAsync(
        `INSERT INTO budget_categories (
          budget_id,
          category_id,
          created_at
        ) VALUES (?, ?, ?)`,
        [newId, category.category_id, now],
      )
    }
  })

  emit("budgets:dirty", undefined)

  return newId
}
