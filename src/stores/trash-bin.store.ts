import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * MMKV storage instance for trash bin.
 */
const trashBinStorage = createMMKV({
  id: "trash-bin-storage",
})

// Retention period choices
const RetentionPeriodEnum = {
  ONE_DAY: "1 day",
  SEVEN_DAYS: "7 days",
  FOURTEEN_DAYS: "14 days",
  THIRTY_DAYS: "30 days",
  NINETY_DAYS: "90 days",
  ONE_EIGHTY_DAYS: "180 days",
  THREE_SIXTY_FIVE_DAYS: "365 days",
  FOREVER: "forever",
} as const

// Retention period type
type RetentionPeriodType =
  (typeof RetentionPeriodEnum)[keyof typeof RetentionPeriodEnum]

/**
 * trash bin store interface.
 */
interface trashBinStore {
  retentionPeriod: RetentionPeriodType
  setRetentionPeriod: (value: RetentionPeriodType) => void
}

/**
 * Zustand store for trash bin.
 */
export const useTrashBinStore = create<trashBinStore>()(
  persist(
    (set) => ({
      /* ───────── State ───────── */
      retentionPeriod: RetentionPeriodEnum.SEVEN_DAYS,

      /* ───────── Actions ───────── */
      setRetentionPeriod: (value) => set({ retentionPeriod: value }),
    }),
    {
      name: "trash-bin-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => trashBinStorage.getString(name) ?? null,
        setItem: (name, value) => trashBinStorage.set(name, value),
        removeItem: (name) => trashBinStorage.remove(name),
      })),
    },
  ),
)
