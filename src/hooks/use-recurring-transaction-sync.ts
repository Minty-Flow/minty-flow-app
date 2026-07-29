import { useCallback, useEffect, useRef } from "react"
import { AppState } from "react-native"

import { synchronizeAllRecurringTransactions } from "~/database/services-sqlite/recurring-transaction-service"
import { useDebouncedCallback } from "~/hooks/use-debounced-callback"
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
  const isFirstSyncRef = useRef(true)

  const sync = useCallback(async () => {
    const runAfterSync = isFirstSyncRef.current
    isFirstSyncRef.current = false

    try {
      await synchronizeAllRecurringTransactions()
      if (!runAfterSync || !isHydrated) return

      // Configure service with store state before running auto-confirm
      autoConfirmationService.configure({
        requireConfirmation,
        updateDateUponConfirmation,
      })

      await autoConfirmationService
        .runAutoConfirmDueOnStartup()
        .catch((e) => logger.error("Auto-confirm failed", { error: String(e) }))
    } catch (e) {
      logger.error("Recurring sync failed", { error: String(e) })
    }
  }, [isHydrated, requireConfirmation, updateDateUponConfirmation])
  const debouncedSync = useDebouncedCallback(() => {
    void sync()
  }, SYNC_DEBOUNCE_MS)

  useEffect(() => {
    // Initial sync — debounced for consistency with AppState-driven syncs.
    debouncedSync()

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") debouncedSync()
    })

    return () => {
      sub.remove()
    }
  }, [debouncedSync])
}
