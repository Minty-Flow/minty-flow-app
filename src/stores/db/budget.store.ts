import { useBudgetsQuery } from "~/database/drizzle/hooks/use-budgets-query"
import type { Budget } from "~/types/budgets"

export function useAllBudgets(): Budget[] {
  return useBudgetsQuery().data
}

export function useBudget(id: string): Budget | undefined {
  return useAllBudgets().find((budget) => budget.id === id)
}
