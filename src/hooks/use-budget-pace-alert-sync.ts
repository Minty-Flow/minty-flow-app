import * as Notifications from "expo-notifications"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useAllBudgets } from "~/database/drizzle/read-models/budget-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { useNotificationPermissionStatus } from "~/hooks/use-notification-permission-status"
import { useNotificationStore } from "~/stores/notification.store"
import { getLiveBudgetSpent } from "~/utils/live-progress"
import { logger } from "~/utils/logger"
import { formatMoney } from "~/utils/number-format"
import { isOnPaceToExceed, paceOverageMinor } from "~/utils/pace-alert"
import {
  hasPaceAlerted,
  isPaceAlertDisabledForBudget,
  markPaceAlerted,
} from "~/utils/pace-alert-storage"
import {
  getBudgetPeriodKey,
  getBudgetProgressModel,
} from "~/utils/planning-progress"

interface PendingPaceAlert {
  id: string
  name: string
  currencyCode: string
  overageMinor: number
  periodKey: string
}

/**
 * Watches active budgets and, the first time one is trending to blow its
 * limit before the period ends, posts a single local notification (deep-links
 * to the budget). Re-evaluates whenever the underlying live queries push — so
 * adding or editing a transaction re-checks — and is a no-op while the global
 * or per-budget switch is off, or OS notifications are denied.
 */
export function useBudgetPaceAlertSync(): void {
  const { t } = useTranslation()
  const budgets = useAllBudgets()
  const isEnabled = useNotificationStore((s) => s.isPaceAlertEnabled)
  const sensitivity = useNotificationStore((s) => s.paceSensitivity)
  const { permissionStatus } = useNotificationPermissionStatus()

  const activeBudgets = useMemo(
    () => budgets.filter((b) => b.isActive && b.amount > 0),
    [budgets],
  )

  // One broad window covering every active budget's current period; each
  // budget re-filters it by its own period bounds below.
  const earliest = useMemo(() => {
    if (activeBudgets.length === 0) return undefined
    const starts = activeBudgets.map((b) =>
      getBudgetProgressModel(b, 0).periodStart.getTime(),
    )
    return new Date(Math.min(...starts)).toISOString()
  }, [activeBudgets])

  const { items } = useTransactions(earliest ? { from: earliest } : {})

  const pending = useMemo<PendingPaceAlert[]>(() => {
    const out: PendingPaceAlert[] = []
    for (const budget of activeBudgets) {
      if (isPaceAlertDisabledForBudget(budget.id)) continue
      const model = getBudgetProgressModel(budget, 0)
      const startMs = model.periodStart.getTime()
      const endMs = model.periodEnd.getTime()
      const windowTxns = items.filter((tx) => {
        const ms = tx.transactionDate.getTime()
        return ms >= startMs && ms <= endMs
      })
      const spentMinor = getLiveBudgetSpent(budget, windowTxns)
      const input = {
        spentMinor,
        limitMinor: budget.amount,
        elapsedDays: model.elapsedDays,
        totalDays: model.totalDays,
      }
      if (!isOnPaceToExceed(input, sensitivity)) continue
      const periodKey = getBudgetPeriodKey(budget)
      if (hasPaceAlerted(budget.id, periodKey)) continue
      out.push({
        id: budget.id,
        name: budget.name,
        currencyCode: budget.currencyCode,
        overageMinor: paceOverageMinor(input),
        periodKey,
      })
    }
    return out
  }, [activeBudgets, items, sensitivity])

  useEffect(() => {
    if (!isEnabled) return
    if (permissionStatus !== Notifications.PermissionStatus.GRANTED) return
    if (pending.length === 0) return

    for (const alert of pending) {
      const body = t("screens.settings.budgets.paceNotification.body", {
        amount: formatMoney(alert.overageMinor, alert.currencyCode, {
          hideSign: true,
        }),
      })
      Notifications.scheduleNotificationAsync({
        identifier: `budget-pace-${alert.id}-${alert.periodKey}`,
        content: {
          title: alert.name,
          body,
          data: { itemType: "budget", id: alert.id },
        },
        trigger: null,
      })
        .then(() => markPaceAlerted(alert.id, alert.periodKey))
        .catch((e) =>
          logger.error("budget pace alert failed", { error: String(e) }),
        )
    }
    // `pending` is memoised and already filtered to (budget, period) pairs
    // that have not been alerted; markPaceAlerted keeps this idempotent.
  }, [isEnabled, permissionStatus, pending, t])
}
