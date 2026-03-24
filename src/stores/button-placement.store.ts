import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type FabButtonType = "income" | "expense" | "transfer"

/**
 * order[0] = button type at FAB position 0 (center/top)
 * order[1] = button type at FAB position 1 (right)
 * order[2] = button type at FAB position 2 (left)
 */
export type ButtonPlacementOrder = [FabButtonType, FabButtonType, FabButtonType]

const DEFAULT_BUTTON_ORDER: ButtonPlacementOrder = [
  "income",
  "expense",
  "transfer",
]

const buttonPlacementStorage = createMMKV({
  id: "button-placement-storage",
})

interface ButtonPlacementStore {
  order: ButtonPlacementOrder
  setOrder: (order: ButtonPlacementOrder) => void
}

export const useButtonPlacementStore = create<ButtonPlacementStore>()(
  persist(
    (set) => ({
      order: DEFAULT_BUTTON_ORDER,
      setOrder: (order) => set({ order }),
    }),
    {
      name: "button-placement-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => buttonPlacementStorage.getString(name) ?? null,
        setItem: (name, value) => buttonPlacementStorage.set(name, value),
        removeItem: (name) => buttonPlacementStorage.remove(name),
      })),
    },
  ),
)
