import { budgetsSpentQuery } from "~/database/drizzle/read-models/budget-spend-query"
import { useLiveQuery } from "~/database/drizzle/use-live-query"
import { useDayKey } from "~/hooks/use-time-reactivity"
import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import {
  type BudgetOnPace,
  useBudgetsOnPaceStore,
} from "~/stores/budgets-on-pace.store"
import { useNotificationStore } from "~/stores/notification.store"
import type { Budget } from "~/types/budgets"
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

/**
 * Every active budget on pace to exceed its limit this period, with the
 * projected overage, as `BudgetPaceSync` last worked it out. Empty while pace
 * warnings are off.
 */
export function useBudgetsOnPace(): BudgetOnPace[] {
  return useBudgetsOnPaceStore((s) => s.onPace)
}

// Takes the day key so that the compiled hook re-reads the clock when it moves.
function getPaceWindows(budgets: Budget[], _dayKey: string) {
  return budgets.map((budget) => {
    const model = getBudgetProgressModel(budget, 0)
    return {
      // The period is part of the key, so a result left over from the previous
      // period is never read as this period's spending.
      key: `${budget.id}|${model.periodStart.toISOString()}`,
      budget,
      from: model.periodStart,
      to: model.periodEnd,
      elapsedDays: model.elapsedDays,
      totalDays: model.totalDays,
    }
  })
}

/**
 * Works out which of `budgets` are on pace to exceed, from one SQL sum per
 * budget. Re-derives when transactions change and at each day boundary.
 * `budgets` must not be empty.
 */
export function useComputedBudgetsOnPace(budgets: Budget[]): BudgetOnPace[] {
  const dayKey = useDayKey()
  const sensitivity = useNotificationStore((s) => s.paceSensitivity)
  const windows = getPaceWindows(budgets, dayKey)
  const queryKey = JSON.stringify(
    windows.map(({ key, budget, to }) => [
      key,
      to.toISOString(),
      budget.currencyCode,
      budget.accountIds,
      budget.categoryIds,
    ]),
  )
  const { data } = useLiveQuery(budgetsSpentQuery(windows), [queryKey])

  return windows.flatMap(({ key, budget, elapsedDays, totalDays }) => {
    const spent = data[0]?.[key]
    if (spent === undefined) return []
    const input = {
      spentMinor: Math.max(spent, 0),
      limitMinor: budget.amount,
      elapsedDays,
      totalDays,
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
}
