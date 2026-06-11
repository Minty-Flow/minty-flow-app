import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import { mapGoal } from "~/database/mappers/goal.mapper"
import {
  getAllGoals,
  getArchivedGoals,
  getGoalAccountIds,
} from "~/database/repos/goal-repo"
import type { Goal, GoalType } from "~/types/goals"

interface GoalStoreState {
  byId: Record<string, Goal>
  ids: string[] // active goals
  archivedIds: string[]
  status: "idle" | "loading" | "ready"
  refreshAll: () => Promise<void>
}

let gen_2 = 0

export const useGoalStore = create<GoalStoreState>()(
  subscribeWithSelector((set) => ({
    byId: {},
    ids: [],
    archivedIds: [],
    status: "idle",

    refreshAll: async () => {
      const gen = ++gen_2
      set({ status: "loading" })

      const [activeRows, archivedRows] = await Promise.all([
        getAllGoals(),
        getArchivedGoals(),
      ])

      const allRows = [...activeRows, ...archivedRows]
      const byId: Record<string, Goal> = {}
      const ids: string[] = []
      const archivedIds: string[] = []

      await Promise.all(
        allRows.map(async (row) => {
          const accountIds = await getGoalAccountIds(row.id)
          const goal = mapGoal(row, accountIds)
          byId[goal.id] = goal
          if (goal.isArchived) {
            archivedIds.push(goal.id)
          } else {
            ids.push(goal.id)
          }
        }),
      )

      ids.sort((a, b) => byId[a].name.localeCompare(byId[b].name))
      archivedIds.sort((a, b) => byId[a].name.localeCompare(byId[b].name))

      if (gen_2 !== gen) return
      set({ byId, ids, archivedIds, status: "ready" })
    },
  })),
)

on("goals:dirty", () => {
  useGoalStore.getState().refreshAll()
})

on("db:reset", () => {
  useGoalStore.getState().refreshAll()
})

export function useAllGoals(): Goal[] {
  return useGoalStore(useShallow((s) => s.ids.map((id) => s.byId[id])))
}

export function useArchivedGoals(): Goal[] {
  return useGoalStore(useShallow((s) => s.archivedIds.map((id) => s.byId[id])))
}

export function useGoal(id: string): Goal | undefined {
  return useGoalStore((s) => s.byId[id])
}

export function useGoalsByType(goalType: GoalType): Goal[] {
  return useGoalStore(
    useShallow((s) =>
      s.ids.map((id) => s.byId[id]).filter((g) => g?.goalType === goalType),
    ),
  )
}

// export async function fetchGoalsByType(goalType: GoalType): Promise<Goal[]> {
//   const rows = await getGoalsByType(goalType)
//   return Promise.all(
//     rows.map(async (row) => {
//       const accountIds = await getGoalAccountIds(row.id)
//       return mapGoal(row, accountIds)
//     }),
//   )
// }
