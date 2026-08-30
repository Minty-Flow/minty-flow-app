import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import type { IconSvgName } from "~/components/icons"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { useWeekStartStore } from "~/stores/week-start.store"
import { getWeekStartsOn } from "~/utils/get-week-start-on"

interface PreferenceItem {
  titleKey: TranslationKey
  route: Href
  icon: IconSvgName
}

// Basic app-wide preferences.
const basicItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.preferences.language.title",
    route: "/settings/preferences/language",
    icon: "language-outline",
  },
  {
    titleKey: "screens.settings.preferences.appearance.theme.title",
    route: "/settings/preferences/theme",
    icon: "color-swatch-outline",
  },
  {
    titleKey: "screens.settings.preferences.appearance.moneyFormatting.title",
    route: "/settings/preferences/money-formatting",
    icon: "hash-outline",
  },
]

// How the financial system behaves.
const behaviorItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.transfers.title",
    route: "/settings/preferences/transfers",
    icon: "arrows-right-left-outline",
  },
  {
    titleKey: "screens.settings.pending.title",
    route: "/settings/preferences/pending-transactions",
    icon: "history-toggle-outline",
  },
  {
    titleKey: "screens.settings.exchangeRates.title",
    route: "/settings/preferences/exchange-rates",
    icon: "wallet-outline",
  },
  {
    titleKey: "screens.settings.preferences.transactionLocation.title",
    route: "/settings/preferences/transaction-location",
    icon: "map-pin-outline",
  },
  {
    titleKey: "screens.settings.reminders.title",
    route: "/settings/preferences/reminder",
    icon: "bell-outline",
  },
]

// Administrative destinations.
const adminItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.privacy.title",
    route: "/settings/preferences/privacy",
    icon: "shield-exclamation-outline",
  },
  {
    titleKey: "screens.settings.trash.title",
    route: "/settings/preferences/trash-bin",
    icon: "trash-outline",
  },
]

// UI customization.
const customizationItems: PreferenceItem[] = [
  {
    titleKey: "screens.settings.preferences.appearance.transactionStyle.title",
    route: "/settings/preferences/transaction-appearance",
    icon: "list-details-outline",
  },
  {
    titleKey: "screens.settings.preferences.appearance.toast.title",
    route: "/settings/preferences/toast-style",
    icon: "alert-square-rounded-outline",
  },
  {
    titleKey: "screens.settings.preferences.appearance.buttonPlacement.title",
    route: "/settings/preferences/button-placement",
    icon: "circles-outline",
  },
]

export default function PreferencesScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const weekStart = useWeekStartStore((s) => s.weekStart)

  const weekStartTitle = (() => {
    const numToPref: Record<number, string> = {
      0: "sunday",
      1: "monday",
      6: "saturday",
    }
    const pref = weekStart === "auto" ? numToPref[getWeekStartsOn()] : weekStart
    const dayLabel = pref
      ? t(`screens.settings.preferences.weekStart.${pref}` as TranslationKey)
      : ""
    return `${t("screens.settings.preferences.weekStart.label")} · ${dayLabel}`
  })()

  const renderItem = (item: PreferenceItem) => (
    <ActionItem
      key={item.titleKey}
      icon={item.icon}
      title={t(item.titleKey)}
      onPress={() => router.push(item.route)}
    />
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.group}>
        {basicItems.map(renderItem)}
        <ActionItem
          icon="calendar-week"
          title={weekStartTitle}
          onPress={() => router.push("/settings/preferences/week-start")}
        />
      </View>

      <View style={[styles.group, styles.groupGap]}>
        {behaviorItems.map(renderItem)}
        {Platform.OS === "android" && (
          <ActionItem
            icon="device-mobile-vibration-outline"
            title={t("screens.settings.preferences.sound.title")}
            onPress={() => router.push("/settings/preferences/sound")}
          />
        )}
      </View>

      <View style={[styles.group, styles.groupGap]}>
        {adminItems.map(renderItem)}
      </View>

      <View style={[styles.group, styles.groupGap]}>
        {customizationItems.map(renderItem)}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingVertical: 12,
    paddingBottom: 40,
  },
  group: {
    gap: 0,
  },
  groupGap: {
    marginTop: 18,
  },
}))
