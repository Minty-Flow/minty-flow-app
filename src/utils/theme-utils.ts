import { THEME_GROUPS } from "~/styles/theme/registry"
import type { MintyColorScheme, ThemeGroup } from "~/styles/theme/types"

export type ThemeVariant = string

export interface VariantOption {
  label: ThemeVariant
  icon?: string
  groupName: string
}

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
