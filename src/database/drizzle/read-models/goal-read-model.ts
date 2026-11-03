import { and, eq } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Goal, GoalType } from "~/types/goals"

import { drizzleDb } from "../db"
import { goalAccounts, goals, transactions } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

export function useGoalsQuery(): LiveReadModelResult<Goal[]> {
  const goalsResult = useLiveQuery(
    drizzleDb.select().from(goals).orderBy(goals.name),
  )
  const accountLinksResult = useLiveQuery(drizzleDb.select().from(goalAccounts))

  const accountIdsByGoalId = new Map<string, string[]>()
  for (const row of accountLinksResult.data) {
    const ids = accountIdsByGoalId.get(row.goalId) ?? []
    ids.push(row.accountId)
    accountIdsByGoalId.set(row.goalId, ids)
  }

  const data = goalsResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    goalType: (row.goalType || "savings") as GoalType,
    description: row.description,
    targetAmount: row.targetAmount,
    currencyCode: row.currencyCode,
    targetDate: row.targetDate != null ? new Date(row.targetDate) : null,
    icon: row.icon,
    colorSchemeName: row.colorSchemeName,
    colorScheme: getThemeStrict(row.colorSchemeName),
    isArchived: !!row.isArchived,
    accountIds: accountIdsByGoalId.get(row.id) ?? [],
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))

  return createLiveReadModelResult(data, [goalsResult, accountLinksResult])
}

function useAllGoals(): Goal[] {
  return useGoalsQuery().data.filter((goal) => !goal.isArchived)
}

export function useAllGoalsQuery(): LiveReadModelResult<Goal[]> {
  const result = useGoalsQuery()
  return { ...result, data: result.data.filter((goal) => !goal.isArchived) }
}

export function useArchivedGoalsQuery(): LiveReadModelResult<Goal[]> {
  const result = useGoalsQuery()
  return { ...result, data: result.data.filter((goal) => goal.isArchived) }
}

export function useGoalsByType(goalType: GoalType): Goal[] {
  return useAllGoals().filter((goal) => goal.goalType === goalType)
}

/**
 * True when a live transaction is linked to the goal. Progress is filtered by
 * the goal's currency, so the currency must stay put once a link exists.
 */
export function useGoalHasLinkedTransactions(goalId: string | undefined) {
  const result = useLiveQuery(
    drizzleDb
      .select({ id: transactions.id })
      .from(transactions)
      .where(
        and(
          // An unsaved goal has no id yet, so nothing can link to it.
          eq(transactions.goalId, goalId ?? ""),
          eq(transactions.isDeleted, 0),
        ),
      )
      .limit(1),
  )
  return Boolean(goalId) && result.data.length > 0
}
