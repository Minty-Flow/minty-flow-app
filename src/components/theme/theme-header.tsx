import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { themeScreenStyles } from "./theme.styles"

interface ThemeHeaderProps {
  currentThemeDisplayName: string
}

export function ThemeHeader({ currentThemeDisplayName }: ThemeHeaderProps) {
  const { t } = useTranslation()
  return (
    <View style={themeScreenStyles.header}>
      <Text style={themeScreenStyles.headerLabel}>
        {t("screens.settings.preferences.appearance.theme.current_theme")}
      </Text>
      <Text style={themeScreenStyles.headerTheme}>
        {currentThemeDisplayName}
      </Text>
    </View>
  )
}
