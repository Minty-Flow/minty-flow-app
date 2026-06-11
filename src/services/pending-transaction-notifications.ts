import * as Notifications from "expo-notifications"

import { getPendingTransactions } from "~/database/repos/transaction-repo"
import type { RowTransaction } from "~/database/types/rows"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { startOfNextMinute } from "~/utils/pending-transactions"

/**
 * Payload type for transaction reminder notifications.
 * Use itemType: "txn" and id: transaction.id (or uuid when available).
 */
interface TransactionReminderPayload {
  itemType: "txn"
  id: string
  [key: string]: unknown
}

/**
 * Clear all scheduled notifications of type "transaction".
 */
async function clearPlannedTransactionNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync()
  const txnNotifs = scheduled.filter(
    (n) =>
      (n.content.data as TransactionReminderPayload | undefined)?.itemType ===
      "txn",
  )
  await Promise.all(
    txnNotifs.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  )
}

/**
 * Schedule a single notification at transactionDate and optionally at
 * transactionDate - earlyReminderSeconds.
 */
async function scheduleForPlannedTransaction(
  transaction: RowTransaction,
  earlyReminderSeconds: number,
): Promise<void> {
  const now = Date.now()
  const transactionDate = new Date(transaction.transaction_date)
  const dueMs = transactionDate.getTime()
  const title = transaction.title || "Pending Transaction"
  const data: TransactionReminderPayload = {
    itemType: "txn",
    id: transaction.id,
  }

  if (dueMs > now) {
    await Notifications.scheduleNotificationAsync({
      identifier: `txn-${transaction.id}`,
      content: {
        title,
        body: "Your planned transaction is due now.",
        data,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: transactionDate,
      },
    })
  }

  const earlyMs = dueMs - earlyReminderSeconds * 1000
  if (earlyReminderSeconds >= 60 && earlyMs > now) {
    await Notifications.scheduleNotificationAsync({
      identifier: `txn-early-${transaction.id}`,
      content: {
        title: `Upcoming: ${title}`,
        body: "You have a planned transaction coming up.",
        data,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(earlyMs),
      },
    })
  }
}

/**
 * Resync all planned-transaction notifications:
 * - Clear existing transaction reminders
 * - If notify preference is true, query pending transactions and schedule each (skip if transactionDate in the past).
 * Call after: app startup/foreground, preference changes, add/edit/delete of pending transactions.
 */
export async function synchronizePlannedTransactionNotifications(): Promise<void> {
  await clearPlannedTransactionNotifications()

  const notify = usePendingTransactionsStore.getState().notify
  if (!notify) return

  const earlyReminderInSeconds =
    usePendingTransactionsStore.getState().earlyReminderInSeconds
  const pending = await getPendingTransactions()
  const now = startOfNextMinute()

  for (const t of pending) {
    if (new Date(t.transaction_date).getTime() <= now.getTime()) continue
    await scheduleForPlannedTransaction(t, earlyReminderInSeconds)
  }
}
