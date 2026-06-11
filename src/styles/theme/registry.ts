// ============================================================================
// Minty Theming System - Theme Registry
// ============================================================================

import {
  catppuccinFrappeSchemes,
  catppuccinMacchiatoSchemes,
  catppuccinMochaSchemes,
} from "./schemes/catppuccin"
import {
  mintyDarkSchemes,
  mintyLightSchemes,
  mintyOledSchemes,
} from "./schemes/minty"
import { monochrome, nord, palenight } from "./schemes/standalone"
import type { MintyColorScheme, ThemeGroup } from "./types"

/**
 * Theme groups for organized UI display
 */
const mintyLights: ThemeGroup = {
  name: "Minty Light",
  icon: "sun",
  schemes: mintyLightSchemes,
}

const mintyDarks: ThemeGroup = {
  name: "Minty Dark",
  icon: "moon",
  schemes: mintyDarkSchemes,
}

const mintyOleds: ThemeGroup = {
  name: "Minty OLED",
  icon: "moon-stars-outline",
  schemes: mintyOledSchemes,
}

const catppuccinFrappeGroup: ThemeGroup = {
  name: "Catppuccin Frappé",
  icon: "snowflake-outline",
  schemes: catppuccinFrappeSchemes,
}

const catppuccinMacchiatoGroup: ThemeGroup = {
  name: "Catppuccin Macchiato",
  icon: "coffee-outline",
  schemes: catppuccinMacchiatoSchemes,
}

const catppuccinMochaGroup: ThemeGroup = {
  name: "Catppuccin Mocha",
  icon: "mug",
  schemes: catppuccinMochaSchemes,
}

/**
 * All theme groups organized by category
 */
export const THEME_GROUPS: Record<string, ThemeGroup[]> = {
  Minty: [mintyLights, mintyDarks, mintyOleds],
  Catppuccin: [
    catppuccinFrappeGroup,
    catppuccinMacchiatoGroup,
    catppuccinMochaGroup,
  ],
}

/**
 * Standalone themes not part of any group
 */
export const STANDALONE_THEMES: Record<string, MintyColorScheme> = {
  palenight,
  monochrome,
  nord,
}

/**
 * All themes flattened into a single map
 */
export const ALL_THEMES: Record<string, MintyColorScheme> = {
  ...Object.values(THEME_GROUPS)
    .flat()
    .reduce(
      (acc, group) => {
        group.schemes.forEach((scheme) => {
          acc[scheme.name] = scheme
        })
        return acc
      },
      {} as Record<string, MintyColorScheme>,
    ),
  ...STANDALONE_THEMES,
}

/**
 * Get a theme by name without fallback (strict - returns undefined if not found)
 * Get theme by name without fallback (strict — returns undefined if not found)
 */
export const getThemeStrict = (
  themeName?: string | null,
): MintyColorScheme | null => {
  if (!themeName) return null
  return ALL_THEMES[themeName] ?? null
}

/**
 * Get the group containing a specific theme
 */
// export const getGroupByTheme = (themeName: string): ThemeGroup | null => {
//   for (const groupList of Object.values(THEME_GROUPS)) {
//     for (const group of groupList) {
//       if (group.schemes.some((s) => s.name === themeName)) {
//         return group
//       }
//     }
//   }
//   return null
// }

/**
 * Get all theme names
 */
// export const getAllThemeNames = (): string[] => {
//   return Object.keys(ALL_THEMES)
// }

/**
 * Get themes by brightness
 */
// export const getThemesByBrightness = (isDark: boolean): MintyColorScheme[] => {
//   return Object.values(ALL_THEMES).filter((theme) => theme.isDark === isDark)
// }
