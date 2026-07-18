import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { emit } from "~/database/events"

/**
 * "auto" follows the device region (which starts the week on Saturday in much
 * of the Arabic-speaking world, so it is not reducible to a Sunday/Monday flag).
 */
export type WeekStartPreference = "auto" | "sunday" | "monday"

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
        // Week-derived aggregates (stats buckets, weekly budgets) are cached and
        // only recomputed on dirty events — without this the switch looks inert.
        // Costly for a display preference: this reloads the whole transaction
        // cache and recomputes every account balance from SQLite. Acceptable
        // because the setting changes about once per install.
        emit("transactions:dirty", {})
        emit("budgets:dirty", undefined)
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
