import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type AccountModel from "~/database/models/account"
import type CategoryModel from "~/database/models/category"
import type TransactionModel from "~/database/models/transaction"
import type { TransactionWithRelations } from "~/database/services/transaction-service"
import { useTransactionItemAppearanceStore } from "~/stores/transaction-item-appearance.store"

// ─── Mock data for preview ────────────────────────────────────────────────────

const MOCK_ACCOUNT = {
  name: "PayPal",
  currencyCode: "USD",
  icon: "wallet",
  colorScheme: null,
} as unknown as AccountModel

const MOCK_CATEGORY_1 = {
  name: "Food & Drinks",
  icon: "basket",
  colorScheme: null,
} as unknown as CategoryModel

const MOCK_CATEGORY_2 = {
  name: "Shopping",
  icon: "shopping",
  colorScheme: null,
} as unknown as CategoryModel

const MOCK_TX_1 = {
  title: "Coffee Shop",
  amount: -6.99,
  transactionDate: new Date(2024, 0, 15, 18, 16, 0),
  type: "expense" as const,
  isTransfer: false,
  transferId: null,
  requiresManualConfirmation: undefined,
  isDeleted: false,
  extra: undefined,
  isPending: false,
} as unknown as TransactionModel

const MOCK_TX_2 = {
  title: null,
  amount: -1.27,
  transactionDate: new Date(2024, 0, 15, 19, 16, 0),
  type: "expense" as const,
  isTransfer: false,
  transferId: null,
  requiresManualConfirmation: undefined,
  isDeleted: false,
  extra: undefined,
  isPending: false,
} as unknown as TransactionModel

const PREVIEW_ITEM_1: TransactionWithRelations = {
  transaction: MOCK_TX_1,
  account: MOCK_ACCOUNT,
  category: MOCK_CATEGORY_1,
  tags: [],
}

const PREVIEW_ITEM_2: TransactionWithRelations = {
  transaction: MOCK_TX_2,
  account: MOCK_ACCOUNT,
  category: MOCK_CATEGORY_2,
  tags: [],
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
        <IconSvg name="check" size={14} color={theme.colors.onPrimary} />
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
        <Pressable
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
        </Pressable>

        <View native style={styles.divider} />

        <Pressable
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
        </Pressable>
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
        <Pressable
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
        </Pressable>
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
            icon="category"
            selected={leadingIcon === "category"}
            onPress={() => setLeadingIcon("category")}
          />
          <LeadingIconOption
            label={t(
              "screens.settings.preferences.appearance.transactionStyle.options.account",
            )}
            icon="wallet"
            selected={leadingIcon === "account"}
            onPress={() => setLeadingIcon("account")}
          />
        </View>
      </View>

      {/* ── Info note ────────────────────────────────────────────────── */}
      <View native style={styles.infoRow}>
        <IconSvg
          name="info-circle"
          size={14}
          color={theme.colors.customColors.semi}
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
    color: theme.colors.customColors.semi,
  },

  // Preview card
  previewCard: {},

  divider: {
    height: 0.5,
    backgroundColor: theme.colors.customColors.semi,
    opacity: 0.4,
  },

  // Toggle card
  toggleCard: {
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
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
    color: theme.colors.customColors.semi,
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
    color: theme.colors.customColors.semi,
    lineHeight: 18,
  },
}))
