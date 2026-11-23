import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const budgetPaceStorage = createMMKV({ id: "budget-pace-storage" })

/**
 * Pace-alert bookkeeping, kept out of the DB (no migration for a notification
 * flag): budgets the user opted out of, and the period each budget was last
 * notified for, so there is at most one notification per budget per period.
 */
interface BudgetPaceStore {
  disabledBudgetIds: string[]
  /** Budget id → period key of the last pace notification. */
  alerted: Record<string, string>
  setDisabled: (budgetId: string, disabled: boolean) => void
  markAlerted: (budgetId: string, periodKey: string) => void
}

export const useBudgetPaceStore = create<BudgetPaceStore>()(
  persist(
    (set) => ({
      disabledBudgetIds: [],
      alerted: {},
      setDisabled: (budgetId, disabled) =>
        set((s) => ({
          disabledBudgetIds: disabled
            ? [...new Set([...s.disabledBudgetIds, budgetId])]
            : s.disabledBudgetIds.filter((id) => id !== budgetId),
        })),
      markAlerted: (budgetId, periodKey) =>
        set((s) => ({ alerted: { ...s.alerted, [budgetId]: periodKey } })),
    }),
    {
      name: "budget-pace-store",
      storage: mmkvJSONStorage(budgetPaceStorage),
    },
  ),
)
