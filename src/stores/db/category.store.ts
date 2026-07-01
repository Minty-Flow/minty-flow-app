import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import { mapCategory } from "~/database/mappers/category.mapper"
import { getAllCategories } from "~/database/repos/category-repo"
import { getCategoryTransactionCounts } from "~/database/services-sqlite/category-service"
import type { Category } from "~/types/categories"
import { logger } from "~/utils/logger"

interface CategoryStoreState {
  byId: Record<string, Category>
  ids: string[]
  status: "idle" | "loading" | "ready" | "error"
  refreshAll: () => Promise<void>
}

let gen_2 = 0

export const useCategoryStore = create<CategoryStoreState>()(
  subscribeWithSelector((set) => ({
    byId: {},
    ids: [],
    status: "idle",

    refreshAll: async () => {
      const gen = ++gen_2
      set({ status: "loading" })

      try {
        const [rows, counts] = await Promise.all([
          getAllCategories(),
          getCategoryTransactionCounts(),
        ])
        const byId: Record<string, Category> = {}
        const ids: string[] = []

        for (const row of rows) {
          const category = {
            ...mapCategory(row),
            transactionCount: counts.get(row.id) ?? 0,
          }
          byId[category.id] = category
          ids.push(category.id)
        }

        if (gen_2 !== gen) return
        set({ byId, ids, status: "ready" })
      } catch (error) {
        if (gen_2 !== gen) return
        logger.error("Failed to refresh categories", {
          error: error instanceof Error ? error.message : String(error),
        })
        set({ status: "error" })
      }
    },
  })),
)

on("categories:dirty", () => {
  useCategoryStore.getState().refreshAll()
})

on("db:reset", () => {
  useCategoryStore.getState().refreshAll()
})

export function useCategories(): Category[] {
  return useCategoryStore(useShallow((s) => s.ids.map((id) => s.byId[id])))
}

export function useCategoriesByType(type: string): Category[] {
  return useCategoryStore(
    useShallow((s) =>
      s.ids.map((id) => s.byId[id]).filter((c) => c?.type === type),
    ),
  )
}

export function useCategory(id: string): Category | undefined {
  return useCategoryStore((s) => s.byId[id])
}
