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
 * Observes a single category model by ID, emitting whenever the record changes.
 *
 * @param id - The category ID to observe.
 * @returns An observable that emits the raw `CategoryModel` on every change.
 */
export const observeCategoryById = (id: string): Observable<CategoryModel> => {
  return getCategoryCollection().findAndObserve(id)
}

/**
 * Observes a single category by ID, emitting a mapped plain `Category` domain object.
 * Uses `observeWithColumns` to react to individual field changes, not just record-level events.
 *
 * @param id - The category ID to observe.
 * @returns An observable that emits a `Category` domain object on every relevant column change.
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
 * Creates a new category row in the database with an initial `transactionCount` of zero.
 *
 * @param data - Validated form data for the new category.
 * @returns The newly created `CategoryModel` instance.
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
      category.colorSchemeName = data.colorSchemeName ?? null
    })
  })
}

/**
 * Updates the editable fields of an existing category (name, icon, color scheme).
 * Only the fields present in `updates` are changed; omitted keys are left untouched.
 *
 * @param category - The existing category model to update.
 * @param updates - Partial set of fields to change.
 * @returns The updated `CategoryModel` instance.
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
        c.colorSchemeName = updates.colorSchemeName ?? null
    })
  })
}

/**
 * Delete category completely. All transactions that belonged to this category
 * are reassigned to `targetCategoryId` (or uncategorized when null). The target
 * category's transaction count is recalculated atomically in the same write.
 * The category is then permanently removed.
 */
export const destroyCategory = async (
  category: CategoryModel,
  targetCategoryId: string | null = null,
): Promise<void> => {
  await database.write(async () => {
    // Fetch inside the write to avoid TOCTOU race between read and update.
    const transactions = await getTransactionModels({
      categoryId: category.id,
      includeDeleted: false,
    })

    for (const transaction of transactions) {
      await transaction.update((t) => {
        t.categoryId = targetCategoryId
      })
    }

    if (targetCategoryId) {
      // Fetch AFTER reassigning so the count already includes the moved rows.
      const updatedTargetTransactions = await getTransactionModels({
        categoryId: targetCategoryId,
        includeDeleted: false,
      })
      const targetCategory = await findCategory(targetCategoryId)
      if (targetCategory) {
        await targetCategory.update((c) => {
          c.transactionCount = updatedTargetTransactions.length
        })
      }
    }

    await category.destroyPermanently()
  })
}

/**
 * Observes the display names of categories matching the given IDs.
 * Returns an observable of an empty array immediately when `ids` is empty.
 *
 * @param ids - The category IDs whose names should be observed.
 * @returns An observable that emits an array of category names in DB order.
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
