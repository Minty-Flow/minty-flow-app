import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { PayoffStrategy } from "~/utils/debt-payoff"

/**
 * Planner-only inputs for the debt payoff screen. APR and minimum payment are
 * not stored on the loan row — they live here, keyed by loan id, and are used
 * for nothing except the projection.
 */
export interface LoanPlannerInput {
  /** Annual interest rate as a percentage. */
  aprPercent: number
  /** Minimum monthly payment, minor units. */
  minPaymentMinor: number
}

interface DebtPayoffStore {
  byLoanId: Record<string, LoanPlannerInput>
  extraPerMonthMinor: number
  strategy: PayoffStrategy
  setLoanInput: (loanId: string, patch: Partial<LoanPlannerInput>) => void
  setExtraPerMonth: (valueMinor: number) => void
  setStrategy: (strategy: PayoffStrategy) => void
  /** Wipe every planner input back to defaults. Does not touch loans. */
  reset: () => void
}

const DEFAULTS = {
  byLoanId: {} as Record<string, LoanPlannerInput>,
  extraPerMonthMinor: 0,
  strategy: "avalanche" as PayoffStrategy,
}

const storage = createMMKV({ id: "debt-payoff-storage" })

export const useDebtPayoffStore = create<DebtPayoffStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setLoanInput: (loanId, patch) =>
        set((state) => {
          const prev = state.byLoanId[loanId] ?? {
            aprPercent: 0,
            minPaymentMinor: 0,
          }
          return {
            byLoanId: { ...state.byLoanId, [loanId]: { ...prev, ...patch } },
          }
        }),
      setExtraPerMonth: (valueMinor) => set({ extraPerMonthMinor: valueMinor }),
      setStrategy: (strategy) => set({ strategy }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: "debt-payoff-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) ?? null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      })),
    },
  ),
)
