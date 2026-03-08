import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"

import { database } from "../index"
import type BudgetModel from "../models/budget"
import type CategoryModel from "../models/category"

/**
 * BudgetModel Service
 *
 * Provides functions for managing budget data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the budgets collection
 */
const getBudgetModelCollection = () => {
  return database.get<BudgetModel>("budgets")
}

/**
 * Get budgets with optional filters
 */
export const getBudgetModels = async (filters?: {
  isActive?: boolean
  includeArchived?: boolean
}): Promise<BudgetModel[]> => {
  const budgets = getBudgetModelCollection()
  let query = budgets.query()

  if (filters?.isActive !== undefined) {
    query = query.extend(Q.where("is_active", filters.isActive))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return await query.fetch()
}

/**
 * Find a budget by ID
 */
export const findBudgetModel = async (
  id: string,
): Promise<BudgetModel | null> => {
  try {
    return await getBudgetModelCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe budgets reactively with optional filters
 */
export const observeBudgetModels = (filters?: {
  isActive?: boolean
  includeArchived?: boolean
}): Observable<BudgetModel[]> => {
  const budgets = getBudgetModelCollection()
  let query = budgets.query()

  if (filters?.isActive !== undefined) {
    query = query.extend(Q.where("is_active", filters.isActive))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return query.observe()
}

/**
 * Observe a specific budget by ID
 */
export const observeBudgetModelById = (id: string): Observable<BudgetModel> => {
  return getBudgetModelCollection().findAndObserve(id)
}

/**
 * Create a new budget
 */
export const createBudgetModel = async (data: {
  name: string
  amount: number
  currencyCode: string
  period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
  startDate: Date
  endDate?: Date
  categoryId?: string
  alertThreshold?: number
}): Promise<BudgetModel> => {
  const budgets = getBudgetModelCollection()

  return await database.write(async () => {
    // Validate category if provided
    if (data.categoryId) {
      const categories = database.get<CategoryModel>("categories")
      const category = await categories.find(data.categoryId)
      if (!category) {
        throw new Error(`Category with id ${data.categoryId} not found`)
      }
    }

    return await budgets.create((budget) => {
      budget.name = data.name
      budget.amount = data.amount
      budget.spentAmount = 0
      budget.currencyCode = data.currencyCode
      budget.period = data.period
      budget.startDate = data.startDate
      budget.endDate = data.endDate ?? null
      budget.categoryId = data.categoryId ?? null
      budget.alertThreshold = data.alertThreshold ?? null
      budget.isActive = true
      budget.isArchived = false
      budget.createdAt = new Date()
      budget.updatedAt = new Date()
    })
  })
}

/**
 * Update budget
 */
export const updateBudgetModel = async (
  budget: BudgetModel,
  updates: Partial<{
    name: string
    amount: number
    spentAmount: number
    period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
    startDate: Date
    endDate: Date | null | undefined
    alertThreshold: number | null | undefined
    isActive: boolean
    isArchived: boolean
  }>,
): Promise<BudgetModel> => {
  return await database.write(async () => {
    return await budget.update((b) => {
      if (updates.name !== undefined) b.name = updates.name
      if (updates.amount !== undefined) b.amount = updates.amount
      if (updates.spentAmount !== undefined) b.spentAmount = updates.spentAmount
      if (updates.period !== undefined) b.period = updates.period
      if (updates.startDate !== undefined) b.startDate = updates.startDate
      if (updates.endDate !== undefined) b.endDate = updates.endDate ?? null
      if (updates.alertThreshold !== undefined)
        b.alertThreshold = updates.alertThreshold ?? null
      if (updates.isActive !== undefined) b.isActive = updates.isActive
      if (updates.isArchived !== undefined) b.isArchived = updates.isArchived
      b.updatedAt = new Date()
    })
  })
}

/**
 * Update budget by ID
 */
export const updateBudgetModelById = async (
  id: string,
  updates: Partial<{
    name: string
    amount: number
    spentAmount: number
    period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
    startDate: Date
    endDate: Date | null | undefined
    alertThreshold: number | null | undefined
    isActive: boolean
    isArchived: boolean
  }>,
): Promise<BudgetModel> => {
  const budget = await findBudgetModel(id)
  if (!budget) {
    throw new Error(`BudgetModel with id ${id} not found`)
  }
  return await updateBudgetModel(budget, updates)
}

/**
 * Add spending to budget
 */
export const addSpending = async (
  budget: BudgetModel,
  amount: number,
): Promise<BudgetModel> => {
  return await updateBudgetModel(budget, {
    spentAmount: budget.spentAmount + amount,
  })
}

/**
 * Reset budget spent amount
 */
export const resetBudgetModelSpending = async (
  budget: BudgetModel,
): Promise<BudgetModel> => {
  return await updateBudgetModel(budget, { spentAmount: 0 })
}

/**
 * Permanently destroy budget
 */
export const destroyBudgetModel = async (
  budget: BudgetModel,
): Promise<void> => {
  await database.write(async () => {
    await budget.destroyPermanently()
  })
}
