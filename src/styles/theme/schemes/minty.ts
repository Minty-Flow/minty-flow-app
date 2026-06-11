// ============================================================================
// Minty Theming System - Minty Dark / Minty Light / Minty OLED Schemes
// Only primary (dark/OLED) or primary+secondary+onSecondary (light) vary
// ============================================================================

import {
  DEFAULT_DARK_BASE,
  DEFAULT_LIGHT_BASE,
  DEFAULT_OLED_BASE,
} from "../base"
import { MINTY_DARK_PRIMARY_COLORS, MINTY_LIGHT_COLORS } from "../colors"
import type { MintyColorScheme } from "../types"
import { copyWith } from "../utils"

/**
 * Minty Dark — 16 variants (Minty Dark theme group)
 * Surface #141414, secondary #050505; only primary changes
 */
export const mintyDarkSchemes: MintyColorScheme[] =
  MINTY_DARK_PRIMARY_COLORS.map((primary, index) =>
    copyWith(DEFAULT_DARK_BASE, {
      name: MINTY_LIGHT_COLORS[index].darkThemeName,
      iconName: MINTY_LIGHT_COLORS[index].lightThemeName,
      primary,
    }),
  )

/**
 * Minty Light — 16 variants
 * Primary, secondary, and onSecondary from MINTY_LIGHT_COLORS
 */
export const mintyLightSchemes: MintyColorScheme[] = MINTY_LIGHT_COLORS.map(
  (entry) =>
    copyWith(DEFAULT_LIGHT_BASE, {
      name: entry.lightThemeName,
      iconName: entry.lightThemeName,
      primary: entry.primary,
      secondary: entry.secondary,
      onSecondary: entry.onSecondary,
    }),
)

/**
 * Minty OLED — 16 variants (true black surface #000000, secondary #101010)
 * Same primary list as Minty Dark; name suffix "Oled"
 */
export const mintyOledSchemes: MintyColorScheme[] =
  MINTY_DARK_PRIMARY_COLORS.map((primary, index) =>
    copyWith(DEFAULT_OLED_BASE, {
      name: `${MINTY_LIGHT_COLORS[index].darkThemeName}Oled`,
      iconName: MINTY_LIGHT_COLORS[index].lightThemeName,
      primary,
    }),
  )
