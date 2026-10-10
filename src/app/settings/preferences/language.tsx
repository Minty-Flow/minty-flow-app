import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"

import {
  SettingsOptionRow,
  SettingsSection,
  settingsStyles,
} from "~/components/settings/settings-list"
import {
  DirectionEnum,
  LangCodeEnum,
  type LangCodeType,
} from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { reloadApp } from "~/utils/reload-app"

const languageOptions: {
  value: LangCodeType
  label: string
}[] = [
  {
    value: LangCodeEnum.EN,
    label: "English",
  },
  {
    value: LangCodeEnum.AR,
    label: "العربية",
  },
]

export default function LanguageOptionsScreen() {
  const { t } = useTranslation()
  const languageCode = useLanguageStore((s) => s.languageCode)
  const direction = useLanguageStore((s) => s.direction)
  const setLanguageCode = useLanguageStore((s) => s.setLanguageCode)

  const handleSelectLanguage = async (code: LangCodeType) => {
    const newDirection =
      code === LangCodeEnum.AR ? DirectionEnum.RTL : DirectionEnum.LTR
    // Strings switch live. forceRTL (called by the store) only takes effect on a
    // JS reload, so a direction change reloads the app, with no confirmation.
    // The persisted store already holds the new language when the reload runs.
    setLanguageCode(code)
    if (Platform.OS === "web" || newDirection === direction) return
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
        {languageOptions.map((option) => (
          <SettingsOptionRow
            key={option.value}
            label={option.label}
            selected={languageCode === option.value}
            onPress={() => handleSelectLanguage(option.value)}
          />
        ))}
      </SettingsSection>
    </ScrollView>
  )
}
