import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Goal, GoalType } from "~/types/goals"

import { drizzleDb } from "../db"
import { goalAccounts, goals } from "../schema"

export function useGoalsQuery(): {
  data: Goal[]
  error: Error | undefined
  updatedAt: Date | undefined
} {
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

  return {
    data: goalsResult.data.map((row) => ({
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
    })),
    error: goalsResult.error ?? accountLinksResult.error,
    updatedAt: goalsResult.updatedAt ?? accountLinksResult.updatedAt,
  }
}
