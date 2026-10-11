import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import {
  SettingsSection,
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import { useTransactionItemAppearanceStore } from "~/stores/transaction-item-appearance.store"

// ─── Mock data for preview ────────────────────────────────────────────────────

const BASE_TX = {
  id: "preview",
  accountId: "preview",
  categoryId: null,
  loanId: null,
  goalId: null,
  isTransfer: false,
  transferId: null,
  transferGroupId: null,
  relatedAccountId: null,
  isDeleted: false,
  deletedAt: null,
  isPending: false,
  requiresManualConfirmation: false,
  extra: null,
  description: null,
  subtype: null,
  kind: "default" as const,
  accountBalanceBefore: 0,
  budgetId: null,
  notes: null,
  location: null,
  createdAt: new Date(2024, 0, 15),
  updatedAt: new Date(2024, 0, 15),
  relatedAccount: undefined,
  conversionRate: null,
  recurringId: null,
  tagIds: [],
}

const MOCK_ACCOUNT = {
  id: "preview-account",
  name: "PayPal",
  currencyCode: "USD",
  icon: "wallet-outline",
  colorScheme: null,
} as unknown as TransactionWithRelations["account"]

const PREVIEW_ITEM_1: TransactionWithRelations = {
  ...BASE_TX,
  id: "preview-1",
  title: "Coffee Shop",
  amount: -699,
  transactionDate: new Date(2024, 0, 15, 18, 16, 0),
  type: "expense",
  account: MOCK_ACCOUNT,
  category: {
    id: "c1",
    name: "Food & Drinks",
    icon: "basket-outline",
    colorScheme: null,
  } as unknown as TransactionWithRelations["category"],
}

const PREVIEW_ITEM_2: TransactionWithRelations = {
  ...BASE_TX,
  id: "preview-2",
  title: null,
  amount: -127,
  transactionDate: new Date(2024, 0, 15, 19, 16, 0),
  type: "expense",
  account: MOCK_ACCOUNT,
  category: {
    id: "c2",
    name: "Shopping",
    icon: "shopping",
    colorScheme: null,
  } as unknown as TransactionWithRelations["category"],
}

// ─── Leading icon option ──────────────────────────────────────────────────────

function LeadingIconOption({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string
  icon: IconSvgName
  selected: boolean
  onPress: () => void
}) {
  const { theme } = useUnistyles()
  const iconColor = selected ? theme.colors.onPrimary : theme.colors.onSecondary
  return (
    <Button
      variant={selected ? "default" : "secondary"}
      style={styles.leadingOption}
      onPress={onPress}
      accessibilityState={{ checked: selected }}
    >
      <IconSvg name={icon} size={18} color={iconColor} />
      <Text style={styles.leadingOptionLabel}>{label}</Text>
      {selected && (
        <IconSvg
          name="check-outline"
          size={14}
          color={theme.colors.onPrimary}
        />
      )}
    </Button>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TransactionAppearanceScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const variant = useTransactionItemAppearanceStore((s) => s.variant)
  const leadingIcon = useTransactionItemAppearanceStore((s) => s.leadingIcon)
  const showCategory = useTransactionItemAppearanceStore((s) => s.showCategory)
  const showUntitledForBlankTitle = useTransactionItemAppearanceStore(
    (s) => s.showUntitledForBlankTitle,
  )

  const setVariant = useTransactionItemAppearanceStore((s) => s.setVariant)
  const setLeadingIcon = useTransactionItemAppearanceStore(
    (s) => s.setLeadingIcon,
  )
  const setShowCategory = useTransactionItemAppearanceStore(
    (s) => s.setShowCategory,
  )
  const setShowUntitledForBlankTitle = useTransactionItemAppearanceStore(
    (s) => s.setShowUntitledForBlankTitle,
  )

  const isLessDense = variant === "elevated"

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <SettingsSection
        title={t(
          "screens.settings.preferences.appearance.transactionStyle.sections.preview",
        )}
      >
        <TransactionItem transactionWithRelations={PREVIEW_ITEM_1} />
        <View native style={styles.divider} />
        <TransactionItem transactionWithRelations={PREVIEW_ITEM_2} />
      </SettingsSection>

      <SettingsSection
        title={t(
          "screens.settings.preferences.appearance.transactionStyle.sections.categoryDisplay",
        )}
      >
        <SettingsSwitchRow
          label={t(
            "screens.settings.preferences.appearance.transactionStyle.showForUntitled.label",
          )}
          description={t(
            "screens.settings.preferences.appearance.transactionStyle.showForUntitled.description",
          )}
          value={showUntitledForBlankTitle}
          onValueChange={setShowUntitledForBlankTitle}
        />
        <SettingsSwitchRow
          label={t(
            "screens.settings.preferences.appearance.transactionStyle.showAfterAccount.label",
          )}
          description={t(
            "screens.settings.preferences.appearance.transactionStyle.showAfterAccount.description",
          )}
          value={showCategory}
          onValueChange={setShowCategory}
        />
      </SettingsSection>

      <SettingsSection
        title={t(
          "screens.settings.preferences.appearance.transactionStyle.sections.layout",
        )}
      >
        <SettingsSwitchRow
          label={t(
            "screens.settings.preferences.appearance.transactionStyle.lessDense.label",
          )}
          description={t(
            "screens.settings.preferences.appearance.transactionStyle.lessDense.description",
          )}
          value={isLessDense}
          onValueChange={(v) => setVariant(v ? "elevated" : "compact")}
        />
      </SettingsSection>

      <SettingsSection
        title={t(
          "screens.settings.preferences.appearance.transactionStyle.sections.leadingIcon",
        )}
      >
        <View native style={styles.leadingIconCard}>
          <View native style={styles.leadingIconInfo}>
            <Text style={settingsStyles.rowLabel}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.iconSource.label",
              )}
            </Text>
            <Text variant="small" style={settingsStyles.rowDescription}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.iconSource.description",
              )}
            </Text>
          </View>

          <View native style={styles.leadingOptions}>
            <LeadingIconOption
              label={t(
                "screens.settings.preferences.appearance.transactionStyle.options.category",
              )}
              icon="category-outline"
              selected={leadingIcon === "category"}
              onPress={() => setLeadingIcon("category")}
            />
            <LeadingIconOption
              label={t(
                "screens.settings.preferences.appearance.transactionStyle.options.account",
              )}
              icon="wallet-outline"
              selected={leadingIcon === "account"}
              onPress={() => setLeadingIcon("account")}
            />
          </View>
        </View>
      </SettingsSection>

      {/* ── Info note ────────────────────────────────────────────────── */}
      <View native style={styles.infoRow}>
        <IconSvg
          name="info-circle-outline"
          size={14}
          color={theme.colors.semantic.semi}
        />
        <Text style={styles.infoText}>
          {t("screens.settings.preferences.appearance.transactionStyle.info")}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.semantic.semi,
    opacity: 0.4,
  },

  // Leading icon card
  leadingIconCard: {
    overflow: "hidden",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  leadingIconInfo: {
    gap: 2,
  },
  leadingOptions: {
    flexDirection: "row",
    gap: 10,
  },
  leadingOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  leadingOptionLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "500",
  },

  // Info
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
    lineHeight: 18,
  },
}))
