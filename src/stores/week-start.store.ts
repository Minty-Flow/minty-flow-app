import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * "auto" follows the device region (which starts the week on Saturday in much
 * of the Arabic-speaking world, so it is not reducible to a Sunday/Monday flag).
 */
export type WeekStartPreference = "auto" | "saturday" | "sunday" | "monday"

const weekStartStorage = createMMKV({
  id: "week-start-storage",
})

interface WeekStartStore {
  weekStart: WeekStartPreference
  setWeekStart: (weekStart: WeekStartPreference) => void
}

export const useWeekStartStore = create<WeekStartStore>()(
  persist(
    (set) => ({
      weekStart: "auto",
      setWeekStart: (weekStart) => {
        set({ weekStart })
      },
    }),
    {
      name: "week-start-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => weekStartStorage.getString(name) ?? null,
        setItem: (name, value) => weekStartStorage.set(name, value),
        removeItem: (name) => weekStartStorage.remove(name),
      })),
    },
  ),
)
