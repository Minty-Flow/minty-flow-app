import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"
import { normalizeItemName } from "~/utils/string-utils"

const hiddenRecentItemsStorage = createMMKV({
  id: "hidden-recent-items-storage",
})

/**
 * Item names the user hid from the "Recent" chips, per currency. Recents come
 * from transaction history, so hiding is the only way to drop one without
 * touching past transactions. Typing the name again brings it back.
 */
interface HiddenRecentItemsStore {
  /** Currency code → normalized item names. */
  hidden: Record<string, string[]>
  hide: (currencyCode: string, name: string) => void
  unhide: (currencyCode: string, name: string) => void
}

export const useHiddenRecentItemsStore = create<HiddenRecentItemsStore>()(
  persist(
    (set) => ({
      hidden: {},
      hide: (currencyCode, name) =>
        set((state) => {
          const key = normalizeItemName(name)
          const list = state.hidden[currencyCode] ?? []
          if (list.includes(key)) return state
          return { hidden: { ...state.hidden, [currencyCode]: [...list, key] } }
        }),
      unhide: (currencyCode, name) =>
        set((state) => {
          const key = normalizeItemName(name)
          const list = state.hidden[currencyCode] ?? []
          if (!list.includes(key)) return state
          return {
            hidden: {
              ...state.hidden,
              [currencyCode]: list.filter((n) => n !== key),
            },
          }
        }),
    }),
    {
      name: "hidden-recent-items-store",
      storage: mmkvJSONStorage(hiddenRecentItemsStorage),
    },
  ),
)
