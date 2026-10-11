import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

/**
 * MMKV storage for pending transaction preferences.
 * Namespace: flow.pendingTransactions (via store name).
 */
const pendingTransactionsStorage = createMMKV({
  id: "pending-transactions-storage",
})

interface PendingTransactionsPreferences {
  /** Auto-confirm `subscription` recurring instances once their date passes. */
  autoPaySubscriptions: boolean
  /** Auto-confirm `repetitive` recurring instances once their date passes. */
  autoPayRepetitive: boolean
  /** Auto-confirm user-created `upcoming` transactions once their date passes. Off = confirm each via Mark paid. */
  autoPayUpcoming: boolean
  /** Number of days of planned transactions to show in home/list. */
  homeTimeframe: number
  /** When user confirms, set transactionDate to current time; if false, keep original date. */
  updateDateUponConfirmation: boolean
  /** Schedule local notifications at planned time (and optionally early).
   * Consumed by `synchronizePlannedTransactionNotifications` (pending-transaction-notifications.ts)
   * via `useNotificationSync`. */
  notify: boolean
  /** Seconds before transactionDate to fire an early reminder (default 86400 = 1 day).
   * Consumed alongside `notify` by `synchronizePlannedTransactionNotifications`. */
  earlyReminderInSeconds: number
}

const DEFAULTS: PendingTransactionsPreferences = {
  autoPaySubscriptions: true,
  autoPayRepetitive: true,
  autoPayUpcoming: false,
  homeTimeframe: 3,
  updateDateUponConfirmation: false,
  notify: false,
  earlyReminderInSeconds: 86400,
}

interface PendingTransactionsStore extends PendingTransactionsPreferences {
  isHydrated: boolean
  setAutoPaySubscriptions: (value: boolean) => void
  setAutoPayRepetitive: (value: boolean) => void
  setAutoPayUpcoming: (value: boolean) => void
  setHomeTimeframe: (value: number) => void
  setUpdateDateUponConfirmation: (value: boolean) => void
  setNotify: (value: boolean) => void
  setEarlyReminderInSeconds: (value: number) => void
}

export const usePendingTransactionsStore = create<PendingTransactionsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      isHydrated: false,

      setAutoPaySubscriptions: (value) => set({ autoPaySubscriptions: value }),
      setAutoPayRepetitive: (value) => set({ autoPayRepetitive: value }),
      setAutoPayUpcoming: (value) => set({ autoPayUpcoming: value }),
      setHomeTimeframe: (value) => set({ homeTimeframe: value }),
      setUpdateDateUponConfirmation: (value) =>
        set({ updateDateUponConfirmation: value }),
      setNotify: (value) => set({ notify: value }),
      setEarlyReminderInSeconds: (value) =>
        set({ earlyReminderInSeconds: value }),
    }),
    {
      name: "pending-transactions-store",
      storage: mmkvJSONStorage(pendingTransactionsStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Direct mutation is intentional: MMKV storage is synchronous, so hydration
          // completes during create() before any React render. The state object here is
          // the same reference held by the store, so the mutation is visible immediately
          // without needing a set() call.
          state.isHydrated = true
        }
      },
    },
  ),
)
