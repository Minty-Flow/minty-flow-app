import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const whatsNewStorage = createMMKV({ id: "whats-new-storage" })

/**
 * Which "New" badges the user has already followed. Delete this store and the
 * badges that read it once the feature has been out for a release.
 */
interface WhatsNewStore {
  homeScreenSeen: boolean
  markHomeScreenSeen: () => void
}

export const useWhatsNewStore = create<WhatsNewStore>()(
  persist(
    (set) => ({
      homeScreenSeen: false,
      markHomeScreenSeen: () => set({ homeScreenSeen: true }),
    }),
    { name: "whats-new-store", storage: mmkvJSONStorage(whatsNewStorage) },
  ),
)
