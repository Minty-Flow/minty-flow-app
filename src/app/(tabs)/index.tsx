import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { PrivacyEyeControl } from "~/components/privacy-eye-control"
import { RouteLoadingState } from "~/components/route-load-state"
import { SummarySection } from "~/components/summary-card"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useCategoriesByType } from "~/database/drizzle/read-models/category-read-model"
import { useTags } from "~/database/drizzle/read-models/tag-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useProfileStore } from "~/stores/profile.store"
import type {
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
} from "~/types/transaction-filters"
import { TransactionTypeEnum } from "~/types/transactions"
import { buildQueryFilters } from "~/utils/transaction-list-utils"

function HomeScreen() {
  const [filterState, setFilterState] = useState<TransactionListFilterState>(
    DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  )
  const [selectedRange, setSelectedRange] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE)
  const homeTimeframe = usePendingTransactionsStore((s) => s.homeTimeframe)
  const { t } = useTranslation()
  const router = useRouter()
  const profileName = useProfileStore((s) => s.name)
  const image = useProfileStore((s) => s.imageUri)
  const accounts = useActiveAccounts()
  const categoriesExpense = useCategoriesByType(TransactionTypeEnum.EXPENSE)
  const categoriesIncome = useCategoriesByType(TransactionTypeEnum.INCOME)
  const categoriesTransfer = useCategoriesByType(TransactionTypeEnum.TRANSFER)
  const tags = useTags()
  const { fromDate, toDate } = buildQueryFilters(selectedRange, homeTimeframe)
  const { items: transactionsFull, status: transactionsStatus } =
    useTransactions({
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate).toISOString(),
    })
  const categoriesByType = {
    expense: categoriesExpense,
    income: categoriesIncome,
    transfer: categoriesTransfer,
  }
  const summaryHeader = (
    <SummarySection transactionsWithRelations={transactionsFull} />
  )
  if (transactionsStatus === "loading" && transactionsFull.length === 0)
    return <RouteLoadingState />
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push("/settings/edit-profile")}
          style={styles.greetingRow}
        >
          {image ? (
            <DynamicIcon icon={image} variant="raw" size={48} />
          ) : (
            <IconSvg name="user-outline" size={26} />
          )}
          <Text variant="large" style={styles.greetingText}>
            {t("profile.greeting")}, {profileName}!
          </Text>
        </Pressable>

        <PrivacyEyeControl />
      </View>

      {/* Inline filter header: pill bar + expandable filter panels */}
      <TransactionFilterHeader
        accounts={accounts}
        categoriesByType={categoriesByType}
        tags={tags}
        filterState={filterState}
        onFilterChange={setFilterState}
        selectedRange={selectedRange}
        onDateRangeChange={setSelectedRange}
        searchState={searchState}
        onSearchApply={setSearchState}
      />

      {/* Transactions List */}
      <TransactionSectionList
        transactionsFull={transactionsFull}
        filterState={filterState}
        searchState={searchState}
        showUpcoming
        ListHeaderComponent={summaryHeader}
      />
    </View>
  )
}
export default HomeScreen
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.radius,
    padding: 10,
  },
  greetingText: {
    fontWeight: "bold",
  },
}))
