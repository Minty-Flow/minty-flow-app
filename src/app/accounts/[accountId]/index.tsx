import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { DynamicIcon } from "~/components/dynamic-icon"
import { FilterToggleButton } from "~/components/filter-toggle-button"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { MonthYearPicker } from "~/components/month-year-picker"
import { RouteLoadingState } from "~/components/route-load-state"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useAccount } from "~/database/drizzle/read-models/account-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import {
  destroyAccount,
  unarchiveAccount,
} from "~/database/services/account-service"
import {
  useSelectedMonth,
  useTransactionListFilters,
} from "~/hooks/use-transaction-list-state"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"
export default function AccountDetailsScreen() {
  const { accountId } = useLocalSearchParams<{
    accountId: string
  }>()
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const month = useSelectedMonth()
  const {
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    showFilters,
    toggleFilters,
  } = useTransactionListFilters()
  const [unarchiveSheetVisible, setUnarchiveSheetVisible] = useState(false)
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false)
  const account = useAccount(accountId ?? "")
  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )
  const { items: transactionsFull } = useTransactions(
    accountId
      ? {
          accountIds: [accountId],
          from: month.from,
          to: month.to,
        }
      : {},
  )
  const { monthIn, monthOut, monthNet } = (() => {
    let in_ = 0
    let out = 0
    for (const t of transactionsFull) {
      if (t.isPending || t.isDeleted) continue
      // Loan cash flows (opening entry + repayments) are not generic income/expense.
      if (t.loanId != null) continue
      if (t.type === TransactionTypeEnum.INCOME) {
        in_ += t.amount
      } else if (t.type === TransactionTypeEnum.EXPENSE) {
        if (t.subtype === TransactionSubTypeEnum.REFUND) {
          out -= t.amount
        } else {
          out += t.amount
        }
      } else if (!excludeFromTotals && t.isTransfer) {
        if (t.amount > 0) in_ += t.amount
        else out += Math.abs(t.amount)
      }
    }
    return { monthIn: in_, monthOut: out, monthNet: in_ - out }
  })()
  const isArchived = account?.isArchived ?? false
  const handleDelete = async () => {
    if (!accountId) return
    try {
      await destroyAccount(accountId)
      router.back()
    } catch (error) {
      logger.error("Error deleting account", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("screens.accounts.form.toast.deleteFailed"),
      })
    }
  }
  const handleUnarchive = async () => {
    if (!accountId) return
    try {
      await unarchiveAccount(accountId)
      Toast.success({ title: t("screens.accounts.unarchiveSuccess") })
    } catch (error) {
      logger.error("Error unarchiving account", { error })
      Toast.error({ title: t("common.toast.error") })
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: account?.name ?? "",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <FilterToggleButton active={showFilters} onPress={toggleFilters} />
          {isArchived ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setDeleteSheetVisible(true)}
              >
                <IconSvg name="trash-outline" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setUnarchiveSheetVisible(true)}
              >
                <IconSvg name="archive-off-outline" size={20} />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onPress={() =>
                router.push({
                  pathname: "/accounts/[accountId]/modify",
                  params: { accountId: account?.id ?? "" },
                })
              }
            >
              <IconSvg name="pencil-outline" size={20} />
            </Button>
          )}
        </View>
      ),
    })
  }, [
    navigation,
    router,
    account?.id,
    account?.name,
    showFilters,
    isArchived,
    toggleFilters,
  ])
  if (!account) {
    return <RouteLoadingState />
  }
  const typeLabel = account.type.charAt(0).toUpperCase() + account.type.slice(1)
  const headerContent = (
    <>
      {/* Account Header Card */}
      <View style={styles.headerCard}>
        {/* Top Row: Icon + Name/Meta */}
        <View style={styles.headerTopRow}>
          <DynamicIcon
            icon={account.icon || "wallet-outline"}
            size={48}
            variant="badge"
            colorScheme={account.colorScheme}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{typeLabel}</Text>
              {account.isPrimary && (
                <>
                  <Text style={styles.metaSeparator}>/</Text>
                  <IconSvg
                    name="star-outline"
                    size={14}
                    color={theme.colors.semantic.warning}
                  />
                  <Text style={styles.primaryText}>
                    {t("screens.accounts.card.primary")}
                  </Text>
                </>
              )}
              {isArchived && (
                <>
                  <Text style={styles.metaSeparator}>/</Text>
                  <View style={styles.archivedContainer}>
                    <IconSvg name="archive-outline" size={14} />
                    <Text style={styles.archivedText}>
                      {t("screens.accounts.card.archived")}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>
            {t("screens.accounts.card.currentBalance")}
          </Text>
          <View style={styles.balanceRow}>
            <Money
              value={account.balance}
              currency={account.currencyCode}
              style={styles.balanceAmount}
            />
            <Text style={styles.currencyCode}>{account.currencyCode}</Text>
          </View>
        </View>
      </View>

      {/* Summary: Income & Expenses as side-by-side pill cards, Net in separate card below */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryPillCard}>
          <Money
            value={monthIn}
            currency={account.currencyCode}
            visualTone={TransactionTypeEnum.INCOME}
            style={styles.summaryPillAmount}
          />
        </View>
        <View style={styles.summaryPillCard}>
          <Money
            value={monthOut}
            currency={account.currencyCode}
            tone={TransactionTypeEnum.EXPENSE}
            style={styles.summaryPillAmount}
          />
        </View>
      </View>
      <View style={styles.summaryNetCard}>
        <Text style={styles.summaryNetLabel}>
          {t("screens.accounts.card.netThisMonth")}
        </Text>
        <Money
          value={monthNet}
          currency={account.currencyCode}
          tone={
            monthNet >= 0
              ? TransactionTypeEnum.INCOME
              : TransactionTypeEnum.EXPENSE
          }
          showSign
          style={styles.summaryNetAmount}
        />
      </View>
    </>
  )
  return (
    <View style={styles.container}>
      <MonthYearPicker
        initialYear={month.year}
        initialMonth={month.month}
        onSelect={month.onSelect}
      />

      {showFilters && (
        <TransactionFilterHeader
          accounts={[]}
          filterState={filterState}
          onFilterChange={setFilterState}
          searchState={searchState}
          onSearchApply={setSearchState}
          hiddenFilters={["accounts"]}
        />
      )}

      <TransactionSectionList
        transactionsFull={transactionsFull}
        filterState={filterState}
        searchState={searchState}
        showUpcoming
        ListHeaderComponent={headerContent}
      />

      <ConfirmSheet
        visible={unarchiveSheetVisible}
        onRequestClose={() => setUnarchiveSheetVisible(false)}
        onConfirm={handleUnarchive}
        title={t("screens.accounts.form.archiveSheet.unarchiveTitle")}
        description={account.name}
        confirmLabel={t("screens.accounts.form.archiveSheet.unarchiveConfirm")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
        icon="archive-off-outline"
      />

      <ConfirmSheet
        visible={deleteSheetVisible}
        onRequestClose={() => setDeleteSheetVisible(false)}
        onConfirm={handleDelete}
        title={t("screens.accounts.form.deleteSheet.title", {
          name: account.name,
        })}
        description={t("screens.accounts.form.deleteSheet.descriptionEmpty")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />
    </View>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  // ── Header Card ──────────────────────────────────────────────
  headerCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 20,
    gap: 15,
    marginHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: theme.colors.secondary,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
    backgroundColor: theme.colors.secondary,
  },
  accountName: {
    ...theme.typography.headlineSmall,
    fontWeight: "700",
    color: theme.colors.onSecondary,
  },
  metaRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "500",
    color: theme.colors.semantic.semi,
  },
  metaSeparator: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.semantic.semi,
    marginHorizontal: 2,
  },
  primaryText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.semantic.warning,
  },
  archivedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  archivedText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  balanceSection: {
    gap: 4,
    paddingTop: 4,
    backgroundColor: theme.colors.secondary,
  },
  balanceLabel: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
    letterSpacing: 1,
  },
  balanceRow: {
    backgroundColor: theme.colors.secondary,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  balanceAmount: {
    fontSize: theme.typography.displayMedium.fontSize,
    lineHeight: theme.typography.displayMedium.fontSize * 1.2,
    fontWeight: "700",
    color: theme.colors.onSecondary,
    letterSpacing: -0.5,
    marginVertical: 0,
  },
  currencyCode: {
    ...theme.typography.titleSmall,
    color: theme.colors.semantic.semi,
  },
  // ── Summary: Income & Expense pills + Net card ─────────────────
  summaryRow: {
    flexDirection: "row",
    marginVertical: 5,
    gap: 5,
    marginHorizontal: 20,
  },
  summaryPillCard: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryPillAmount: {
    ...theme.typography.titleSmall,
    fontWeight: "700",
  },
  summaryNetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  summaryNetLabel: {
    ...theme.typography.labelLarge,
    color: theme.colors.onSecondary,
  },
  summaryNetAmount: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
  },
}))
