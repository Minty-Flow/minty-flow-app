import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"

import {
  SettingsOptionRow,
  SettingsSection,
  settingsStyles,
} from "~/components/settings/settings-list"
import {
  getLanguageDirection,
  type LangCodeType,
  SupportedLanguages,
} from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { reloadApp } from "~/utils/reload-app"

export default function LanguageOptionsScreen() {
  const { t } = useTranslation()
  const languageCode = useLanguageStore((s) => s.languageCode)
  const direction = useLanguageStore((s) => s.direction)
  const setLanguageCode = useLanguageStore((s) => s.setLanguageCode)

  const applyLanguage = async (code: LangCodeType) => {
    // Strings switch live. forceRTL (called by the store) only takes effect on a
    // JS reload, so a direction change reloads the app. The persisted store
    // already holds the new language when the reload runs.
    setLanguageCode(code)
    if (Platform.OS === "web" || getLanguageDirection(code) === direction)
      return
    await reloadApp()
  }

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <SettingsSection
        title={t("screens.settings.preferences.language.sectionLabel")}
      >
        {SupportedLanguages.map((option) => (
          <SettingsOptionRow
            key={option.code}
            label={option.nativeName}
            selected={languageCode === option.code}
            onPress={() => applyLanguage(option.code)}
          />
        ))}
      </SettingsSection>
    </ScrollView>
  )
}
