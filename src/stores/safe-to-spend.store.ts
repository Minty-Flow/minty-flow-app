import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { SafeToSpendCadence } from "~/utils/safe-to-spend"

const storage = createMMKV({ id: "safe-to-spend-storage" })

interface SafeToSpendStore {
  /** Shown on Home when true. */
  enabled: boolean
  cadence: SafeToSpendCadence
  /** Empty means "every account that counts toward balance". */
  includedAccountIds: string[]
  /** Subtract planned goal top-ups from the figure. */
  includeGoals: boolean
  setEnabled: (enabled: boolean) => void
  setCadence: (cadence: SafeToSpendCadence) => void
  setIncludedAccountIds: (ids: string[]) => void
  toggleAccount: (id: string) => void
  setIncludeGoals: (includeGoals: boolean) => void
}

export const useSafeToSpendStore = create<SafeToSpendStore>()(
  persist(
    (set) => ({
      enabled: true,
      cadence: "daily",
      includedAccountIds: [],
      includeGoals: false,
      setEnabled: (enabled) => set({ enabled }),
      setCadence: (cadence) => set({ cadence }),
      setIncludedAccountIds: (includedAccountIds) =>
        set({ includedAccountIds }),
      toggleAccount: (id) =>
        set((s) => ({
          includedAccountIds: s.includedAccountIds.includes(id)
            ? s.includedAccountIds.filter((x) => x !== id)
            : [...s.includedAccountIds, id],
        })),
      setIncludeGoals: (includeGoals) => set({ includeGoals }),
    }),
    {
      name: "safe-to-spend-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) ?? null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      })),
    },
  ),
)
