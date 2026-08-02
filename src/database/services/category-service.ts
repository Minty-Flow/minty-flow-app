import { and, count, eq, isNotNull } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { categories, transactions } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
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

export async function deleteCategoryById(id: string): Promise<void> {
  await runInTransaction("category.delete", (db) => {
    db.update(transactions)
      .set({ categoryId: null, updatedAt: new Date().toISOString() })
      .where(eq(transactions.categoryId, id))
      .run()
    db.delete(categories).where(eq(categories.id, id)).run()
  })
}

export async function getCategoryTransactionCounts(): Promise<
  Map<string, number>
> {
  const rows = drizzleDb
    .select({ categoryId: transactions.categoryId, cnt: count() })
    .from(transactions)
    .where(
      and(isNotNull(transactions.categoryId), eq(transactions.isDeleted, 0)),
    )
    .groupBy(transactions.categoryId)
    .all()
  const map = new Map<string, number>()
  for (const row of rows) {
    if (row.categoryId) map.set(row.categoryId, row.cnt)
  }
  return map
}
