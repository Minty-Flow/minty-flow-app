import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

/**
 * MMKV storage instance for notification preferences.
 */
const notificationStorage = createMMKV({
  id: "notification-preferences-storage",
})

/**
 * Notification store interface.
 */
interface NotificationStore {
  isDailyReminderEnabled: boolean
  dailyReminderTime: string // Format: "HH:mm"
  setDailyReminderEnabled: (enabled: boolean) => void
  setDailyReminderTime: (time: string) => void
  /** Warn when a budget is on pace to exceed its limit. */
  isPaceAlertEnabled: boolean
  /** Headroom over the limit before a pace warning: 0.1 = 10%. */
  paceSensitivity: number
  setPaceAlertEnabled: (enabled: boolean) => void
  setPaceSensitivity: (value: number) => void
}

/**
 * Zustand store for notification settings.
 */
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      isDailyReminderEnabled: false,
      dailyReminderTime: "20:22",
      isPaceAlertEnabled: true,
      paceSensitivity: 0.1,

      setDailyReminderEnabled: (enabled) =>
        set({ isDailyReminderEnabled: enabled }),
      setDailyReminderTime: (time) => set({ dailyReminderTime: time }),
      setPaceAlertEnabled: (enabled) => set({ isPaceAlertEnabled: enabled }),
      setPaceSensitivity: (value) => set({ paceSensitivity: value }),
    }),
    {
      name: "notification-preferences-store",
      storage: mmkvJSONStorage(notificationStorage),
    },
  ),
)
