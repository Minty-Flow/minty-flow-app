import { useEffect } from "react"
import { AppState } from "react-native"

import { synchronizeAllRecurringTransactions } from "~/database/services/recurring-transaction-service"
import { autoConfirmationService } from "~/services/auto-confirmation-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { logger } from "~/utils/logger"

/**
 * Debounce delay applied to every sync trigger — both the initial mount sync
 * and subsequent AppState "active" transitions. The delay coalesces rapid
 * foreground events (e.g. permission dialogs, in-app modals that briefly
 * background the app) into a single database write, preventing duplicate
 * recurring-transaction rows.
 */
const SYNC_DEBOUNCE_MS = 1_000

/**
 * Syncs recurring transactions: once on mount and whenever the app returns to foreground.
 * Also runs auto-confirm of past-due pending transactions on startup (after first sync).
 *
 * Bug #2: This is the ONLY place that should trigger the recurring generator.
 * Do not call synchronizeAllRecurringTransactions from screens, context, or store
 * subscriptions — that causes double-runs and duplicate transactions.
 *
 * Hydration-aware: Waits for PendingTransactionsStore to hydrate before configuring
 * the auto-confirmation service to prevent non-reactive store reads.
 *
 * Both the initial sync and AppState-driven syncs are debounced by SYNC_DEBOUNCE_MS
 * so every code path is consistent and coalesces rapid back-to-foreground events.
 */
export function useRecurringTransactionSync(): void {
  const isHydrated = usePendingTransactionsStore((s) => s.isHydrated)
  const requireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    // Track whether the initial (mount) sync has already fired so the
    // auto-confirm step runs exactly once per mount.
    let isFirstSync = true

    const sync = () => {
      if (cancelled) return
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (cancelled) return

        const runAfterSync = isFirstSync
        isFirstSync = false

        synchronizeAllRecurringTransactions()
          .then(() => {
            if (cancelled) return
            if (!runAfterSync) return
            if (!isHydrated) return

            // Configure service with store state before running auto-confirm
            autoConfirmationService.configure({
              requireConfirmation,
              updateDateUponConfirmation,
            })

            return autoConfirmationService
              .runAutoConfirmDueOnStartup()
              .catch((e) =>
                logger.error("Auto-confirm failed", { error: String(e) }),
              )
          })
          .catch((e) =>
            logger.error("Recurring sync failed", { error: String(e) }),
          )
      }, SYNC_DEBOUNCE_MS)
    }

    // Initial sync — debounced for consistency with AppState-driven syncs
    sync()

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") sync()
    })

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      sub.remove()
    }
  }, [isHydrated, requireConfirmation, updateDateUponConfirmation])
}
