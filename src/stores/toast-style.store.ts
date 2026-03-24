import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ToastPosition } from "./toast.store"

/**
 * MMKV storage instance for toast style preferences.
 *
 * This instance is optimized for storing toast style settings with high performance.
 * MMKV is ~30x faster than AsyncStorage and provides synchronous operations.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
const toastStyleStorage = createMMKV({
  id: "toast-style-storage",
})

/**
 * Toast style store interface defining default toast settings.
 */
interface ToastStyleStore {
  /** Default position for toasts */
  position: ToastPosition
  /** Whether to show progress bar by default */
  showProgressBar: boolean
  /** Whether to show close icon by default */
  showCloseIcon: boolean
  /**
   * Sets the default toast position.
   * @param position - The position to set ("top" or "bottom")
   */
  setPosition: (position: ToastPosition) => void
  /**
   * Sets the default progress bar visibility.
   * @param show - Whether to show the progress bar
   */
  setShowProgressBar: (show: boolean) => void
  /**
   * Sets the default close icon visibility.
   * @param show - Whether to show the close icon
   */
  setShowCloseIcon: (show: boolean) => void
  /**
   * Resets all toast style settings to their default values.
   */
  resetToDefaults: () => void
}

/**
 * Zustand store hook for managing toast style preferences.
 *
 * This store is persisted to MMKV storage, providing fast and reliable
 * persistence of toast style preferences across app sessions.
 *
 * These settings serve as global defaults for all toasts unless explicitly
 * overridden when showing a specific toast.
 *
 * @example
 * ```tsx
 * const { position, showProgressBar, setPosition } = useToastStyleStore()
 *
 * // Set default position to bottom
 * setPosition("bottom")
 *
 * // Enable progress bar by default
 * setShowProgressBar(true)
 * ```
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useToastStyleStore = create<ToastStyleStore>()(
  persist(
    (set) => ({
      // Default state
      position: "top",
      showProgressBar: false,
      showCloseIcon: true,

      // Actions
      setPosition: (position) => set({ position }),
      setShowProgressBar: (show) => set({ showProgressBar: show }),
      setShowCloseIcon: (show) => set({ showCloseIcon: show }),
      resetToDefaults: () =>
        set({
          position: "top",
          showProgressBar: false,
          showCloseIcon: true,
        }),
    }),
    {
      name: "toast-style-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => toastStyleStorage.getString(name) ?? null,
        setItem: (name, value) => toastStyleStorage.set(name, value),
        removeItem: (name) => toastStyleStorage.remove(name),
      })),
    },
  ),
)
