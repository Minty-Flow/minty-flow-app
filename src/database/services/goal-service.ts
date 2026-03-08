import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"

import { database } from "../index"
import type GoalModel from "../models/goal"

/**
 * Goal Service
 *
 * Provides functions for managing goal data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the goals collection
 */
const getGoalCollection = () => {
  return database.get<GoalModel>("goals")
}

/**
 * Get all goals
 */
export const getGoals = async (
  includeArchived = false,
): Promise<GoalModel[]> => {
  const goals = getGoalCollection()
  if (includeArchived) {
    return await goals.query().fetch()
  }
  return await goals.query(Q.where("is_archived", false)).fetch()
}

/**
 * Find a goal by ID
 */
export const findGoal = async (id: string): Promise<GoalModel | null> => {
  try {
    return await getGoalCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe all goals reactively
 */
export const observeGoals = (
  includeArchived = false,
): Observable<GoalModel[]> => {
  const goals = getGoalCollection()
  if (includeArchived) {
    return goals.query().observe()
  }
  return goals.query(Q.where("is_archived", false)).observe()
}

/**
 * Observe a specific goal by ID
 */
export const observeGoalById = (id: string): Observable<GoalModel> => {
  return getGoalCollection().findAndObserve(id)
}

/**
 * Create a new goal
 */
export const createGoal = async (data: {
  name: string
  description?: string
  targetAmount: number
  currentAmount?: number
  currencyCode: string
  targetDate?: Date
  icon?: string
  color?: string
}): Promise<GoalModel> => {
  return await database.write(async () => {
    return await getGoalCollection().create((goal) => {
      goal.name = data.name
      goal.description = data.description ?? null
      goal.targetAmount = data.targetAmount
      goal.currentAmount = data.currentAmount || 0
      goal.currencyCode = data.currencyCode
      goal.targetDate = data.targetDate ?? null
      goal.icon = data.icon ?? null
      goal.color = data.color ?? null
      goal.isCompleted = false
      goal.isArchived = false
      goal.createdAt = new Date()
      goal.updatedAt = new Date()
    })
  })
}

/**
 * Update goal
 */
export const updateGoal = async (
  goal: GoalModel,
  updates: Partial<{
    name: string
    description: string | null | undefined
    targetAmount: number
    currentAmount: number
    targetDate: Date | null | undefined
    icon: string | null | undefined
    color: string | null | undefined
    isCompleted: boolean
    isArchived: boolean
  }>,
): Promise<GoalModel> => {
  return await database.write(async () => {
    return await goal.update((g) => {
      if (updates.name !== undefined) g.name = updates.name
      if (updates.description !== undefined)
        g.description = updates.description ?? null
      if (updates.targetAmount !== undefined)
        g.targetAmount = updates.targetAmount
      if (updates.currentAmount !== undefined)
        g.currentAmount = updates.currentAmount
      if (updates.targetDate !== undefined)
        g.targetDate = updates.targetDate ?? null
      if (updates.icon !== undefined) g.icon = updates.icon ?? null
      if (updates.color !== undefined) g.color = updates.color ?? null
      if (updates.isCompleted !== undefined) g.isCompleted = updates.isCompleted
      if (updates.isArchived !== undefined) g.isArchived = updates.isArchived
      g.updatedAt = new Date()
    })
  })
}

/**
 * Update goal by ID
 */
export const updateGoalById = async (
  id: string,
  updates: Partial<{
    name: string
    description: string | null | undefined
    targetAmount: number
    currentAmount: number
    targetDate: Date | null | undefined
    icon: string | null | undefined
    color: string | null | undefined
    isCompleted: boolean
    isArchived: boolean
  }>,
): Promise<GoalModel> => {
  const goal = await findGoal(id)
  if (!goal) {
    throw new Error(`Goal with id ${id} not found`)
  }
  return await updateGoal(goal, updates)
}

/**
 * Add amount to goal
 */
export const addToGoal = async (
  goal: GoalModel,
  amount: number,
): Promise<GoalModel> => {
  const newAmount = goal.currentAmount + amount
  const isCompleted = newAmount >= goal.targetAmount
  return await updateGoal(goal, {
    currentAmount: newAmount,
    isCompleted,
  })
}

/**
 * Permanently destroy goal
 */
export const destroyGoal = async (goal: GoalModel): Promise<void> => {
  await database.write(async () => {
    await goal.destroyPermanently()
  })
}
