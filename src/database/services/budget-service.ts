import { eq } from "drizzle-orm"

import {
  budgetAccounts,
  budgetCategories,
  budgets,
  transactions,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import i18n from "~/i18n/config"
import type {
  AddBudgetFormSchema,
  UpdateBudgetFormSchema,
} from "~/schemas/budgets.schema"
import { assertMinorUnits } from "~/utils/money"

const { t } = i18n

export async function createBudget(data: AddBudgetFormSchema): Promise<string> {
  assertMinorUnits(data.amount)
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("budget.create", (db) => {
    db.insert(budgets)
      .values({
        id,
        name: data.name,
        amount: data.amount,
        currencyCode: data.currencyCode,
        period: data.period,
        startDate: new Date(data.startDate).toISOString(),
        endDate:
          data.endDate != null ? new Date(data.endDate).toISOString() : null,
        alertThreshold: data.alertThreshold ?? null,
        isActive: data.isActive ? 1 : 0,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    if (data.accountIds.length) {
      db.insert(budgetAccounts)
        .values(
          data.accountIds.map((accountId) => ({
            budgetId: id,
            accountId,
            createdAt: now,
          })),
        )
        .run()
    }

    if (data.categoryIds.length) {
      db.insert(budgetCategories)
        .values(
          data.categoryIds.map((categoryId) => ({
            budgetId: id,
            categoryId,
            createdAt: now,
          })),
        )
        .run()
    }
  })
  return id
}

export async function updateBudgetById(
  id: string,
  data: Partial<UpdateBudgetFormSchema>,
): Promise<void> {
  if (data.amount !== undefined) assertMinorUnits(data.amount)
  const now = new Date().toISOString()

  await runInTransaction("budget.update", (db) => {
    db.update(budgets)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.amount !== undefined ? { amount: data.amount } : {}),
        ...(data.currencyCode !== undefined
          ? { currencyCode: data.currencyCode }
          : {}),
        ...(data.period !== undefined ? { period: data.period } : {}),
        ...(data.startDate !== undefined
          ? { startDate: new Date(data.startDate).toISOString() }
          : {}),
        ...(data.endDate !== undefined
          ? {
              endDate:
                data.endDate != null
                  ? new Date(data.endDate).toISOString()
                  : null,
            }
          : {}),
        ...(data.alertThreshold !== undefined
          ? { alertThreshold: data.alertThreshold ?? null }
          : {}),
        ...(data.isActive !== undefined
          ? { isActive: data.isActive ? 1 : 0 }
          : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(budgets.id, id))
      .run()

    if (data.accountIds !== undefined) {
      db.delete(budgetAccounts).where(eq(budgetAccounts.budgetId, id)).run()
      if (data.accountIds.length) {
        db.insert(budgetAccounts)
          .values(
            data.accountIds.map((accountId) => ({
              budgetId: id,
              accountId,
              createdAt: now,
            })),
          )
          .run()
      }
    }

    if (data.categoryIds !== undefined) {
      db.delete(budgetCategories).where(eq(budgetCategories.budgetId, id)).run()
      if (data.categoryIds.length) {
        db.insert(budgetCategories)
          .values(
            data.categoryIds.map((categoryId) => ({
              budgetId: id,
              categoryId,
              createdAt: now,
            })),
          )
          .run()
      }
    }
  })
}

export async function deleteBudgetById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("budget.delete", (db) => {
    db.update(transactions)
      .set({ budgetId: null, updatedAt: now })
      .where(eq(transactions.budgetId, id))
      .run()
    db.delete(budgetAccounts).where(eq(budgetAccounts.budgetId, id)).run()
    db.delete(budgetCategories).where(eq(budgetCategories.budgetId, id)).run()
    db.delete(budgets).where(eq(budgets.id, id)).run()
  })
}

export async function duplicateBudgetById(id: string): Promise<string> {
  const newId = generateId()
  const now = new Date().toISOString()

  await runInTransaction("budget.duplicate", (db) => {
    const budget = db.select().from(budgets).where(eq(budgets.id, id)).get()

    if (!budget) {
      throw new Error(`Budget not found: ${id}`)
    }

    const accounts = db
      .select({ accountId: budgetAccounts.accountId })
      .from(budgetAccounts)
      .where(eq(budgetAccounts.budgetId, id))
      .all()
    const categories = db
      .select({ categoryId: budgetCategories.categoryId })
      .from(budgetCategories)
      .where(eq(budgetCategories.budgetId, id))
      .all()

    db.insert(budgets)
      .values({
        id: newId,
        name: `${t("screens.settings.budgets.copyOfPrefix", { name: budget.name })}`,
        amount: budget.amount,
        currencyCode: budget.currencyCode,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        alertThreshold: budget.alertThreshold,
        isActive: 1,
        icon: budget.icon,
        colorSchemeName: budget.colorSchemeName,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    if (accounts.length) {
      db.insert(budgetAccounts)
        .values(
          accounts.map((account) => ({
            budgetId: newId,
            accountId: account.accountId,
            createdAt: now,
          })),
        )
        .run()
    }

    if (categories.length) {
      db.insert(budgetCategories)
        .values(
          categories.map((category) => ({
            budgetId: newId,
            categoryId: category.categoryId,
            createdAt: now,
          })),
        )
        .run()
    }
  })

  return newId
}
