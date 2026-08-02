import { getThemeStrict } from "~/styles/theme/registry"
import type { CategoryBreakdownItem } from "~/types/stats"

export function getCategoryColor(
  item: CategoryBreakdownItem,
  index: number,
  fallbackPalette: string[],
): string {
  const scheme = getThemeStrict(item.categoryColorSchemeName)
  if (scheme) return scheme.primary
  return (
    fallbackPalette[index % fallbackPalette.length] ??
    fallbackPalette[0] ??
    "#888888"
  )
}
