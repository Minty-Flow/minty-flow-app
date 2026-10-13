import { and, eq, inArray, sql } from "drizzle-orm"

import {
  budgetCategories,
  budgets,
  categories,
  transactions,
} from "~/database/drizzle/schema"
import { type DbTransaction, runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import { clearCategoryFromRecurringTemplates } from "~/database/utils/recurring-template-refs"
import type {
  AddCategoriesFormSchema,
  UpdateCategoriesFormSchema,
} from "~/schemas/categories.schema"

export async function createCategory(
  data: AddCategoriesFormSchema,
): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("category.create", (db) => {
    db.insert(categories)
      .values({
        id,
        name: data.name,
        type: data.type,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  })
  return id
}

export async function updateCategoryById(
  id: string,
  data: Partial<UpdateCategoriesFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("category.update", (db) => {
    db.update(categories)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(categories.id, id))
      .run()
  })
}

/**
 * A budget needs at least one category, and the cascade on `budget_categories`
 * removes the link when the category goes. Switch off every active budget
 * whose only category is `categoryId` so it does not sit there with none.
 * Call it before the category row is deleted.
 */
function deactivateBudgetsLosingTheirLastCategory(
  db: DbTransaction,
  categoryId: string,
): void {
  db.update(budgets)
    .set({ isActive: 0, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(budgets.isActive, 1),
        inArray(
          budgets.id,
          db
            .select({ id: budgetCategories.budgetId })
            .from(budgetCategories)
            .where(eq(budgetCategories.categoryId, categoryId)),
        ),
        sql`NOT EXISTS (
          SELECT 1 FROM ${budgetCategories}
          WHERE ${budgetCategories.budgetId} = ${budgets.id}
            AND ${budgetCategories.categoryId} <> ${categoryId}
        )`,
      ),
    )
    .run()
}

export async function deleteCategoryById(id: string): Promise<void> {
  await runInTransaction("category.delete", (db) => {
    deactivateBudgetsLosingTheirLastCategory(db, id)
    db.update(transactions)
      .set({ categoryId: null, updatedAt: new Date().toISOString() })
      .where(eq(transactions.categoryId, id))
      .run()
    clearCategoryFromRecurringTemplates(db, id)
    db.delete(categories).where(eq(categories.id, id)).run()
  })
}
