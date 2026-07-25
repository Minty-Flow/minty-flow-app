import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"

import { StandaloneThemesSection } from "~/components/theme/standalone-themes-section"
import { themeScreenStyles } from "~/components/theme/theme.styles"
import { ThemeCategorySegmentedControl } from "~/components/theme/theme-category-segmented-control"
import { ThemeColorGrid } from "~/components/theme/theme-color-grid"
import { ThemeHeader } from "~/components/theme/theme-header"
import { ThemeVariantPills } from "~/components/theme/theme-variant-pills"
import { type ThemeMode, useThemeStore } from "~/stores/theme.store"
import { STANDALONE_THEMES, THEME_GROUPS } from "~/styles/theme/registry"
import type { ThemeVariant } from "~/styles/theme/types"
import {
  getCategoryForTheme,
  getThemeDisplayName,
  getThemesForVariant,
  getVariantForTheme,
  getVariantsForCategory,
} from "~/styles/theme/utils"

const ThemeSettingsScreen = () => {
  const { t } = useTranslation()
  const setThemeMode = useThemeStore((state) => state.setThemeMode)
  const themeMode = useThemeStore((state) => state.themeMode)

  const [selectedCategory, setSelectedCategory] = useState<string>(() =>
    getCategoryForTheme(themeMode),
  )
  const [selectedVariant, setSelectedVariant] = useState<ThemeVariant>(() =>
    getVariantForTheme(themeMode),
  )

  const variants = getVariantsForCategory(selectedCategory)
  const categoryThemes = getThemesForVariant(selectedCategory, selectedVariant)

  const currentThemeDisplayName = (() => {
    const selected = categoryThemes.find((thm) => thm.name === themeMode)
    if (selected) return getThemeDisplayName(selected.name)
    const standalone = Object.values(STANDALONE_THEMES).find(
      (thm) => thm.name === themeMode,
    )
    if (standalone) return getThemeDisplayName(standalone.name)
    return t(
      "screens.settings.preferences.appearance.theme.selectThemePlaceholder",
    )
  })()

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
    setSelectedVariant(getVariantForTheme(mode))
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const categoryContainsCurrentTheme = (THEME_GROUPS[category] || []).some(
      (g) => g.schemes.some((s) => s.name === themeMode),
    )
    if (categoryContainsCurrentTheme) {
      setSelectedVariant(getVariantForTheme(themeMode))
    } else {
      const firstVariant = getVariantsForCategory(category)[0]?.label
      if (firstVariant) setSelectedVariant(firstVariant)
    }
  }

  const handleVariantChange = (variant: ThemeVariant) => {
    setSelectedVariant(variant)

    const nextSchemes = getThemesForVariant(selectedCategory, variant)
    if (nextSchemes.length === 0) return

    const currentSchemes = categoryThemes
    const currentIndex = currentSchemes.findIndex((s) => s.name === themeMode)

    const nextTheme =
      currentIndex >= 0 && currentIndex < nextSchemes.length
        ? nextSchemes[currentIndex]
        : nextSchemes[0]

    if (nextTheme) setThemeMode(nextTheme.name as ThemeMode)
  }

  return (
    <ScrollView
      style={themeScreenStyles.container}
      contentContainerStyle={themeScreenStyles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemeHeader currentThemeDisplayName={currentThemeDisplayName} />

      <ThemeCategorySegmentedControl
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ThemeVariantPills
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={handleVariantChange}
      />

      <ThemeColorGrid
        schemes={categoryThemes}
        selectedThemeName={themeMode}
        onThemeSelect={handleThemeChange}
      />

      <StandaloneThemesSection
        selectedThemeName={themeMode}
        onThemeSelect={handleThemeChange}
      />
    </ScrollView>
  )
}

export default ThemeSettingsScreen
