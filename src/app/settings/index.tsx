import Constants from "expo-constants"
import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ExternalLink } from "~/components/external-link"
import { ProfileSection } from "~/components/profile/profile-section"
import type { IconSvgName } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { AppData } from "~/constants/app-data"
import type { TranslationKey } from "~/i18n/config"

interface SettingsItem {
  titleKey: TranslationKey
  route: Href
  icon: IconSvgName
  soon?: boolean
}

const moneyManagementItems: SettingsItem[] = [
  {
    titleKey: "screens.accounts.title",
    route: "/settings/all-accounts",
    icon: "wallet-outline",
  },
  {
    titleKey: "components.categories.title",
    route: "/settings/categories",
    icon: "category-2-outline",
  },
  {
    titleKey: "screens.settings.tags.title",
    route: "/settings/tags",
    icon: "tags-outline",
  },
  {
    titleKey: "screens.settings.trash.title",
    route: "/settings/trash",
    icon: "trash-outline",
  },
  {
    titleKey: "screens.settings.loans.title",
    route: "/settings/loans",
    icon: "scale-outline",
  },
  {
    titleKey: "screens.settings.goals.title",
    route: "/settings/goals",
    icon: "target-outline",
  },
  {
    titleKey: "screens.settings.budgets.title",
    route: "/settings/budgets",
    icon: "chart-pie-outline",
  },
  {
    titleKey: "screens.settings.pending.title",
    route: "/settings/pending-transactions",
    icon: "history-toggle-outline",
  },
  {
    titleKey: "screens.settings.billSplitter.title",
    route: "/settings/bill-splitter",
    icon: "page-break-outline",
  },
]

const otherSettingsItems: SettingsItem[] = [
  {
    titleKey: "screens.settings.preferences.title",
    route: "/settings/preferences",
    icon: "puzzle-outline",
  },
  {
    titleKey: "screens.settings.dataManagement.title",
    route: "/settings/data-management",
    icon: "database-outline",
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
              soon={item.soon}
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

      {/* Maker credit + version */}
      <View style={styles.footer}>
        <Text variant="muted" style={styles.footerVersion}>
          {t("screens.settings.about.version", {
            version: Constants.expoConfig?.version ?? "",
          })}
        </Text>
        {/**
         * Footer tagline (key: `screens.settings.about.tagline`).
         * Alternates kept on hand for future rotation — swap the i18n value:
         * - "Made to help your money make cents."        (current — sense/cents pun)
         * - "Built so your money finally makes sense."
         * - "Crafted late at night so your budget isn't."
         * - "Every cent accounted for. Mostly."
         * - "Balancing books so you don't have to."
         */}
        <Text variant="muted" style={styles.footerTagline}>
          {t("screens.settings.about.tagline")}
        </Text>
        <View style={styles.footerCreditRow}>
          <ExternalLink
            href={AppData.githubProfile}
            pressableStyle={styles.footerLinkBtn}
            textStyle={styles.footerLink}
          >
            {t("screens.settings.about.handle")}
          </ExternalLink>
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
    marginVertical: 50,
    paddingBottom: 150,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
  },
  footer: {
    alignItems: "center",
    gap: 6,
    paddingTop: 50,
  },
  footerTagline: {
    color: theme.colors.semantic.semi,
    ...theme.typography.labelMedium,
    fontStyle: "italic",
    textAlign: "center",
  },
  footerCreditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerVersion: {
    color: theme.colors.semantic.semi,
    ...theme.typography.labelSmall,
  },
  footerLinkBtn: {
    borderRadius: theme.radius,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  footerLink: {
    color: theme.colors.primary,
    ...theme.typography.labelSmall,
    fontWeight: "600",
  },
}))
