import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const transactionItemAppearanceStorage = createMMKV({
  id: "transaction-item-appearance-storage",
})

type TransactionItemVariant = "compact" | "elevated"

type LeadingIcon = "category" | "account"

interface TransactionItemAppearanceStore {
  variant: TransactionItemVariant
  leadingIcon: LeadingIcon
  showCategory: boolean
  /**
   * When a transaction has no title, show the literal "Untitled" label instead
   * of the category name. Default `false` — a blank title shows its category.
   */
  showUntitledForBlankTitle: boolean
  setVariant: (value: TransactionItemVariant) => void
  setShowCategory: (value: boolean) => void
  setShowUntitledForBlankTitle: (value: boolean) => void
  setLeadingIcon: (value: LeadingIcon) => void
}

export const useTransactionItemAppearanceStore =
  create<TransactionItemAppearanceStore>()(
    persist(
      (set) => ({
        variant: "compact",
        showCategory: false,
        showUntitledForBlankTitle: false,
        leadingIcon: "category",
        setVariant: (value: TransactionItemVariant) => {
          set({ variant: value })
        },
        setShowCategory: (value: boolean) => {
          set({ showCategory: value })
        },
        setShowUntitledForBlankTitle: (value: boolean) => {
          set({ showUntitledForBlankTitle: value })
        },
        setLeadingIcon: (value: LeadingIcon) => {
          set({ leadingIcon: value })
        },
      }),
      {
        name: "transaction-item-appearance-store",
        // v1: `showCategoryForUntitled` (show category *for* untitled) inverted
        // into `showUntitledForBlankTitle`. Carry each user's visible behaviour:
        // old `false` (was showing "Untitled") -> new `true`.
        version: 1,
        migrate: (persisted, version) => {
          const state = (persisted ??
            {}) as Partial<TransactionItemAppearanceStore> & {
            showCategoryForUntitled?: boolean
          }
          if (version < 1) {
            const previous = state.showCategoryForUntitled
            return {
              ...state,
              showUntitledForBlankTitle:
                typeof previous === "boolean" ? !previous : false,
            }
          }
          return state
        },
        storage: createJSONStorage(() => ({
          getItem: (name) =>
            transactionItemAppearanceStorage.getString(name) ?? null,
          setItem: (name, value) =>
            transactionItemAppearanceStorage.set(name, value),
          removeItem: (name) => transactionItemAppearanceStorage.remove(name),
        })),
      },
    ),
  )
