import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const PERSIST_NAME = "transfers-preferences-store"

/**
 * MMKV storage for transfer display preferences.
 */
const transfersPreferencesStorage = createMMKV({
  id: "transfers-preferences-storage",
})

export const TransferLayoutEnum = {
  COMBINE: "combine",
  SEPARATE: "separate",
} as const

export type TransferLayoutType =
  (typeof TransferLayoutEnum)[keyof typeof TransferLayoutEnum]

interface TransfersPreferences {
  /** How transfers are shown in lists: combined as one or separate in/out. */
  layout: TransferLayoutType
  /** Don't count transfers towards total expense/income. */
  excludeFromTotals: boolean
}

const DEFAULTS: TransfersPreferences = {
  layout: TransferLayoutEnum.COMBINE,
  excludeFromTotals: true,
}

interface TransfersPreferencesStore extends TransfersPreferences {
  setLayout: (value: TransferLayoutType) => void
  setExcludeFromTotals: (value: boolean) => void
}

export const useTransfersPreferencesStore = create<TransfersPreferencesStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setLayout: (value) => set({ layout: value }),
      setExcludeFromTotals: (value) => set({ excludeFromTotals: value }),
    }),
    {
      name: PERSIST_NAME,
      storage: createJSONStorage(() => ({
        getItem: (name) => transfersPreferencesStorage.getString(name) ?? null,
        setItem: (name, value) => transfersPreferencesStorage.set(name, value),
        removeItem: (name) => transfersPreferencesStorage.remove(name),
      })),
    },
  ),
)
