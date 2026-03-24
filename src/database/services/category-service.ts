import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { from } from "rxjs"
import { filter, map } from "rxjs/operators"

import type {
  AddCategoriesFormSchema,
  UpdateCategoriesFormSchema,
} from "~/schemas/categories.schema"
import type { Category } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

import { database } from "../index"
import type CategoryModel from "../models/category"
import { modelToCategory } from "../utils/model-to-category"
import { getTransactionModels } from "./transaction-service"

/**
 * Category Service
 *
 * Provides functions for managing category data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the categories collection
 */
const getCategoryCollection = () => {
  return database.get<CategoryModel>("categories")
}

/**
 * Find a category by ID
 */
const findCategory = async (id: string): Promise<CategoryModel | null> => {
  try {
    return await getCategoryCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe categories filtered by type
 * Follows WatermelonDB best practices for reactive queries
 *
 * Uses observeWithColumns to react to column changes (name, icon, color_scheme_name, etc.)
 * not just record additions/deletions. This ensures the list updates when categories are edited.
 */
export const observeCategoriesByType = (
  type: TransactionType,
): Observable<Category[]> => {
  const categories = getCategoryCollection()
  const query = categories.query(Q.where("type", type), Q.sortBy("name", Q.asc))

  return query
    .observeWithColumns([
      "name",
      "icon",
      "type",
      "color_scheme_name",
      "transaction_count",
    ])
    .pipe(
      map((results) => {
        return results.map(modelToCategory) // convert to immutable plain object here
      }),
    )
}

/**
 * Observe all categories sorted by name ascending (no type filter)
 * Used when the consumer needs to filter categories client-side (e.g. loan form
 * where the required category type depends on a runtime form value).
 */
export const observeAllCategories = (): Observable<Category[]> => {
  const categories = getCategoryCollection()
  const query = categories.query(Q.sortBy("name", Q.asc))

  return query
    .observeWithColumns([
      "name",
      "icon",
      "type",
      "color_scheme_name",
      "transaction_count",
    ])
    .pipe(
      map((results) => {
        return results.map(modelToCategory)
      }),
    )
}

/**
 * Observe a specific category by ID
 */
export const observeCategoryById = (id: string): Observable<CategoryModel> => {
  return getCategoryCollection().findAndObserve(id)
}

/**
 * Observe a specific category by ID
 * Observes specific columns to ensure reactivity to field changes
 */
export const observeCategoryDetailsById = (
  id: string,
): Observable<Category> => {
  return getCategoryCollection()
    .query(Q.where("id", id))
    .observeWithColumns([
      "name",
      "icon",
      "type",
      "color_scheme_name",
      "transaction_count",
    ])
    .pipe(
      filter((results) => results.length > 0),
      map((results) => {
        const model = results[0]
        return modelToCategory(model) // convert to immutable plain object here
      }),
    )
}

/**
 * Create a new category
 */
export const createCategory = async (
  data: AddCategoriesFormSchema,
): Promise<CategoryModel> => {
  return await database.write(async () => {
    return await getCategoryCollection().create((category) => {
      category.name = data.name
      category.type = data.type
      category.icon = data.icon ?? null
      category.transactionCount = 0
      category.createdAt = new Date()
      category.updatedAt = new Date()
      category.setColorScheme(data.colorSchemeName ?? null)
    })
  })
}

/**
 * Update category
 */
export const updateCategory = async (
  category: CategoryModel,
  updates: Partial<UpdateCategoriesFormSchema>,
): Promise<CategoryModel> => {
  return await database.write(async () => {
    return await category.update((c) => {
      if (updates.name !== undefined) c.name = updates.name
      if (updates.icon !== undefined) c.icon = updates.icon ?? null
      if (updates.colorSchemeName !== undefined)
        c.setColorScheme(updates.colorSchemeName ?? null)
      c.updatedAt = new Date()
    })
  })
}

/**
 * Delete category completely. All transactions that belonged to this category
 * are updated to the target category (or uncategorized). The category is then
 * permanently removed.
 */
export const destroyCategory = async (
  category: CategoryModel,
  targetCategoryId: string | null = null,
): Promise<void> => {
  // Fetch inside the write so the transaction list can't go stale between
  // the read and the update (TOCTOU window).
  await database.write(async () => {
    const transactions = await getTransactionModels({
      categoryId: category.id,
      includeDeleted: false,
    })

    for (const transaction of transactions) {
      await transaction.update((t) => {
        t.categoryId = targetCategoryId
        t.updatedAt = new Date()
      })
    }
    await category.destroyPermanently()
  })

  if (targetCategoryId) {
    await recalculateCategoryTransactionCount(targetCategoryId)
  }
}

/**
 * Recalculate transaction count for a category based on actual transactions
 */
const recalculateCategoryTransactionCount = async (
  categoryId: string,
): Promise<number> => {
  const transactions = await getTransactionModels({
    categoryId,
    includeDeleted: false,
  })

  const count = transactions.length

  const category = await findCategory(categoryId)
  if (category) {
    await database.write(async () => {
      await category.update((c) => {
        c.transactionCount = count
        c.updatedAt = new Date()
      })
    })
  }

  return count
}

/**
 * Observe names for a list of category IDs.
 */
export const observeCategoryNamesByIds = (
  ids: string[],
): Observable<string[]> => {
  if (ids.length === 0) return from([[]])
  return getCategoryCollection()
    .query(Q.where("id", Q.oneOf(ids)))
    .observeWithColumns(["name"])
    .pipe(map((rows) => rows.map((r) => r.name)))
}
