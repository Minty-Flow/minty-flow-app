import { eq } from "drizzle-orm"

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
