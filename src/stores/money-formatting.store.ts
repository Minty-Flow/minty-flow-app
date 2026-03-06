import { Accelerometer } from "expo-sensors"
import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

// was 100 and 150
const SHAKE_UPDATE_INTERVAL_MS = 500
const SHAKE_THRESHOLD = 550

export const moneyFormattingStorage = createMMKV({
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
  preferredCurrency: string
  currencyLook: MoneyFormatType

  // 1. THIS IS THE UI STATE (The eye toggle)
  privacyMode: boolean

  // 2. THIS IS THE SAVED SETTING (The startup preference)
  hideOnStartup: boolean

  // 3. Mask money when device is shaken
  maskOnShake: boolean

  setCurrency: (currency: string) => void
  setCurrencyLook: (value: MoneyFormatType) => void

  // Controls the eye toggle (Session only)
  togglePrivacyMode: () => void

  // Set privacy mode directly (e.g. from shake detection)
  setPrivacyMode: (value: boolean) => void

  // Controls the persistent setting
  setHideOnStartup: (value: boolean) => void

  setMaskOnShake: (value: boolean) => void

  /** Internal: sensor subscription, not persisted */
  _shakeSubscription: { remove: () => void } | null
  _startShakeListener: () => void
  _stopShakeListener: () => void
}

export const useMoneyFormattingStore = create<MoneyFormattingStore>()(
  devtools(
    persist(
      (set, get) => ({
        preferredCurrency: "USD",
        currencyLook: MoneyFormatEnum.SYMBOL,

        // Default UI state
        privacyMode: false,

        // Default Startup preference
        hideOnStartup: false,

        maskOnShake: false,

        _shakeSubscription: null,

        setCurrency: (currency) => set({ preferredCurrency: currency }),
        setCurrencyLook: (currencyLook) => set({ currencyLook }),

        // The "Eye" toggle action: Just flips the UI state
        togglePrivacyMode: () =>
          set((state) => ({ privacyMode: !state.privacyMode })),

        // Set masked state directly (e.g. shake → mask)
        setPrivacyMode: (value) => set({ privacyMode: value }),

        // The "Settings" toggle action: Flips the preference
        setHideOnStartup: (value) => set({ hideOnStartup: value }),

        setMaskOnShake: (value) => {
          set({ maskOnShake: value })
          if (value) {
            get()._startShakeListener()
          } else {
            get()._stopShakeListener()
          }
        },

        _startShakeListener: () => {
          get()._stopShakeListener()
          Accelerometer.setUpdateInterval(SHAKE_UPDATE_INTERVAL_MS)

          let lastX = 0
          let lastY = 0
          let lastZ = 0
          let lastUpdate = 0

          const sub = Accelerometer.addListener(({ x, y, z }) => {
            const now = Date.now()
            const timeDelta = now - lastUpdate

            if (timeDelta > SHAKE_UPDATE_INTERVAL_MS) {
              const speed =
                (Math.abs(x + y + z - lastX - lastY - lastZ) / timeDelta) *
                10000
              if (speed > SHAKE_THRESHOLD) {
                get().setPrivacyMode(true)
              }
              lastUpdate = now
              lastX = x
              lastY = y
              lastZ = z
            }
          })

          set({ _shakeSubscription: sub })
        },

        _stopShakeListener: () => {
          get()._shakeSubscription?.remove()
          set({ _shakeSubscription: null })
        },
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
          preferredCurrency: state.preferredCurrency,
          currencyLook: state.currencyLook,
          hideOnStartup: state.hideOnStartup,
          maskOnShake: state.maskOnShake,
        }),
      },
    ),
    { name: "money-formatting-store-dev" },
  ),
)
