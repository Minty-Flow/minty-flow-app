import { withObservables } from "@nozbe/watermelondb/react"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, View as RNView, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { BillItemCard } from "~/components/bill-splitter/bill-item-card"
import { ConfirmModal } from "~/components/confirm-modal"
import { DynamicIcon } from "~/components/dynamic-icon"
import { InfoModal } from "~/components/info-modal"
import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { observeAccounts } from "~/database/services/account-service"
import {
  getAllocatedTotal,
  getBillTotal,
  useBillSplitterStore,
} from "~/stores/bill-splitter.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Account } from "~/types/accounts"
import type { BillItem } from "~/types/bill-splitter"

interface BillSplitterContentProps {
  accounts: Account[]
}

function BillSplitterContent({ accounts }: BillSplitterContentProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const navigation = useNavigation()
  const currency = useMoneyFormattingStore((s) => s.preferredCurrency)

  const participants = useBillSplitterStore((s) => s.participants)
  const items = useBillSplitterStore((s) => s.items)
  const accountId = useBillSplitterStore((s) => s.accountId)
  const setAccountId = useBillSplitterStore((s) => s.setAccountId)
  const removeItem = useBillSplitterStore((s) => s.removeItem)
  const clearBill = useBillSplitterStore((s) => s.clearBill)

  const [infoVisible, setInfoVisible] = useState(false)
  const [clearVisible, setClearVisible] = useState(false)
  const [accountPickerOpen, setAccountPickerOpen] = useState(false)
  const [accountSearchQuery, setAccountSearchQuery] = useState("")

  const selectedAccount = accounts.find((a) => a.id === accountId) ?? null

  const total = getBillTotal(items)
  const allocated = getAllocatedTotal(items)

  // Progress bar fill percentage, clamped to 0–100
  const progressPercent = total > 0 ? Math.min(allocated / total, 1) * 100 : 0

  const filteredAccounts = useMemo(() => {
    if (!accountSearchQuery.trim()) return accounts
    const lower = accountSearchQuery.toLowerCase()
    return accounts.filter((a) => a.name.toLowerCase().includes(lower))
  }, [accounts, accountSearchQuery])

  const handleToggleAccountPicker = useCallback(() => {
    setAccountPickerOpen((open) => {
      if (!open) setAccountSearchQuery("")
      return !open
    })
  }, [])

  const handleSelectAccount = useCallback(
    (id: string) => {
      setAccountId(id)
      setAccountPickerOpen(false)
    },
    [setAccountId],
  )

  // Header right: info button + trash (only when items exist)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RNView style={styles.headerRight}>
          {items.length > 0 && (
            <Pressable
              onPress={() => setClearVisible(true)}
              style={styles.headerButton}
              accessibilityLabel={t(
                "screens.settings.billSplitter.actions.clearBill",
              )}
            >
              <IconSvg name="trash" size={20} color={theme.colors.error} />
            </Pressable>
          )}
          <Pressable
            onPress={() => setInfoVisible(true)}
            style={styles.headerButton}
            accessibilityLabel={t("screens.settings.billSplitter.info.title")}
          >
            <IconSvg
              name="info-circle"
              size={20}
              color={theme.colors.onSecondary}
            />
          </Pressable>
        </RNView>
      ),
    })
  }, [navigation, theme, t, items.length])

  const renderItem = useCallback(
    ({ item }: { item: BillItem }) => (
      <BillItemCard
        item={item}
        participants={participants}
        onDelete={() => removeItem(item.id)}
        onEdit={() =>
          router.push({
            pathname: "/settings/bill-splitter/add-item",
            params: { itemId: item.id },
          })
        }
      />
    ),
    [participants, removeItem, router],
  )

  const hasItems = items.length > 0

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Extra bottom padding: summary button (72) + FAB offset (88)
        contentContainerStyle={[
          styles.listContent,
          hasItems && styles.listContentWithSummary,
        ]}
        ListHeaderComponent={
          <>
            {/* Account Picker */}
            <RNView style={styles.accountPickerBlock}>
              {/* Trigger row */}
              <Pressable
                style={[
                  styles.accountTrigger,
                  selectedAccount && styles.accountTriggerSelected,
                ]}
                onPress={handleToggleAccountPicker}
                accessibilityLabel={
                  accountPickerOpen
                    ? t("common.actions.cancel")
                    : t("screens.settings.billSplitter.summary.selectAccount")
                }
              >
                {selectedAccount ? (
                  <>
                    <DynamicIcon
                      icon={selectedAccount.icon || "wallet"}
                      size={24}
                      colorScheme={getThemeStrict(
                        selectedAccount.colorSchemeName,
                      )}
                      variant="badge"
                    />
                    <View style={styles.accountTriggerContent}>
                      <Text style={styles.accountTriggerName} numberOfLines={1}>
                        {selectedAccount.name}
                      </Text>
                      <Money
                        value={selectedAccount.balance}
                        currency={selectedAccount.currencyCode}
                        style={styles.accountTriggerBalance}
                      />
                    </View>
                    <IconSvg
                      name={accountPickerOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={theme.colors.onSecondary}
                      style={styles.chevron}
                    />
                  </>
                ) : (
                  <>
                    <DynamicIcon
                      icon="wallet"
                      size={24}
                      color={theme.colors.primary}
                      variant="badge"
                    />
                    <Text
                      style={styles.accountTriggerPlaceholder}
                      numberOfLines={1}
                    >
                      {t("screens.settings.billSplitter.summary.selectAccount")}
                    </Text>
                    <IconSvg
                      name={accountPickerOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={theme.colors.onSecondary}
                      style={styles.chevron}
                    />
                  </>
                )}
              </Pressable>

              {/* Inline expandable account list */}
              {accountPickerOpen && (
                <View native style={styles.inlineAccountPicker}>
                  <Input
                    placeholder={t("screens.accounts.a11y.searchPlaceholder")}
                    value={accountSearchQuery}
                    onChangeText={setAccountSearchQuery}
                    placeholderTextColor={theme.colors.customColors.semi}
                    style={styles.pickerSearchInput}
                  />
                  <ScrollView
                    style={styles.pickerList}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    {filteredAccounts.map((account) => (
                      <Pressable
                        key={account.id}
                        style={[
                          styles.accountPickerRow,
                          account.id === accountId &&
                            styles.accountPickerRowSelected,
                        ]}
                        onPress={() => handleSelectAccount(account.id)}
                      >
                        <DynamicIcon
                          icon={account.icon || "wallet"}
                          size={24}
                          colorScheme={getThemeStrict(account.colorSchemeName)}
                          variant="badge"
                        />
                        <View style={styles.accountPickerRowContent} native>
                          <Text
                            style={styles.accountPickerRowName}
                            numberOfLines={1}
                          >
                            {account.name}
                          </Text>
                          <Money
                            value={account.balance}
                            currency={account.currencyCode}
                            style={styles.accountPickerRowBalance}
                          />
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </RNView>

            {/* Hero Total Display */}
            <View style={styles.heroContainer}>
              <Money
                value={allocated}
                currency={currency}
                hideSign
                style={styles.heroAmount}
              />
              <Text style={styles.heroOf}>
                {`/ `}
                <Money
                  value={total}
                  currency={currency}
                  hideSign
                  style={styles.heroTotal}
                />
              </Text>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` as unknown as number },
                  ]}
                />
              </View>

              {/* Participants chip */}
              <Pressable
                style={styles.participantsChip}
                onPress={() => router.push("/settings/bill-splitter/names")}
                accessibilityLabel={t(
                  "screens.settings.billSplitter.names.title",
                )}
              >
                <IconSvg
                  name="users"
                  size={14}
                  color={theme.colors.onSecondary}
                />
                <Text style={styles.participantsChipText}>
                  {participants.length}{" "}
                  {t("screens.settings.billSplitter.names.title").toLowerCase()}
                </Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="page-break"
            title={t("screens.settings.billSplitter.items.empty.title")}
            description={t(
              "screens.settings.billSplitter.items.empty.description",
            )}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Summary bottom button — only when items exist */}
      {hasItems && (
        <View style={styles.summaryButtonContainer}>
          <Button
            style={styles.summaryButton}
            onPress={() => router.push("/settings/bill-splitter/summary")}
          >
            <Text style={styles.summaryButtonText}>
              {t("screens.settings.billSplitter.actions.summary")}
            </Text>
          </Button>
        </View>
      )}

      {/* FAB — positioned above the summary button when visible */}
      <Pressable
        onPress={() => router.push("/settings/bill-splitter/add-item")}
        style={[styles.fab, hasItems && styles.fabAboveSummary]}
        accessibilityLabel={t("screens.settings.billSplitter.actions.addItem")}
      >
        <IconSvg name="plus" size={24} color={theme.colors.onPrimary} />
      </Pressable>

      {/* Modals */}
      <InfoModal
        visible={infoVisible}
        onRequestClose={() => setInfoVisible(false)}
        title={t("screens.settings.billSplitter.info.title")}
        description={t("screens.settings.billSplitter.info.description")}
      />
      <ConfirmModal
        visible={clearVisible}
        onRequestClose={() => setClearVisible(false)}
        onConfirm={clearBill}
        title={t("screens.settings.billSplitter.clear.confirm.title")}
        description={t(
          "screens.settings.billSplitter.clear.confirm.description",
        )}
        confirmLabel={t("common.actions.clear")}
        variant="destructive"
        icon="trash"
      />
    </View>
  )
}

const EnhancedBillSplitter = withObservables([], () => ({
  accounts: observeAccounts(),
}))(BillSplitterContent)

export default function BillSplitterScreen() {
  return <EnhancedBillSplitter />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },

  // Header
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 4,
  },
  headerButton: {
    padding: 6,
    borderRadius: theme.radius,
  },

  // Account picker block (trigger + inline list)
  accountPickerBlock: {
    marginTop: 16,
  },
  accountTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: theme.radius,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    borderStyle: "dashed",
  },
  accountTriggerSelected: {
    borderStyle: "solid",
    borderColor: theme.colors.primary,
  },
  accountTriggerContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  accountTriggerName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  accountTriggerBalance: {
    fontSize: 13,
    color: theme.colors.customColors.semi,
  },
  accountTriggerPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.customColors.semi,
  },
  chevron: {
    opacity: 0.7,
    alignSelf: "center",
  },

  // Inline account picker dropdown
  inlineAccountPicker: {
    marginTop: 8,
    maxHeight: 280,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  pickerSearchInput: {
    marginBottom: 8,
  },
  pickerList: {},
  accountPickerRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: theme.radius,
  },
  accountPickerRowSelected: {
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.radius,
  },
  accountPickerRowContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  accountPickerRowName: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    minWidth: 0,
  },
  accountPickerRowBalance: {
    fontSize: 13,
  },

  // Hero total display
  heroContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 4,
  },
  heroAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  heroOf: {
    fontSize: 16,
    color: theme.colors.onSecondary,
  },
  heroTotal: {
    fontSize: 16,
    color: theme.colors.onSecondary,
  },

  // Progress bar
  progressTrack: {
    marginTop: 12,
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: `${theme.colors.onSurface}15`,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },

  // Participants chip
  participantsChip: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
    alignSelf: "center",
  },
  participantsChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.onSecondary,
  },

  // Items list
  listContent: {
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 96,
    gap: 12,
  },
  listContentWithSummary: {
    // Extra room so content clears the summary button + FAB
    paddingBottom: 160,
  },
  separator: {
    height: 0,
  },

  // Summary bottom button
  summaryButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.onSurface}10`,
  },
  summaryButton: {
    flex: 1,
    height: 48,
  },
  summaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  // Raise FAB above the summary button strip (height 88 = 48 button + 20 pad + 8 top pad + 12 gap)
  fabAboveSummary: {
    bottom: 100,
  },
}))
