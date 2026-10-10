import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { notifyFormatChange } from "~/utils/notify-format-change"

/** "auto" follows the device's clock setting. */
export type ClockFormatPreference = "auto" | "12h" | "24h"

/**
 * How a day is written:
 * - full:        "Today" on relative days, otherwise "October 10"
 * - dateOnly:    "October 10" always
 * - numeric:     "Today" on relative days, otherwise "10/10/2026"
 * - numericOnly: "10/10/2026" always
 */
export type DateStylePreference =
  | "full"
  | "dateOnly"
  | "numeric"
  | "numericOnly"

/** Order of month / day / year. "default" follows the app language. */
export type DateOrderPreference = "default" | "mdy" | "dmy" | "ymd" | "ydm"

const calendarFormatStorage = createMMKV({
  id: "calendar-format-storage",
})

interface CalendarFormatStore {
  clockFormat: ClockFormatPreference
  dateStyle: DateStylePreference
  dateOrder: DateOrderPreference
  setClockFormat: (clockFormat: ClockFormatPreference) => void
  setDateStyle: (dateStyle: DateStylePreference) => void
  setDateOrder: (dateOrder: DateOrderPreference) => void
}

export const useCalendarFormatStore = create<CalendarFormatStore>()(
  persist(
    (set) => ({
      clockFormat: "auto",
      dateStyle: "full",
      dateOrder: "default",
      setClockFormat: (clockFormat) => {
        set({ clockFormat })
        notifyFormatChange()
      },
      setDateStyle: (dateStyle) => {
        set({ dateStyle })
        notifyFormatChange()
      },
      setDateOrder: (dateOrder) => {
        set({ dateOrder })
        notifyFormatChange()
      },
    }),
    {
      name: "calendar-format-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => calendarFormatStorage.getString(name) ?? null,
        setItem: (name, value) => calendarFormatStorage.set(name, value),
        removeItem: (name) => calendarFormatStorage.remove(name),
      })),
    },
  ),
)
