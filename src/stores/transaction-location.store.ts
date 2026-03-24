import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * MMKV storage instance for transaction location preferences.
 */
const transactionLocationStorage = createMMKV({
  id: "transaction-location-preferences-storage",
})

/**
 * Transaction location store interface.
 */
interface TransactionLocationStore {
  isEnabled: boolean
  autoAttach: boolean
  setIsEnabled: (enabled: boolean) => void
  setAutoAttach: (enabled: boolean) => void
}

/**
 * Zustand store for transaction location settings.
 */
export const useTransactionLocationStore = create<TransactionLocationStore>()(
  persist(
    (set) => ({
      isEnabled: false,
      autoAttach: false,

      setIsEnabled: (enabled) => set({ isEnabled: enabled }),
      setAutoAttach: (enabled) => set({ autoAttach: enabled }),
    }),
    {
      name: "transaction-location-preferences-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => transactionLocationStorage.getString(name) ?? null,
        setItem: (name, value) => transactionLocationStorage.set(name, value),
        removeItem: (name) => transactionLocationStorage.remove(name),
      })),
    },
  ),
)
