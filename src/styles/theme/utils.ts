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

import { THEME_GROUPS } from "./registry"
import type {
  MintyColorScheme,
  ThemeGroup,
  ThemeVariant,
  VariantOption,
} from "./types"

const getVariantLabel = (groupName: string, category: string): string => {
  const stripped = groupName.startsWith(category)
    ? groupName.slice(category.length).trim()
    : groupName
  return stripped || groupName
}

export function getVariantsForCategory(category: string): VariantOption[] {
  const groups = THEME_GROUPS[category] || []
  return groups.map((g) => ({
    label: getVariantLabel(g.name, category),
    icon: g.icon,
    groupName: g.name,
  }))
}

export function getCategoryForTheme(themeName: string): string {
  for (const [category, groups] of Object.entries(THEME_GROUPS)) {
    if (
      groups.some((group) =>
        group.schemes.some((scheme) => scheme.name === themeName),
      )
    ) {
      return category
    }
  }
  return Object.keys(THEME_GROUPS)[0] || "Minty"
}

function findGroupContainingTheme(themeName: string): {
  category: string
  group: ThemeGroup
} | null {
  for (const [category, groups] of Object.entries(THEME_GROUPS)) {
    for (const group of groups) {
      if (group.schemes.some((s) => s.name === themeName)) {
        return { category, group }
      }
    }
  }
  return null
}

export function getVariantForTheme(themeName: string): ThemeVariant {
  const hit = findGroupContainingTheme(themeName)
  if (hit) {
    return getVariantLabel(hit.group.name, hit.category)
  }
  return (
    getVariantsForCategory(Object.keys(THEME_GROUPS)[0] || "Minty")[0]?.label ||
    ""
  )
}

export function getThemeDisplayName(themeName: string): string {
  const processedName = themeName.replace(/Oled$/, "OLED")
  return processedName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function getThemesForVariant(
  selectedCategory: string,
  selectedVariant: ThemeVariant,
): MintyColorScheme[] {
  const groups = THEME_GROUPS[selectedCategory] || []
  const variantGroup = groups.find(
    (g) => getVariantLabel(g.name, selectedCategory) === selectedVariant,
  )
  return variantGroup?.schemes || groups[0]?.schemes || []
}

/** Primary color of every sibling scheme within the active variant group only (e.g. just Minty Dark, not Light/OLED too) */
export function getThemeVariantPalette(themeName: string): string[] {
  const category = getCategoryForTheme(themeName)
  const variant = getVariantForTheme(themeName)
  return getThemesForVariant(category, variant).map((scheme) => scheme.primary)
}

export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Create a copy of a color scheme with overrides
 */
export const copyWith = (
  base: MintyColorScheme,
  overrides: Partial<MintyColorScheme>,
): MintyColorScheme => ({
  ...base,
  ...overrides,
  semantic: {
    ...base.semantic,
    ...(overrides.semantic || {}),
  },
})
