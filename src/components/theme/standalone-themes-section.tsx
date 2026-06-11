import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { ThemeMode } from "~/stores/theme.store"
import { STANDALONE_THEMES } from "~/styles/theme/registry"

import { themeScreenStyles } from "./theme.styles"
import { ThemeColorGrid } from "./theme-color-grid"

interface StandaloneThemesSectionProps {
  selectedThemeName: string
  onThemeSelect: (mode: ThemeMode) => void
}

export function StandaloneThemesSection({
  selectedThemeName,
  onThemeSelect,
}: StandaloneThemesSectionProps) {
  const { t } = useTranslation()
  if (Object.keys(STANDALONE_THEMES).length === 0) {
    return null
  }

  return (
    <View style={themeScreenStyles.standaloneSection}>
      <Text style={themeScreenStyles.sectionTitle}>
        {t("screens.settings.preferences.appearance.theme.other_themes")}
      </Text>
      <ThemeColorGrid
        schemes={Object.values(STANDALONE_THEMES)}
        selectedThemeName={selectedThemeName}
        onThemeSelect={onThemeSelect}
      />
    </View>
  )
}
