import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const developmentNoticeStorage = createMMKV({
  id: "development-notice-storage",
})

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
      reset: () => set({ dismissed: false }),
    }),
    {
      name: "development-notice-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => developmentNoticeStorage.getString(name) ?? null,
        setItem: (name, value) => developmentNoticeStorage.set(name, value),
        removeItem: (name) => developmentNoticeStorage.remove(name),
      })),
    },
  ),
)
