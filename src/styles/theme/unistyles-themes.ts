// ============================================================================
// Minty Theming System - Unistyles Configuration
// ============================================================================

/**
 * Unistyles configuration
 * Setup all themes for Unistyles
 */

import { ThemeFactory } from "./factory"
import { ALL_THEMES } from "./registry"
import type { UnistylesTheme } from "./types"

// Convert all MintyColorSchemes to Unistyles themes
export const unistylesThemes = Object.keys(ALL_THEMES).reduce(
  (acc, themeName) => {
    const factory = new ThemeFactory(ALL_THEMES[themeName])
    acc[themeName] = factory.buildTheme()
    return acc
  },
  {} as Record<string, UnistylesTheme>,
)
