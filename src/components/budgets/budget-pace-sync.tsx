import { useEffect, useState } from "react"

import { useAllBudgets } from "~/database/drizzle/read-models/budget-read-model"
import { useComputedBudgetsOnPace } from "~/hooks/use-budget-pace"
import { useBudgetPaceAlertSync } from "~/hooks/use-budget-pace-alert-sync"
import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import { useBudgetsOnPaceStore } from "~/stores/budgets-on-pace.store"
import { useNotificationStore } from "~/stores/notification.store"
import type { Budget } from "~/types/budgets"

/**
 * Works out the budgets on pace once, for the home screen and the pace
 * notifications. Waits until the app is idle and renders nothing. While pace
 * warnings are off, or no budget needs checking, it runs no pace query.
 */
export function BudgetPaceSync() {
  const [isIdle, setIsIdle] = useState(false)
  const enabled = useNotificationStore((s) => s.isPaceAlertEnabled)
  useEffect(() => {
    const handle = requestIdleCallback(() => setIsIdle(true))
    return () => cancelIdleCallback(handle)
  }, [])
  return isIdle && enabled ? <CheckedBudgets /> : null
}

function CheckedBudgets() {
  const budgets = useAllBudgets()
  const disabledIds = useBudgetPaceStore((s) => s.disabledBudgetIds)
  const checked = budgets.filter(
    (b) => b.isActive && b.amount > 0 && !disabledIds.includes(b.id),
  )
  return checked.length > 0 ? <PaceCheck budgets={checked} /> : null
}

function PaceCheck({ budgets }: { budgets: Budget[] }) {
  const onPace = useComputedBudgetsOnPace(budgets)
  const setOnPace = useBudgetsOnPaceStore((s) => s.setOnPace)
  useEffect(() => {
    setOnPace(onPace)
  }, [onPace, setOnPace])
  // Nothing is on pace once there is nothing left to check.
  useEffect(() => () => setOnPace([]), [setOnPace])
  useBudgetPaceAlertSync(onPace)
  return null
}
