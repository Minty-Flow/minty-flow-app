import { useEffect } from "react"

import { useAccountStore } from "~/stores/db/account.store"
import { useBudgetStore } from "~/stores/db/budget.store"
import { useCategoryStore } from "~/stores/db/category.store"
import { useGoalStore } from "~/stores/db/goal.store"
import { useLoanStore } from "~/stores/db/loan.store"
import { useTagStore } from "~/stores/db/tag.store"

export function useBootHydration(): void {
  useEffect(() => {
    Promise.all([
      useAccountStore.getState().refreshAll(),
      useCategoryStore.getState().refreshAll(),
      useTagStore.getState().refreshAll(),
      useBudgetStore.getState().refreshAll(),
      useGoalStore.getState().refreshAll(),
      useLoanStore.getState().refreshAll(),
    ])
  }, [])
}
