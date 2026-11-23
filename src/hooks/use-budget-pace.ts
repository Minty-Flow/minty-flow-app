import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import { useNotificationStore } from "~/stores/notification.store"
import { isOnPaceToExceed, paceOverageMinor } from "~/utils/pace-alert"

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
