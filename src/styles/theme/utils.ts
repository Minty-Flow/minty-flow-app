// ============================================================================
// Minty Theming System - Utility Functions
// ============================================================================

import type { MintyColorScheme } from "./types"

/** for future usgae
 * Lighten a hex color by a percentage
 * Used for generating dark theme primary colors
 */
// export const lightenColor = (color: string, percent: number = 20): string => {
//   const num = parseInt(color.replace("#", ""), 16)
//   const amt = Math.round(2.55 * percent)
//   const R = Math.min(255, (num >> 16) + amt)
//   const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
//   const B = Math.min(255, (num & 0x0000ff) + amt)
//   return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
//     .toString(16)
//     .slice(1)
//     .toUpperCase()}`
// }

/** for future usgae
 * Darken a hex color by a percentage
 */
// export const darkenColor = (color: string, percent: number = 20): string => {
//   const num = parseInt(color.replace("#", ""), 16)
//   const amt = Math.round(2.55 * percent)
//   const R = Math.max(0, (num >> 16) - amt)
//   const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
//   const B = Math.max(0, (num & 0x0000ff) - amt)
//   return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B)
//     .toString(16)
//     .slice(1)
//     .toUpperCase()}`
// }

/**
 * Create a copy of a color scheme with overrides
 * copyWith pattern for theme overrides
 */
export const copyWith = (
  base: MintyColorScheme,
  overrides: Partial<MintyColorScheme>,
): MintyColorScheme => ({
  ...base,
  ...overrides,
  customColors: {
    ...base.customColors,
    ...(overrides.customColors || {}),
  },
})
