import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import { mapBudget } from "~/database/mappers/budget.mapper"
import {
  getAllBudgets,
  getBudgetAccountIds,
  getBudgetCategoryIds,
} from "~/database/repos/budget-repo"
import type { Budget } from "~/types/budgets"

interface BudgetStoreState {
  byId: Record<string, Budget>
  ids: string[]
  status: "idle" | "loading" | "ready"
  refreshAll: () => Promise<void>
}

let gen_2 = 0

export const useBudgetStore = create<BudgetStoreState>()(
  subscribeWithSelector((set) => ({
    byId: {},
    ids: [],
    status: "idle",

    refreshAll: async () => {
      const gen = ++gen_2
      set({ status: "loading" })

      const rows = await getAllBudgets()
      const byId: Record<string, Budget> = {}
      const ids: string[] = []

      await Promise.all(
        rows.map(async (row) => {
          const [accountIds, categoryIds] = await Promise.all([
            getBudgetAccountIds(row.id),
            getBudgetCategoryIds(row.id),
          ])
          const budget = mapBudget(row, accountIds, categoryIds)
          byId[budget.id] = budget
          ids.push(budget.id)
        }),
      )

      // Sort: active first, then by name
      ids.sort((a, b) => {
        const ba = byId[a]
        const bb = byId[b]
        if (ba.isActive !== bb.isActive) return ba.isActive ? -1 : 1
        return ba.name.localeCompare(bb.name)
      })

      if (gen_2 !== gen) return
      set({ byId, ids, status: "ready" })
    },
  })),
)

on("budgets:dirty", () => {
  useBudgetStore.getState().refreshAll()
})

on("db:reset", () => {
  useBudgetStore.getState().refreshAll()
})

export function useAllBudgets(): Budget[] {
  return useBudgetStore(useShallow((s) => s.ids.map((id) => s.byId[id])))
}

export function useBudget(id: string): Budget | undefined {
  return useBudgetStore((s) => s.byId[id])
}
