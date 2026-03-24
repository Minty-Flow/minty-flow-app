import * as LocalAuthentication from "expo-local-authentication"
import { AppState } from "react-native"
import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { AppData } from "~/constants/app-data"
import { logger } from "~/utils/logger"

// Module-level guard: register the AppState listener only once across all rehydrations
// (onRehydrateStorage can fire multiple times in development with Fast Refresh).
let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
  null

const APP_LOCK_STORE_KEY = "app-lock-store"
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
  persist(
    (set, get) => ({
      lockAppEnabled: false,
      lockAfterClosing: false,
      // C6: default to locked so a corrupt/missing MMKV entry never bypasses the gate.
      // onRehydrateStorage explicitly unlocks when lockAppEnabled is false.
      isLocked: true,
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
        } catch (e) {
          // H-S5: surface auth errors so the user isn't silently stuck locked
          logger.error("[AppLock] authenticateAsync threw", {
            error: String(e),
          })
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
      // C6: unlock eagerly only when the feature is off; otherwise trigger biometric auth.
      onRehydrateStorage: () => (state) => {
        if (state && !state.lockAppEnabled) {
          // Lock is disabled — safe to unlock immediately without a challenge
          state.isLocked = false
        } else if (state?.lockAppEnabled) {
          // Lock is enabled — keep isLocked=true and prompt auth
          setTimeout(() => {
            useAppLockStore.getState().attemptUnlock()
          }, 0)
        }

        // C8: register the AppState listener only once to prevent duplicate handlers
        // accumulating across Fast Refresh cycles in development.
        if (!appStateSubscription) {
          appStateSubscription = AppState.addEventListener(
            "change",
            (nextState) => {
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
                attemptUnlock()
              }
            },
          )
        }
      },
    },
  ),
)
