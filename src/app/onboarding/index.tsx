import { Redirect, useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  getLanguageDirection,
  LangCodeEnum,
  type LangCodeType,
  SupportedLanguages,
} from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { useOnboardingStore } from "~/stores/onboarding.store"
import { getSupportedDeviceLanguage } from "~/utils/device-locale"
import { reloadApp } from "~/utils/reload-app"

/**
 * First onboarding screen. Kept apart from the currency step on purpose: a
 * direction change reloads the app, which would wipe anything chosen here.
 * After the reload the user lands on the next step already in the right
 * language and direction.
 */
export default function OnboardingLanguageScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const isLanguageChosen = useOnboardingStore((s) => s.isLanguageChosen)
  const setLanguageChosen = useOnboardingStore((s) => s.setLanguageChosen)
  const direction = useLanguageStore((s) => s.direction)
  const setLanguageCode = useLanguageStore((s) => s.setLanguageCode)
  const [selected, setSelected] = useState<LangCodeType>(
    () => getSupportedDeviceLanguage() ?? LangCodeEnum.EN,
  )

  if (isLanguageChosen) return <Redirect href="/onboarding/slides" />

  const handleContinue = async () => {
    setLanguageChosen()
    setLanguageCode(selected)
    router.replace("/onboarding/slides")
    // forceRTL only takes effect on a JS reload.
    if (Platform.OS !== "web" && getLanguageDirection(selected) !== direction) {
      await reloadApp()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <IconSvg name="world-map-outline" size={64} />
          <Text style={styles.title}>{t("onboarding.language.title")}</Text>
        </View>
        <View style={styles.list}>
          {SupportedLanguages.map((option) => {
            const isSelected = option.code === selected
            return (
              <Pressable
                key={option.code}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelected(option.code)}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.nativeName}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <Button onPress={handleContinue} style={styles.button}>
          <Text style={styles.buttonText}>{t("onboarding.actions.next")}</Text>
          <ChevronIcon
            direction="trailing"
            color={styles.buttonIconColor.color}
            size={18}
          />
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 96,
    gap: 32,
  },
  header: {
    gap: 20,
  },
  title: {
    fontSize: theme.typography.headlineMedium.fontSize,
    lineHeight: theme.typography.headlineMedium.fontSize * 1.3,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  list: {
    gap: 12,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}18`,
  },
  optionLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  button: {
    width: "100%",
  },
  buttonIconColor: {
    color: theme.colors.onPrimary,
  },
  buttonText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
