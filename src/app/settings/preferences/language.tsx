import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import RNRestart from "react-native-restart"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  DirectionEnum,
  LangCodeEnum,
  type LangCodeType,
} from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { logger } from "~/utils/logger"

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
  const { theme } = useUnistyles()
  const languageCode = useLanguageStore((s) => s.languageCode)
  const direction = useLanguageStore((s) => s.direction)
  const setLanguageCode = useLanguageStore((s) => s.setLanguageCode)

  const [pendingLang, setPendingLang] = useState<LangCodeType | null>(null)

  const handleSelectLanguage = (code: LangCodeType) => {
    const newDirection =
      code === LangCodeEnum.AR ? DirectionEnum.RTL : DirectionEnum.LTR

    // setLanguageCode(code)

    // if the app needs restart/reload use this code commented code instead
    // If the direction is changing (LTR <-> RTL), show the modal first
    if (newDirection !== direction) {
      setPendingLang(code)
    } else {
      // If it's just a language change (e.g., EN to FR), just swap it
      setLanguageCode(code)
    }
  }

  const handleConfirmReload = async () => {
    if (pendingLang) {
      // Finalize the choice in the store right before the app restarts
      setLanguageCode(pendingLang)

      try {
        RNRestart.restart()
      } catch {
        logger.warn("this wont work in development")
      }
    }
  }

  const handleCancelReload = () => {
    setPendingLang(null)
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View native style={styles.sectionLabel}>
          <Text variant="small" style={styles.sectionLabelText}>
            {t("screens.settings.preferences.language.sectionLabel")}
          </Text>
        </View>
        <View native style={styles.card}>
          {languageOptions.map((option, index) => {
            const isSelected = languageCode === option.value
            const isLast = index === languageOptions.length - 1
            return (
              <View key={option.value} native>
                <Pressable
                  style={styles.row}
                  onPress={() => handleSelectLanguage(option.value)}
                >
                  <View native style={styles.rowContent}>
                    <Text style={styles.rowLabel}>{option.label}</Text>
                  </View>
                  {isSelected ? (
                    <IconSvg
                      name="check"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
                {!isLast ? <View native style={styles.divider} /> : null}
              </View>
            )
          })}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={pendingLang !== null}
        onRequestClose={handleCancelReload}
        onConfirm={handleConfirmReload}
        title={t(
          "screens.settings.preferences.language.rtlReloadConfirm.title",
        )}
        description={t(
          "screens.settings.preferences.language.rtlReloadConfirm.description",
        )}
        confirmLabel={t(
          "screens.settings.preferences.language.rtlReloadConfirm.confirmLabel",
        )}
        icon="repeat"
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 48,
  },

  sectionLabel: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionLabelText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: theme.colors.customColors?.semi,
  },

  card: {
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.customColors?.semi,
    opacity: 0.4,
  },
}))
