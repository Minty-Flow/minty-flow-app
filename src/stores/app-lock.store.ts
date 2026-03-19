import * as LocalAuthentication from "expo-local-authentication"
import { AppState } from "react-native"
import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { AppData } from "~/constants/app-data"

const APP_LOCK_STORE_KEY = "app-lock-preferences"
const APP_LOCK_MMKV_KEY = "app-lock-storage"

const PROMPT_MESSAGE = `Unlock ${AppData.name}.`

const appLockStorage = createMMKV({ id: APP_LOCK_MMKV_KEY })

interface AppLockStore {
  lockAppEnabled: boolean
  lockAfterClosing: boolean
  isLocked: boolean
  isAuthenticating: boolean

  setLockAppEnabled: (value: boolean) => void
  setLockAfterClosing: (value: boolean) => void
  lock: () => void
  unlock: () => void
  attemptUnlock: () => Promise<void>
}

export const useAppLockStore = create<AppLockStore>()(
  devtools(
    persist(
      (set, get) => ({
        lockAppEnabled: false,
        lockAfterClosing: false,
        isLocked: false,
        isAuthenticating: false,

        setLockAppEnabled: (value) => set({ lockAppEnabled: value }),
        setLockAfterClosing: (value) => set({ lockAfterClosing: value }),
        lock: () => set({ isLocked: true }),
        unlock: () => set({ isLocked: false }),

        attemptUnlock: async () => {
          if (get().isAuthenticating) return
          set({ isAuthenticating: true })
          try {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: PROMPT_MESSAGE,
            })
            if (result.success) get().unlock()
          } finally {
            set({ isAuthenticating: false })
          }
        },
      }),
      {
        name: APP_LOCK_STORE_KEY,
        storage: createJSONStorage(() => ({
          getItem: (name) => appLockStorage.getString(name) ?? null,
          setItem: (name, value) => appLockStorage.set(name, value),
          removeItem: (name) => appLockStorage.remove(name),
        })),
        partialize: (state) => ({
          lockAppEnabled: state.lockAppEnabled,
          lockAfterClosing: state.lockAfterClosing,
        }),
        // Cold start: lock immediately on rehydration if enabled
        onRehydrateStorage: () => (state) => {
          if (state?.lockAppEnabled) {
            state.isLocked = true
            // Trigger auth immediately on cold start — setTimeout lets the store finish init first
            setTimeout(() => {
              useAppLockStore.getState().attemptUnlock()
            }, 0)
          }

          AppState.addEventListener("change", (nextState) => {
            const {
              lockAppEnabled,
              lockAfterClosing,
              isLocked,
              lock,
              attemptUnlock,
            } = useAppLockStore.getState()

            if (
              nextState === "background" &&
              lockAppEnabled &&
              lockAfterClosing
            ) {
              lock()
            }

            if (nextState === "active" && lockAppEnabled && isLocked) {
              attemptUnlock() // this handles returning from background
            }
          })
        },
      },
    ),
    { name: "app-lock-store-dev" },
  ),
)
