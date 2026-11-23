import { useMemo } from "react"

import { useAllBudgets } from "~/database/drizzle/read-models/budget-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { useDayKey } from "~/hooks/use-time-reactivity"
import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import { useNotificationStore } from "~/stores/notification.store"
import type { Budget } from "~/types/budgets"
import { getLiveBudgetSpent } from "~/utils/live-progress"
import { isOnPaceToExceed, paceOverageMinor } from "~/utils/pace-alert"
import {
  getBudgetPeriodKey,
  getBudgetProgressModel,
} from "~/utils/planning-progress"

interface PaceProgress {
  spent: number
  limit: number
  elapsedDays: number
  totalDays: number
  isOverBudget: boolean
}

/**
 * The amount a budget is projected to overshoot by, or null when it is not on
 * pace to exceed (or pace warnings are off, globally or for this budget). Shown
 * in the app whether or not OS notifications are allowed.
 */
export function useBudgetPaceOverage(
  budget: { id: string; isActive: boolean },
  progress: PaceProgress,
): number | null {
  const enabled = useNotificationStore((s) => s.isPaceAlertEnabled)
  const sensitivity = useNotificationStore((s) => s.paceSensitivity)
  const optedOut = useBudgetPaceStore((s) =>
    s.disabledBudgetIds.includes(budget.id),
  )
  if (!budget.isActive || !enabled || optedOut || progress.isOverBudget)
    return null
  const input = {
    spentMinor: progress.spent,
    limitMinor: progress.limit,
    elapsedDays: progress.elapsedDays,
    totalDays: progress.totalDays,
  }
  return isOnPaceToExceed(input, sensitivity) ? paceOverageMinor(input) : null
}

interface BudgetOnPace {
  budget: Budget
  periodKey: string
  overage: number
}

/**
 * Every active budget on pace to exceed its limit this period, with the
 * projected overage. Empty while pace warnings are off. Re-derives when
 * transactions change and at each day boundary.
 */
export function useBudgetsOnPace(): BudgetOnPace[] {
  const budgets = useAllBudgets()
  const dayKey = useDayKey()
  const enabled = useNotificationStore((s) => s.isPaceAlertEnabled)
  const sensitivity = useNotificationStore((s) => s.paceSensitivity)
  const disabledIds = useBudgetPaceStore((s) => s.disabledBudgetIds)

  const active = useMemo(
    () => budgets.filter((b) => b.isActive && b.amount > 0),
    [budgets],
  )
  // One window from the earliest period start; each budget re-filters it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: dayKey moves the period windows at the day boundary
  const from = useMemo(() => {
    if (active.length === 0) return undefined
    const starts = active.map((b) =>
      getBudgetProgressModel(b, 0).periodStart.getTime(),
    )
    return new Date(Math.min(...starts)).toISOString()
  }, [active, dayKey])
  // No budgets, or warnings off: match nothing rather than load all history.
  const { items } = useTransactions(
    enabled && from ? { from } : { accountIds: ["__none__"] },
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: dayKey moves the period windows at the day boundary
  return useMemo(() => {
    if (!enabled) return []
    return active.flatMap((budget) => {
      if (disabledIds.includes(budget.id)) return []
      const model = getBudgetProgressModel(budget, 0)
      const start = model.periodStart.getTime()
      const end = model.periodEnd.getTime()
      const spentMinor = getLiveBudgetSpent(
        budget,
        items.filter((tx) => {
          const ms = tx.transactionDate.getTime()
          return ms >= start && ms <= end
        }),
      )
      const input = {
        spentMinor,
        limitMinor: budget.amount,
        elapsedDays: model.elapsedDays,
        totalDays: model.totalDays,
      }
      if (!isOnPaceToExceed(input, sensitivity)) return []
      return [
        {
          budget,
          periodKey: getBudgetPeriodKey(budget),
          overage: paceOverageMinor(input),
        },
      ]
    })
  }, [enabled, active, items, sensitivity, disabledIds, dayKey])
}
