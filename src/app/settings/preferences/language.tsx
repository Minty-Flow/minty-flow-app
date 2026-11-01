import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"

import { ConfirmSheet } from "~/components/confirm-sheet"
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

  const [pendingCode, setPendingCode] = useState<LangCodeType | null>(null)

  const directionOf = (code: LangCodeType) =>
    code === LangCodeEnum.AR ? DirectionEnum.RTL : DirectionEnum.LTR

  const applyLanguage = async (code: LangCodeType) => {
    // Strings switch live. forceRTL (called by the store) only takes effect on a
    // JS reload, so a direction change reloads the app. The persisted store
    // already holds the new language when the reload runs.
    setLanguageCode(code)
    if (Platform.OS === "web" || directionOf(code) === direction) return
    await reloadApp()
  }

  const handleSelectLanguage = async (code: LangCodeType) => {
    // A direction change restarts the app: ask first, it drops unsaved work.
    if (Platform.OS !== "web" && directionOf(code) !== direction) {
      setPendingCode(code)
      return
    }
    await applyLanguage(code)
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
      <ConfirmSheet
        visible={pendingCode !== null}
        onRequestClose={() => setPendingCode(null)}
        onConfirm={() => (pendingCode ? applyLanguage(pendingCode) : undefined)}
        title={t("screens.settings.preferences.language.restart.title")}
        description={t(
          "screens.settings.preferences.language.restart.description",
        )}
        confirmLabel={t(
          "screens.settings.preferences.language.restart.confirm",
        )}
        cancelLabel={t("common.actions.cancel")}
        icon="refresh-outline"
      />
    </ScrollView>
  )
}
