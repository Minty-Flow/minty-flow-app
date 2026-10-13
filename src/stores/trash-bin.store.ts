import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  DEFAULT_TRASH_RETENTION,
  type TrashRetentionValue,
} from "~/constants/trash-retention"
import { mmkvJSONStorage } from "~/utils/mmkv-storage"

/**
 * MMKV storage instance for trash bin.
 */
const trashBinStorage = createMMKV({
  id: "trash-bin-storage",
})

/**
 * trash bin store interface.
 */
interface trashBinStore {
  retentionPeriod: TrashRetentionValue
  setRetentionPeriod: (value: TrashRetentionValue) => void
}

/**
 * Zustand store for trash bin.
 */
export const useTrashBinStore = create<trashBinStore>()(
  persist(
    (set) => ({
      /* ───────── State ───────── */
      retentionPeriod: DEFAULT_TRASH_RETENTION,

      /* ───────── Actions ───────── */
      setRetentionPeriod: (value) => set({ retentionPeriod: value }),
    }),
    {
      name: "trash-bin-store",
      storage: mmkvJSONStorage(trashBinStorage),
    },
  ),
)
