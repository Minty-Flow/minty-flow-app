import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
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
 * Get all categories
 */
export const getCategories = async (
  includeArchived = false,
): Promise<CategoryModel[]> => {
  const categories = getCategoryCollection()
  if (includeArchived) {
    return await categories.query().fetch()
  }
  return await categories.query(Q.where("is_archived", false)).fetch()
}

/**
 * Find a category by ID
 */
export const findCategory = async (
  id: string,
): Promise<CategoryModel | null> => {
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
  includeArchived = false,
): Observable<Category[]> => {
  const categories = getCategoryCollection()
  let query = categories.query(Q.where("type", type), Q.sortBy("name", Q.asc))

  if (!includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  // Observe specific columns that can change when editing
  // This makes the query reactive to column changes, not just record additions/deletions
  return query
    .observeWithColumns([
      "name",
      "icon",
      "type",
      "color_scheme_name",
      "transaction_count",
      "is_archived",
    ])
    .pipe(
      map((results) => {
        return results.map(modelToCategory) // convert to immutable plain object here
      }),
    )
}

/**
 * Observe count of archived categories by type
 */
export const observeArchivedCategoryCountByType = (
  type: TransactionType,
): Observable<number> => {
  return getCategoryCollection()
    .query(Q.where("type", type), Q.where("is_archived", true))
    .observeCount()
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
      "is_archived",
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
      category.isArchived = false
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
      if (updates.isArchived !== undefined) c.isArchived = updates.isArchived
      c.updatedAt = new Date()
    })
  })
}

/**
 * Update category by ID
 */
export const updateCategoryById = async (
  id: string,
  updates: Partial<{
    name: string
    icon: string | null | undefined
    colorSchemeName: string | null | undefined
    isArchived: boolean
  }>,
): Promise<CategoryModel> => {
  const category = await findCategory(id)
  if (!category) {
    throw new Error(`Category with id ${id} not found`)
  }
  return await updateCategory(category, updates)
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
  const transactions = await getTransactionModels({
    categoryId: category.id,
    includeDeleted: false,
  })

  await database.write(async () => {
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
export const recalculateCategoryTransactionCount = async (
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
 * Recalculate transaction counts for all categories
 */
export const recalculateAllCategoryTransactionCounts =
  async (): Promise<void> => {
    const categories = await getCategories(true) // Include archived

    for (const category of categories) {
      await recalculateCategoryTransactionCount(category.id)
    }
  }
