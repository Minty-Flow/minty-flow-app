import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const developmentNoticeStorage = createMMKV({
  id: "development-notice-storage",
})

let developmentNoticeHiddenForSession = false

export function hideDevelopmentNoticeForSession() {
  developmentNoticeHiddenForSession = true
}

export function isDevelopmentNoticeHiddenForSession() {
  return developmentNoticeHiddenForSession
}

interface DevelopmentNoticeStore {
  dismissed: boolean
  dismiss: () => void
  reset: () => void
}

export const useDevelopmentNoticeStore = create<DevelopmentNoticeStore>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
      reset: () => {
        developmentNoticeHiddenForSession = false
        set({ dismissed: false })
      },
    }),
    {
      name: "development-notice-store",
      storage: mmkvJSONStorage(developmentNoticeStorage),
    },
  ),
)
