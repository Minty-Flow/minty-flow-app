import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView } from "react-native"

import { ActionItem } from "~/components/action-item"
import type { IconSvgName } from "~/components/icons"
import {
  SettingsSection,
  settingsStyles,
} from "~/components/settings/settings-list"
import type { TranslationKey } from "~/i18n/config"

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
  {
    titleKey: "screens.settings.preferences.calendarFormat.title",
    route: "/settings/preferences/calendar-formatting",
    icon: "calendar-cog",
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
  const renderItem = (item: PreferenceItem) => (
    <ActionItem
      key={item.titleKey}
      icon={item.icon}
      title={t(item.titleKey)}
      onPress={() => router.push(item.route)}
    />
  )

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      <SettingsSection>{basicItems.map(renderItem)}</SettingsSection>

      <SettingsSection
        title={t("screens.settings.preferences.groups.behavior")}
      >
        {behaviorItems.map(renderItem)}
        {Platform.OS === "android" && (
          <ActionItem
            icon="device-mobile-vibration-outline"
            title={t("screens.settings.preferences.sound.title")}
            onPress={() => router.push("/settings/preferences/sound")}
          />
        )}
      </SettingsSection>

      <SettingsSection title={t("screens.settings.preferences.groups.system")}>
        {adminItems.map(renderItem)}
      </SettingsSection>

      <SettingsSection
        title={t("screens.settings.preferences.groups.customization")}
      >
        {customizationItems.map(renderItem)}
      </SettingsSection>
    </ScrollView>
  )
}
