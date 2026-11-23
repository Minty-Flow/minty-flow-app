import * as Notifications from "expo-notifications"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useAllBudgets } from "~/database/drizzle/read-models/budget-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { useDayKey } from "~/hooks/use-time-reactivity"
import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import { useNotificationStore } from "~/stores/notification.store"
import { getLiveBudgetSpent } from "~/utils/live-progress"
import { logger } from "~/utils/logger"
import { formatMoney } from "~/utils/number-format"
import { isOnPaceToExceed, paceOverageMinor } from "~/utils/pace-alert"
import {
  getBudgetPeriodKey,
  getBudgetProgressModel,
} from "~/utils/planning-progress"

/**
 * Posts one local notification the first time an active budget is on pace to
 * exceed its limit in a period; tapping it opens the budget. Re-checks when
 * transactions change and at each day boundary. Does nothing while the global
 * or per-budget switch is off, or OS notifications are not allowed.
 */
export function useBudgetPaceAlertSync(): void {
  const { t } = useTranslation()
  const budgets = useAllBudgets()
  const dayKey = useDayKey()
  const enabled = useNotificationStore((s) => s.isPaceAlertEnabled)
  const sensitivity = useNotificationStore((s) => s.paceSensitivity)
  const disabledIds = useBudgetPaceStore((s) => s.disabledBudgetIds)
  const alerted = useBudgetPaceStore((s) => s.alerted)

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
  const { items } = useTransactions(from ? { from } : {})

  // biome-ignore lint/correctness/useExhaustiveDependencies: dayKey moves the period windows at the day boundary
  const due = useMemo(() => {
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
      const periodKey = getBudgetPeriodKey(budget)
      if (!isOnPaceToExceed(input, sensitivity)) return []
      if (alerted[budget.id] === periodKey) return []
      return [{ budget, periodKey, overage: paceOverageMinor(input) }]
    })
  }, [enabled, active, items, sensitivity, disabledIds, alerted, dayKey])

  useEffect(() => {
    if (due.length === 0) return
    let cancelled = false
    ;(async () => {
      const { status } = await Notifications.getPermissionsAsync()
      if (cancelled || status !== Notifications.PermissionStatus.GRANTED) return
      for (const { budget, periodKey, overage } of due) {
        // Marked first: the effect re-runs on the store change, and a second
        // pass must not post the same alert again.
        useBudgetPaceStore.getState().markAlerted(budget.id, periodKey)
        Notifications.scheduleNotificationAsync({
          identifier: `budget-pace-${budget.id}-${periodKey}`,
          content: {
            title: budget.name,
            body: t("screens.settings.budgets.paceNotification.body", {
              amount: formatMoney(overage, budget.currencyCode, {
                hideSign: true,
              }),
            }),
            data: { itemType: "budget", id: budget.id },
          },
          trigger: null,
        }).catch((e) =>
          logger.error("budget pace alert failed", { error: String(e) }),
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [due, t])
}
