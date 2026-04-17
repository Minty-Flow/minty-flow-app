import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ToggleItem } from "~/components/toggle-item"
import type { IconSvgName } from "~/components/ui/icon-svg"
import { InfoBanner } from "~/components/ui/info-banner"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { useAndroidSoundStore } from "~/stores/android-sound.store"

interface PreferenceItem {
  titleKey: TranslationKey
  route: Href
  icon: IconSvgName
}

const appearanceItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.preferences.appearance.theme.title",
    route: "/settings/preferences/theme",
    icon: "color-swatch",
  },
  {
    titleKey: "screens.settings.preferences.appearance.moneyFormatting.title",
    route: "/settings/preferences/money-formatting",
    icon: "hash",
  },
  {
    titleKey: "screens.settings.preferences.appearance.toast.title",
    route: "/settings/preferences/toast-style",
    icon: "alert-square-rounded",
  },
  {
    titleKey: "screens.settings.preferences.appearance.transactionStyle.title",
    route: "/settings/preferences/transaction-appearance",
    icon: "list-details",
  },
  {
    titleKey: "screens.settings.preferences.appearance.buttonPlacement.title",
    route: "/settings/preferences/button-placement",
    icon: "circles",
  },
]

const otherPreferenceItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.preferences.language.title",
    route: "/settings/preferences/language",
    icon: "language",
  },
  {
    titleKey: "screens.settings.transfers.title",
    route: "/settings/preferences/transfers",
    icon: "transfer",
  },
  {
    titleKey: "screens.settings.pending.title",
    route: "/settings/preferences/pending-transactions",
    icon: "clock",
  },
  {
    titleKey: "screens.settings.exchangeRates.title",
    route: "/settings/preferences/exchange-rates",
    icon: "wallet",
  },
  {
    titleKey: "screens.settings.trash.title",
    route: "/settings/preferences/trash-bin",
    icon: "trash",
  },
  {
    titleKey: "screens.settings.privacy.title",
    route: "/settings/preferences/privacy",
    icon: "shield-exclamation",
  },
  {
    titleKey: "screens.settings.preferences.transactionLocation.title",
    route: "/settings/preferences/transaction-location",
    icon: "map-pin",
  },
  {
    titleKey: "screens.settings.reminders.title",
    route: "/settings/preferences/reminder",
    icon: "bell",
  },
]

export default function PreferencesScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const setSoundEnabled = useAndroidSoundStore((s) => s.setSoundEnabled)
  const disableSound = useAndroidSoundStore((s) => s.disableSound)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Other Preferences */}
      <View style={styles.section}>
        <View style={styles.itemsList}>
          {otherPreferenceItems.map((item) => (
            <ActionItem
              key={item.titleKey}
              icon={item.icon}
              title={t(item.titleKey)}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("screens.settings.preferences.appearance.label")}
        </Text>
        <View style={styles.itemsList}>
          {appearanceItems.map((item) => (
            <ActionItem
              key={item.titleKey}
              icon={item.icon}
              title={t(item.titleKey)}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </View>

      {/* Feedback Section */}
      {Platform.OS === "android" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("screens.settings.preferences.buttonFeedback.label")}
          </Text>

          <View style={styles.itemsList}>
            <ToggleItem
              icon={
                disableSound ? "device-mobile-off" : "device-mobile-vibration"
              }
              title={t(
                "screens.settings.preferences.buttonFeedback.soundHaptic.title",
              )}
              value={!disableSound}
              onValueChange={(enabled) => setSoundEnabled(enabled)}
            />

            {!disableSound && (
              <InfoBanner
                text={t(
                  "screens.settings.preferences.buttonFeedback.systemInfo",
                )}
              />
            )}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.customColors.semi,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  itemsList: {
    gap: 0,
  },
}))
