import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
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
  amount: -6.99,
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
  amount: -1.27,
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
  const showCategoryForUntitled = useTransactionItemAppearanceStore(
    (s) => s.showCategoryForUntitled,
  )

  const setVariant = useTransactionItemAppearanceStore((s) => s.setVariant)
  const setLeadingIcon = useTransactionItemAppearanceStore(
    (s) => s.setLeadingIcon,
  )
  const setShowCategory = useTransactionItemAppearanceStore(
    (s) => s.setShowCategory,
  )
  const setShowCategoryForUntitled = useTransactionItemAppearanceStore(
    (s) => s.setShowCategoryForUntitled,
  )

  const isLessDense = variant === "elevated"

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Preview ─────────────────────────────────────────────────── */}
      <View native style={[styles.sectionLabel, styles.sectionLabelFirst]}>
        <Text style={styles.sectionLabelText}>
          {t(
            "screens.settings.preferences.appearance.transactionStyle.sections.preview",
          )}
        </Text>
      </View>

      <View native style={styles.previewCard}>
        <TransactionItem transactionWithRelations={PREVIEW_ITEM_1} />
        <View native style={styles.divider} />
        <TransactionItem transactionWithRelations={PREVIEW_ITEM_2} />
      </View>

      {/* ── Category display ─────────────────────────────────────────── */}
      <View native style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>
          {t(
            "screens.settings.preferences.appearance.transactionStyle.sections.categoryDisplay",
          )}
        </Text>
      </View>

      <View native style={styles.toggleCard}>
        <ListItem
          style={styles.toggleRow}
          onPress={() => setShowCategoryForUntitled(!showCategoryForUntitled)}
        >
          <View native style={styles.toggleRowContent}>
            <Text style={styles.toggleLabel}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.showForUntitled.label",
              )}
            </Text>
            <Text style={styles.toggleDescription}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.showForUntitled.description",
              )}
            </Text>
          </View>
          <Switch
            value={showCategoryForUntitled}
            onValueChange={setShowCategoryForUntitled}
          />
        </ListItem>

        <View native style={styles.divider} />

        <ListItem
          style={styles.toggleRow}
          onPress={() => setShowCategory(!showCategory)}
        >
          <View native style={styles.toggleRowContent}>
            <Text style={styles.toggleLabel}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.showAfterAccount.label",
              )}
            </Text>
            <Text style={styles.toggleDescription}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.showAfterAccount.description",
              )}
            </Text>
          </View>
          <Switch value={showCategory} onValueChange={setShowCategory} />
        </ListItem>
      </View>

      {/* ── Layout ──────────────────────────────────────────────────── */}
      <View native style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>
          {t(
            "screens.settings.preferences.appearance.transactionStyle.sections.layout",
          )}
        </Text>
      </View>

      <View native style={styles.toggleCard}>
        <ListItem
          style={styles.toggleRow}
          onPress={() => setVariant(isLessDense ? "compact" : "elevated")}
        >
          <View native style={styles.toggleRowContent}>
            <Text style={styles.toggleLabel}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.lessDense.label",
              )}
            </Text>
            <Text style={styles.toggleDescription}>
              {t(
                "screens.settings.preferences.appearance.transactionStyle.lessDense.description",
              )}
            </Text>
          </View>
          <Switch
            value={isLessDense}
            onValueChange={(v) => setVariant(v ? "elevated" : "compact")}
          />
        </ListItem>
      </View>

      {/* ── Leading icon ─────────────────────────────────────────────── */}
      <View native style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>
          {t(
            "screens.settings.preferences.appearance.transactionStyle.sections.leadingIcon",
          )}
        </Text>
      </View>

      <View native style={styles.leadingIconCard}>
        <View native style={styles.leadingIconInfo}>
          <Text style={styles.toggleLabel}>
            {t(
              "screens.settings.preferences.appearance.transactionStyle.iconSource.label",
            )}
          </Text>
          <Text style={styles.toggleDescription}>
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
    marginTop: 28,
  },
  sectionLabelFirst: {
    marginTop: 8,
  },
  sectionLabelText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: theme.colors.semantic.semi,
  },

  // Preview card
  previewCard: {},

  divider: {
    height: 0.5,
    backgroundColor: theme.colors.semantic.semi,
    opacity: 0.4,
  },

  // Toggle card
  toggleCard: {
    overflow: "hidden",
  },
  toggleRow: {
    justifyContent: "space-between",
    minHeight: 56,
  },
  toggleRowContent: {
    flex: 1,
    gap: 3,
    paddingRight: 12,
  },
  toggleLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  toggleDescription: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
    lineHeight: 16,
  },

  // Leading icon card
  leadingIconCard: {
    overflow: "hidden",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  leadingIconInfo: {
    gap: 3,
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
