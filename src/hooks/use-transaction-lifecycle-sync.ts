import { useCallback, useEffect, useRef } from "react"
import { AppState } from "react-native"

import { synchronizeAllRecurringTransactions } from "~/database/services/recurring-transaction-service"
import { useDebouncedCallback } from "~/hooks/use-debounced-callback"
import i18n from "~/i18n/config"
import { autoConfirmationService } from "~/services/auto-confirmation-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

/**
 * Debounce delay applied to every sync trigger — the initial mount sync and
 * AppState "active" transitions. Coalesces rapid foreground events (permission
 * dialogs, brief in-app backgrounding) into a single pass, preventing duplicate
 * recurring-transaction rows and redundant sweeps.
 */
const SYNC_DEBOUNCE_MS = 1_000

/**
 * Minimum gap between foreground-triggered syncs. The auto-confirm service has
 * its own 60s tick, so quick app switches need not rescan everything.
 */
const FOREGROUND_SYNC_MIN_GAP_MS = 60_000

/**
 * The single owner of the transaction lifecycle. On mount and on every app
 * foreground it generates due recurring instances, then (once the pending-
 * transactions store has hydrated) configures + starts the auto-confirmation
 * service and runs a full `sweep()` of all pending rows. It also keeps the
 * service's config in step with the auto-pay switches, and stops the service on
 * unmount.
 *
 * This is the ONLY place that triggers the recurring generator — calling it from
 * screens/context/store subscriptions causes double-runs and duplicate rows.
 *
 * The foreground sweep closes the warm-background gap: a pre-approved pending row
 * dated outside the home list's date window (e.g. an overdue subscription from a
 * previous month) is only visible to `getPendingTransactions()`, which `sweep()`
 * reads in full — not just the rows the UI happens to render.
 */
export function useTransactionLifecycleSync(): void {
  const isHydrated = usePendingTransactionsStore((s) => s.isHydrated)
  const autoPaySubscriptions = usePendingTransactionsStore(
    (s) => s.autoPaySubscriptions,
  )
  const autoPayRepetitive = usePendingTransactionsStore(
    (s) => s.autoPayRepetitive,
  )
  const autoPayUpcoming = usePendingTransactionsStore((s) => s.autoPayUpcoming)
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )

  // Keep the service config current the instant a switch changes, so a toggle
  // takes effect mid-session (not only on the next foreground / relaunch).
  useEffect(() => {
    if (!isHydrated) return
    autoConfirmationService.configure({
      autoPaySubscriptions,
      autoPayRepetitive,
      autoPayUpcoming,
      updateDateUponConfirmation,
    })
  }, [
    isHydrated,
    autoPaySubscriptions,
    autoPayRepetitive,
    autoPayUpcoming,
    updateDateUponConfirmation,
  ])

  const lastSyncAtRef = useRef(0)
  const sync = useCallback(async () => {
    lastSyncAtRef.current = Date.now()
    try {
      const stopped = await synchronizeAllRecurringTransactions()
      for (const rule of stopped) {
        Toast.error({
          title: i18n.t("components.transactionForm.toast.recurringStopped"),
          description: i18n.t(
            "components.transactionForm.toast.recurringStoppedDescription",
            {
              title:
                rule.title ?? i18n.t("common.transaction.untitledTransaction"),
            },
          ),
        })
      }

      // Skip auto-confirm until preferences have hydrated — configuring with
      // default switch values would auto-confirm rows the user opted out of.
      if (!isHydrated) return

      autoConfirmationService.configure({
        autoPaySubscriptions,
        autoPayRepetitive,
        autoPayUpcoming,
        updateDateUponConfirmation,
      })
      autoConfirmationService.start()
      await autoConfirmationService
        .sweep()
        .catch((e) =>
          logger.error("Auto-confirm sweep failed", { error: String(e) }),
        )
    } catch (e) {
      logger.error("Recurring sync failed", { error: String(e) })
    }
  }, [
    isHydrated,
    autoPaySubscriptions,
    autoPayRepetitive,
    autoPayUpcoming,
    updateDateUponConfirmation,
  ])
  const debouncedSync = useDebouncedCallback(() => {
    // When the JS thread is idle, not during the first frames or a transition.
    requestIdleCallback(() => {
      void sync()
    })
  }, SYNC_DEBOUNCE_MS)

  useEffect(() => {
    debouncedSync()

    const sub = AppState.addEventListener("change", (state) => {
      if (
        state === "active" &&
        Date.now() - lastSyncAtRef.current >= FOREGROUND_SYNC_MIN_GAP_MS
      ) {
        debouncedSync()
      }
    })

    return () => {
      sub.remove()
    }
  }, [debouncedSync])

  // Tear the service down only on true unmount (app teardown / root remount),
  // not on every switch change.
  useEffect(() => {
    return () => autoConfirmationService.stop()
  }, [])
}
