import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ProfileSection } from "~/components/profile/profile-section"
import type { IconSymbolName } from "~/components/ui/icon-symbol"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"

interface SettingsItem {
  titleKey: TranslationKey
  route: Href
  icon: IconSymbolName
  soon?: boolean
}

const moneyManagementItems: SettingsItem[] = [
  {
    titleKey: "screens.accounts.title",
    route: "/settings/all-accounts",
    icon: "wallet-bifold",
  },
  {
    titleKey: "screens.settings.loans.title",
    route: "/settings/loans",
    icon: "handshake",
  },
  {
    titleKey: "components.categories.title",
    route: "/settings/categories",
    icon: "shape",
  },
  {
    titleKey: "screens.settings.tags.title",
    route: "/settings/tags",
    icon: "tag-multiple",
  },
  {
    titleKey: "screens.settings.trash.title",
    route: "/settings/trash",
    icon: "trash-can",
  },
  {
    titleKey: "screens.settings.goals.title",
    route: "/settings/goals",
    icon: "target",
  },
  {
    titleKey: "screens.settings.budgets.title",
    route: "/settings/budgets",
    icon: "chart-pie",
  },
  {
    titleKey: "screens.settings.pending.title",
    route: "/settings/pending-transactions",
    icon: "progress-clock",
  },
  {
    titleKey: "screens.settings.billSplitter.title",
    route: "/settings/bill-splitter",
    icon: "format-page-split",
  },
]

const otherSettingsItems: SettingsItem[] = [
  {
    titleKey: "screens.settings.preferences.title",
    route: "/settings/preferences",
    icon: "puzzle-edit",
  },
  {
    titleKey: "screens.settings.dataManagement.title",
    route: "/settings/data-management",
    icon: "server",
    soon: true,
  },
]

export default function SettingsScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text variant="h2" style={styles.headerTitle}>
          SETTINGS
        </Text>
      </View> */}

      {/* User Profile Section */}
      <ProfileSection />

      {/* Money Management Section */}
      <View style={styles.section}>
        <View>
          {moneyManagementItems.map((item) => (
            <ActionItem
              key={item.titleKey}
              icon={item.icon}
              title={t(item.titleKey)}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </View>

      {/* Other Settings Section */}
      <View style={styles.section}>
        <Text variant="small" style={styles.sectionTitle}>
          {t("screens.settings.sections.other")}
        </Text>
        <View>
          {otherSettingsItems.map((item) => (
            <ActionItem
              key={item.titleKey}
              icon={item.icon}
              title={t(item.titleKey)}
              soon={item.soon}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
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
    marginVertical: 40,
    paddingBottom: 200,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.customColors.semi,
  },
}))
