import { create } from "zustand"

import type { Budget } from "~/types/budgets"

export interface BudgetOnPace {
  budget: Budget
  periodKey: string
  overage: number
}

interface BudgetsOnPaceStore {
  onPace: BudgetOnPace[]
  setOnPace: (onPace: BudgetOnPace[]) => void
}

/** Derived, never persisted: `BudgetPaceSync` writes it, the home screen reads it. */
export const useBudgetsOnPaceStore = create<BudgetsOnPaceStore>()((set) => ({
  onPace: [],
  setOnPace: (onPace) => set({ onPace }),
}))
