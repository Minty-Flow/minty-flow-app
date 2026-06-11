import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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
}

/**
 * Zustand store for notification settings.
 */
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      isDailyReminderEnabled: false,
      dailyReminderTime: "20:22",

      setDailyReminderEnabled: (enabled) =>
        set({ isDailyReminderEnabled: enabled }),
      setDailyReminderTime: (time) => set({ dailyReminderTime: time }),
    }),
    {
      name: "notification-preferences-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => notificationStorage.getString(name) ?? null,
        setItem: (name, value) => notificationStorage.set(name, value),
        removeItem: (name) => notificationStorage.remove(name),
      })),
    },
  ),
)
