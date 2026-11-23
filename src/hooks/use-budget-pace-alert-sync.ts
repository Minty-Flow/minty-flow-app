import * as Notifications from "expo-notifications"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { formatPaceAmount } from "~/components/budgets/pace-warning"
import { BUDGET_ALERTS_CHANNEL_ID } from "~/constants/notification-channels"
import { useBudgetsOnPace } from "~/hooks/use-budget-pace"
import { useBudgetPaceStore } from "~/stores/budget-pace.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { logger } from "~/utils/logger"

/**
 * Posts one local notification the first time an active budget is on pace to
 * exceed its limit in a period; tapping it opens the budget. Re-checks when
 * transactions change and at each day boundary. Does nothing while the global
 * or per-budget switch is off, or OS notifications are not allowed.
 */
export function useBudgetPaceAlertSync(): void {
  const { t } = useTranslation()
  const onPace = useBudgetsOnPace()
  const alerted = useBudgetPaceStore((s) => s.alerted)
  const due = useMemo(
    () =>
      onPace.filter(
        ({ budget, periodKey }) => alerted[budget.id] !== periodKey,
      ),
    [onPace, alerted],
  )

  useEffect(() => {
    if (due.length === 0) return
    let cancelled = false
    ;(async () => {
      const { status } = await Notifications.getPermissionsAsync()
      if (cancelled || status !== Notifications.PermissionStatus.GRANTED) return
      for (const { budget, periodKey, overage } of due) {
        // The lock screen shows the body: follow privacy mode like the app.
        const { currencyLook, privacyMode } = useMoneyFormattingStore.getState()
        // Marked once posted, so a failed post retries; the fixed identifier
        // keeps a retry from stacking a second notification.
        Notifications.scheduleNotificationAsync({
          identifier: `budget-pace-${budget.id}-${periodKey}`,
          content: {
            title: budget.name,
            body: t("screens.settings.budgets.paceNotification.body", {
              amount: formatPaceAmount(overage, budget.currencyCode, {
                currencyLook,
                privacyMode,
              }),
            }),
            data: { itemType: "budget", id: budget.id },
          },
          // Without a channel Android drops it silently (no fallback channel).
          trigger: { channelId: BUDGET_ALERTS_CHANNEL_ID },
        })
          .then(() =>
            useBudgetPaceStore.getState().markAlerted(budget.id, periodKey),
          )
          .catch((e) =>
            logger.error("budget pace alert failed", { error: String(e) }),
          )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [due, t])
}
