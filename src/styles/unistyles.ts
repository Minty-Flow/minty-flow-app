import { StyleSheet } from "react-native-unistyles"

import { DEFAULT_THEME, getStoredTheme } from "~/stores/theme.store"

import { breakpoints } from "./breakpoints"
import { ALL_THEMES } from "./theme/registry"
import { unistylesThemes } from "./theme/unistyles-themes"

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof unistylesThemes

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Export ThemeKey type for backward compatibility
export type ThemeKey = keyof typeof ALL_THEMES

StyleSheet.configure({
  settings: {
    initialTheme: () => getStoredTheme(ALL_THEMES) ?? DEFAULT_THEME,
  },
  themes: unistylesThemes,
  breakpoints,
})
