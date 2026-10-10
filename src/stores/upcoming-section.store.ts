import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const UPCOMING_SECTION_STORE_KEY = "upcoming-section-store"
const UPCOMING_SECTION_MMKV_KEY = "upcoming-section-storage"

const upcomingSectionStorage = createMMKV({
  id: UPCOMING_SECTION_MMKV_KEY,
})

interface UpcomingSectionStore {
  collapsed: boolean
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void
}

export const useUpcomingSectionStore = create<UpcomingSectionStore>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) => {
        set((state) => ({
          collapsed:
            typeof value === "function" ? value(state.collapsed) : value,
        }))
      },
    }),
    {
      name: UPCOMING_SECTION_STORE_KEY,
      storage: mmkvJSONStorage(upcomingSectionStorage),
    },
  ),
)
