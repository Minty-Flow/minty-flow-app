import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const moneyFormattingStorage = createMMKV({
  id: "money-formatting-storage",
})

export const MoneyFormatEnum = {
  SYMBOL: "symbol",
  CODE: "code",
  NAME: "name",
} as const

export type MoneyFormatType =
  (typeof MoneyFormatEnum)[keyof typeof MoneyFormatEnum]

interface MoneyFormattingStore {
  /**
   * Currency assumed only when context provides none (Money component
   * fallback, empty-state placeholders, the first onboarding account, a
   * bill-splitter bill with no account). The app is multi-currency by
   * design — this is NOT a user-facing "primary currency".
   */
  fallbackCurrency: string
  /** How an amount renders: currency symbol, ISO code, or full name. */
  currencyDisplayFormat: MoneyFormatType

  // 1. THIS IS THE UI STATE (The eye toggle)
  privacyMode: boolean

  // 2. THIS IS THE SAVED SETTING (The startup preference)
  hideOnStartup: boolean

  // 3. Mask money when device is shaken
  maskOnShake: boolean

  setCurrency: (currency: string) => void
  setCurrencyDisplayFormat: (value: MoneyFormatType) => void

  // Controls the eye toggle (Session only)
  togglePrivacyMode: () => void

  // Set privacy mode directly (e.g. from shake detection)
  setPrivacyMode: (value: boolean) => void

  // Controls the persistent setting
  setHideOnStartup: (value: boolean) => void

  setMaskOnShake: (value: boolean) => void
}

export const useMoneyFormattingStore = create<MoneyFormattingStore>()(
  persist(
    (set) => ({
      fallbackCurrency: "USD",
      currencyDisplayFormat: MoneyFormatEnum.SYMBOL,

      // Default UI state
      privacyMode: false,

      // Default Startup preference
      hideOnStartup: false,

      maskOnShake: false,

      setCurrency: (currency) => set({ fallbackCurrency: currency }),
      setCurrencyDisplayFormat: (currencyDisplayFormat) =>
        set({ currencyDisplayFormat }),

      // The "Eye" toggle action: Just flips the UI state
      togglePrivacyMode: () =>
        set((state) => ({ privacyMode: !state.privacyMode })),

      // Set masked state directly (e.g. shake → mask)
      setPrivacyMode: (value) => set({ privacyMode: value }),

      // The "Settings" toggle action: Flips the preference
      setHideOnStartup: (value) => set({ hideOnStartup: value }),

      setMaskOnShake: (value) => set({ maskOnShake: value }),
    }),
    {
      name: "money-formatting-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => moneyFormattingStorage.getString(name) ?? null,
        setItem: (name, value) => moneyFormattingStorage.set(name, value),
        removeItem: (name) => moneyFormattingStorage.remove(name),
      })),

      /* THE MAGIC PART:
            As soon as the store rehydrates (synchronously with MMKV),
            we force 'privacyMode' to match 'hideOnStartup'.
        */
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.privacyMode = state.hideOnStartup
        }
      },

      // Optimization: We don't need to save 'privacyMode' to MMKV
      // since it's just a session-based UI toggle.
      partialize: (state) => ({
        fallbackCurrency: state.fallbackCurrency,
        currencyDisplayFormat: state.currencyDisplayFormat,
        hideOnStartup: state.hideOnStartup,
        maskOnShake: state.maskOnShake,
      }),
    },
  ),
)
