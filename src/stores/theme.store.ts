import { createMMKV } from "react-native-mmkv"
import { UnistylesRuntime } from "react-native-unistyles"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ThemeKey } from "~/styles/unistyles"

export const DEFAULT_THEME = "coastalTrim"
export const THEME_PERSIST_STORE_KEY = "theme-preferences-store"
const THEME_PERSIST_MMKV_KEY = "theme-preferences-storage"

/**
 * MMKV storage instance for theme preferences.
 *
 * This instance is optimized for storing theme-related settings with high performance.
 * MMKV is ~30x faster than AsyncStorage and provides synchronous operations.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
export const themeStorage = createMMKV({
  id: THEME_PERSIST_MMKV_KEY,
})

/**
 * Theme preference type - can be device adaptive, or a specific theme
 */
export type ThemeMode = ThemeKey

/**
 * Theme store interface defining the shape of the theme state and actions.
 */
interface ThemeStore {
  /** The user's preferred theme mode */
  themeMode: ThemeMode
  /**
   * Sets the theme mode.
   * @param mode - The theme mode to set ("device", or a specific theme)
   */
  setThemeMode: (mode: ThemeMode) => void
}

/**
 * Zustand store hook for managing theme preferences.
 *
 * This store is persisted to MMKV storage, providing fast and reliable
 * persistence of user theme preferences across app sessions.
 *
 * @example
 * ```tsx
 * const { themeMode, setThemeMode } = useThemeStore()
 *
 * // Set to device adaptive
 * setThemeMode("device")
 *
 * // Set to light mode
 * setThemeMode("light")
 *
 * // Set to dark mode
 * setThemeMode("dark")
 * ```
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // Default to first dark theme (electricLavender)
      themeMode: DEFAULT_THEME,

      // Actions
      setThemeMode: (mode) => {
        set({ themeMode: mode })

        // Update UnistylesRuntime and native chrome when theme mode changes
        UnistylesRuntime.setTheme(mode)
      },
    }),
    {
      name: THEME_PERSIST_STORE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => themeStorage.getString(name) ?? null,
        setItem: (name, value) => themeStorage.set(name, value),
        removeItem: (name) => themeStorage.remove(name),
      })),
      onRehydrateStorage: () => (state) => {
        // Sync UnistylesRuntime and native chrome when store hydrates on app start
        if (state?.themeMode) {
          UnistylesRuntime.setTheme(state.themeMode)
        }
      },
    },
  ),
)
