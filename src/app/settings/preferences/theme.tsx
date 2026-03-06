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
import {
  getCategoryForTheme,
  getThemeDisplayName,
  getThemesForVariant,
  getVariantForTheme,
  type ThemeVariant,
} from "~/utils/theme-utils"

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

  // const clearSavedTheme = () => {
  //   themeStorage.remove(THEME_PERSIST_STORE_KEY)
  //   setThemeMode(DEFAULT_THEME)
  //   setSelectedCategory(getCategoryForTheme(DEFAULT_THEME))
  //   setSelectedVariant(getVariantForTheme(DEFAULT_THEME))
  // }

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
    setSelectedVariant(getVariantForTheme(mode))
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "Catppuccin") {
      const newVariant = getVariantForTheme(themeMode)
      setSelectedVariant(newVariant)
      const catppuccinGroups = THEME_GROUPS[category] || []
      const isCurrentThemeInCategory = catppuccinGroups.some((g) =>
        g.schemes.some((s) => s.name === themeMode),
      )
      if (!isCurrentThemeInCategory && catppuccinGroups[0]) {
        setSelectedVariant("Light")
      }
    } else {
      setSelectedVariant(getVariantForTheme(themeMode))
    }
  }

  const handleVariantChange = (variant: ThemeVariant) => {
    setSelectedVariant(variant)
    const groups = THEME_GROUPS[selectedCategory] || []

    if (selectedCategory === "Minty") {
      const variantGroup = groups.find((g) => {
        const name = g.name.toLowerCase()
        return (
          name.includes(variant.toLowerCase()) ||
          (variant === "OLED" && name.includes("oled"))
        )
      })

      if (variantGroup && variantGroup.schemes.length > 0) {
        const currentTheme = categoryThemes.find((t) => t.name === themeMode)
        if (currentTheme) {
          const matchingTheme = variantGroup.schemes.find(
            (t) => t.primary === currentTheme.primary,
          )
          if (matchingTheme) {
            setThemeMode(matchingTheme.name as ThemeMode)
          } else if (variantGroup.schemes[0]) {
            setThemeMode(variantGroup.schemes[0].name as ThemeMode)
          }
        } else if (variantGroup.schemes[0]) {
          setThemeMode(variantGroup.schemes[0].name as ThemeMode)
        }
      }
    } else {
      let variantGroup: (typeof groups)[0] | undefined

      if (variant === "Light") {
        variantGroup = groups.find((g) => {
          const name = g.name.toLowerCase()
          return name.includes("frappé") || name.includes("frappe")
        })
      } else if (variant === "Dark") {
        variantGroup = groups.find((g) =>
          g.name.toLowerCase().includes("macchiato"),
        )
      } else if (variant === "OLED") {
        variantGroup = groups.find((g) =>
          g.name.toLowerCase().includes("mocha"),
        )
      }

      if (variantGroup && variantGroup.schemes.length > 0) {
        setThemeMode(variantGroup.schemes[0].name as ThemeMode)
      }
    }
  }

  return (
    <ScrollView
      style={themeScreenStyles.container}
      contentContainerStyle={[themeScreenStyles.content, { paddingBottom: 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <ThemeHeader currentThemeDisplayName={currentThemeDisplayName} />

      <ThemeCategorySegmentedControl
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ThemeVariantPills
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

      {/* is for testing: clear saved theme */}
      {/* <Button variant="destructive" onPress={clearSavedTheme}>
        <Text>Clear saved theme (testing)</Text>
      </Button> */}
    </ScrollView>
  )
}

export default ThemeSettingsScreen
