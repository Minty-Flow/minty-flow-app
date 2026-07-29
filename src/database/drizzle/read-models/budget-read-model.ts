import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Budget, BudgetPeriod } from "~/types/budgets"

import { drizzleDb } from "../db"
import { budgetAccounts, budgetCategories, budgets } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

export function useBudgetsQuery(): LiveReadModelResult<Budget[]> {
  const budgetsResult = useLiveQuery(
    drizzleDb.select().from(budgets).orderBy(budgets.name),
  )
  const accountLinksResult = useLiveQuery(
    drizzleDb.select().from(budgetAccounts),
  )
  const categoryLinksResult = useLiveQuery(
    drizzleDb.select().from(budgetCategories),
  )

  const accountIdsByBudgetId = new Map<string, string[]>()
  for (const row of accountLinksResult.data) {
    const ids = accountIdsByBudgetId.get(row.budgetId) ?? []
    ids.push(row.accountId)
    accountIdsByBudgetId.set(row.budgetId, ids)
  }

  const categoryIdsByBudgetId = new Map<string, string[]>()
  for (const row of categoryLinksResult.data) {
    const ids = categoryIdsByBudgetId.get(row.budgetId) ?? []
    ids.push(row.categoryId)
    categoryIdsByBudgetId.set(row.budgetId, ids)
  }

  const data = budgetsResult.data
    .map((row) => ({
      id: row.id,
      name: row.name,
      amount: row.amount,
      currencyCode: row.currencyCode,
      period: row.period as BudgetPeriod,
      startDate: new Date(row.startDate),
      endDate: row.endDate != null ? new Date(row.endDate) : null,
      alertThreshold: row.alertThreshold,
      isActive: !!row.isActive,
      icon: row.icon,
      colorSchemeName: row.colorSchemeName,
      colorScheme: getThemeStrict(row.colorSchemeName),
      accountIds: accountIdsByBudgetId.get(row.id) ?? [],
      categoryIds: categoryIdsByBudgetId.get(row.id) ?? [],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
    .sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
      return a.name.localeCompare(b.name)
    })

  return createLiveReadModelResult(data, [
    budgetsResult,
    accountLinksResult,
    categoryLinksResult,
  ])
}

export function useAllBudgets(): Budget[] {
  return useBudgetsQuery().data
}

export function useBudget(id: string): Budget | undefined {
  return useAllBudgets().find((budget) => budget.id === id)
}
