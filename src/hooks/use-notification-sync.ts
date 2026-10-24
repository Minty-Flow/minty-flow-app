import { useEffect } from "react"
import { AppState } from "react-native"

import {
  onWriteCommitted,
  writeAffectsPendingTransactions,
} from "~/database/commit-events"
import { synchronizePlannedTransactionNotifications } from "~/services/pending-transaction-notifications"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { logger } from "~/utils/logger"

/** Writes that land together (an import, a recurring catch-up) sync once. */
const WRITE_SETTLE_MS = 500

/**
 * Syncs pending-transaction notifications: once on mount, whenever the app
 * returns to foreground, whenever the notify/earlyReminderInSeconds
 * preferences change, and after any write that can change a pending
 * transaction. Runs never overlap, so a sync that starts mid-run repeats once
 * afterwards instead of racing the first.
 */
export function useNotificationSync(): void {
  useEffect(() => {
    let running = false
    let again = false
    let settleTimer: ReturnType<typeof setTimeout> | null = null

    const run = async (): Promise<void> => {
      if (running) {
        again = true
        return
      }
      running = true
      try {
        await synchronizePlannedTransactionNotifications()
      } catch (e) {
        logger.error("Notification sync failed", { error: String(e) })
      } finally {
        running = false
        if (again) {
          again = false
          run()
        }
      }
    }

    run()

    const writeSub = onWriteCommitted((name) => {
      if (!writeAffectsPendingTransactions(name)) return
      if (settleTimer) clearTimeout(settleTimer)
      settleTimer = setTimeout(run, WRITE_SETTLE_MS)
    })

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") run()
    })

    const storeSub = usePendingTransactionsStore.subscribe((s, prev) => {
      if (
        s.notify !== prev.notify ||
        s.earlyReminderInSeconds !== prev.earlyReminderInSeconds
      ) {
        run()
      }
    })

    return () => {
      if (settleTimer) clearTimeout(settleTimer)
      writeSub()
      appStateSub.remove()
      storeSub()
    }
  }, [])
}
