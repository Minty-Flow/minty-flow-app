import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { on } from "~/database/events"
import { mapLoan } from "~/database/mappers/loan.mapper"
import { getAllLoans } from "~/database/repos/loan-repo"
import type { Loan } from "~/types/loans"
import { logger } from "~/utils/logger"

interface LoanStoreState {
  byId: Record<string, Loan>
  ids: string[]
  status: "idle" | "loading" | "ready" | "error"
  refreshAll: () => Promise<void>
}

let gen_2 = 0

export const useLoanStore = create<LoanStoreState>()(
  subscribeWithSelector((set) => ({
    byId: {},
    ids: [],
    status: "idle",

    refreshAll: async () => {
      const gen = ++gen_2
      set({ status: "loading" })

      try {
        const rows = await getAllLoans()
        const byId: Record<string, Loan> = {}
        const loans: Loan[] = []

        for (const row of rows) {
          const loan = mapLoan(row)
          byId[loan.id] = loan
          loans.push(loan)
        }

        // Sort: due_date asc nulls last, then name asc
        loans.sort((a, b) => {
          if (a.dueDate == null && b.dueDate == null) {
            return a.name.localeCompare(b.name)
          }
          if (a.dueDate == null) return 1
          if (b.dueDate == null) return -1
          const diff = a.dueDate.getTime() - b.dueDate.getTime()
          if (diff !== 0) return diff
          return a.name.localeCompare(b.name)
        })

        const ids = loans.map((l) => l.id)
        if (gen_2 !== gen) return
        set({ byId, ids, status: "ready" })
      } catch (error) {
        if (gen_2 !== gen) return
        logger.error("Failed to refresh loans", {
          error: error instanceof Error ? error.message : String(error),
        })
        set({ status: "error" })
      }
    },
  })),
)

on("loans:dirty", () => {
  useLoanStore.getState().refreshAll()
})

on("db:reset", () => {
  useLoanStore.getState().refreshAll()
})

export function useAllLoans(): Loan[] {
  return useLoanStore(useShallow((s) => s.ids.map((id) => s.byId[id])))
}

export function useLoan(id: string): Loan | undefined {
  return useLoanStore((s) => s.byId[id])
}
