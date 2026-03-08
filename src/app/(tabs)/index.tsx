import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"
import { startWith } from "rxjs"

import { DynamicIcon } from "~/components/dynamic-icon"
import { PrivacyEyeControl } from "~/components/privacy-eye-control"
import { SummarySection } from "~/components/summary-card"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  observeAccountModels,
  observeAccounts,
} from "~/database/services/account-service"
import { observeCategoriesByType } from "~/database/services/category-service"
import { observeTags } from "~/database/services/tag-service"
import type { TransactionWithRelations } from "~/database/services/transaction-service"
import { observeTransactionModelsFull } from "~/database/services/transaction-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useProfileStore } from "~/stores/profile.store"
import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Tag } from "~/types/tags"
import type {
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
} from "~/types/transaction-filters"
import { TransactionTypeEnum } from "~/types/transactions"
import {
  buildQueryFilters,
  buildTransactionListFilters,
} from "~/utils/transaction-list-utils"

const EMPTY_TRANSACTIONS: TransactionWithRelations[] = []
const EMPTY_ACCOUNTS: Account[] = []
const EMPTY_CATEGORIES: Category[] = []
const EMPTY_TAGS: Tag[] = []

interface HomeScreenProps {
  transactionsFull?: TransactionWithRelations[] | null
  accounts?: Account[]
  categoriesExpense?: Category[]
  categoriesIncome?: Category[]
  categoriesTransfer?: Category[]
  tags?: Tag[]
  filterState?: TransactionListFilterState
  onFilterChange?: (state: TransactionListFilterState) => void
  selectedRange?: { start: Date; end: Date } | null
  onDateRangeChange?: (range: { start: Date; end: Date } | null) => void
  searchState?: SearchState
  onSearchApply?: (state: SearchState) => void
}

function HomeScreenInner({
  transactionsFull = EMPTY_TRANSACTIONS,
  accounts = EMPTY_ACCOUNTS,
  categoriesExpense = EMPTY_CATEGORIES,
  categoriesIncome = EMPTY_CATEGORIES,
  categoriesTransfer = EMPTY_CATEGORIES,
  tags = EMPTY_TAGS,
  filterState = DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  onFilterChange,
  selectedRange = null,
  onDateRangeChange,
  searchState = DEFAULT_SEARCH_STATE,
  onSearchApply,
}: HomeScreenProps) {
  const categoriesByType = useMemo(
    () => ({
      expense: categoriesExpense,
      income: categoriesIncome,
      transfer: categoriesTransfer,
    }),
    [categoriesExpense, categoriesIncome, categoriesTransfer],
  )
  const { t } = useTranslation()

  const filteredList = useMemo(() => transactionsFull ?? [], [transactionsFull])

  const router = useRouter()

  const profileName = useProfileStore((s) => s.name)
  const image = useProfileStore((s) => s.imageUri)

  const summaryHeader = useMemo(
    () => (
      <View style={styles.summaryContainer}>
        <SummarySection transactionsWithRelations={filteredList} />
      </View>
    ),
    [filteredList],
  )

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
            <IconSymbol name="account" size={24} />
          )}
          <Text variant="large" style={styles.greetingText}>
            {t("profile.greeting")}, {profileName}!
          </Text>
        </Pressable>

        <PrivacyEyeControl />
      </View>

      {/* Inline filter header: pill bar + expandable filter panels */}
      {onFilterChange ? (
        <TransactionFilterHeader
          accounts={accounts}
          categoriesByType={categoriesByType}
          tags={tags}
          filterState={filterState}
          onFilterChange={onFilterChange}
          selectedRange={selectedRange}
          onDateRangeChange={onDateRangeChange}
          searchState={searchState}
          onSearchApply={onSearchApply}
        />
      ) : null}

      {/* Transactions List */}
      <TransactionSectionList
        transactionsFull={transactionsFull ?? []}
        filterState={filterState}
        showUpcoming
        ListHeaderComponent={summaryHeader}
      />
    </View>
  )
}

const EnhancedHomeScreen = withObservables(
  ["selectedRange", "homeTimeframe", "filterState", "searchState"],
  ({
    selectedRange,
    homeTimeframe = 3,
    filterState,
    searchState,
  }: {
    selectedRange: { start: Date; end: Date } | null
    homeTimeframe?: number
    filterState: TransactionListFilterState
    searchState: SearchState
  }) => {
    const { fromDate, toDate } = buildQueryFilters(
      selectedRange ?? null,
      homeTimeframe,
    )
    const queryFilters = buildTransactionListFilters(filterState, {
      fromDate,
      toDate,
      search: searchState.query,
      searchMatchType: searchState.matchType,
      searchIncludeNotes: searchState.includeNotes,
    })
    return {
      transactionsFull: observeTransactionModelsFull(queryFilters, [
        observeAccountModels(false),
        observeCategoriesByType(TransactionTypeEnum.EXPENSE),
        observeCategoriesByType(TransactionTypeEnum.INCOME),
        observeCategoriesByType(TransactionTypeEnum.TRANSFER),
      ]).pipe(startWith([] as TransactionWithRelations[])),
      accounts: observeAccounts(false).pipe(startWith([] as Account[])),
      categoriesExpense: observeCategoriesByType(
        TransactionTypeEnum.EXPENSE,
      ).pipe(startWith([] as Category[])),
      categoriesIncome: observeCategoriesByType(
        TransactionTypeEnum.INCOME,
      ).pipe(startWith([] as Category[])),
      categoriesTransfer: observeCategoriesByType(
        TransactionTypeEnum.TRANSFER,
      ).pipe(startWith([] as Category[])),
      tags: observeTags().pipe(startWith([] as Tag[])),
    }
  },
)(HomeScreenInner)

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
  return (
    <EnhancedHomeScreen
      filterState={filterState}
      onFilterChange={setFilterState}
      selectedRange={selectedRange}
      homeTimeframe={homeTimeframe}
      onDateRangeChange={setSelectedRange}
      searchState={searchState}
      onSearchApply={setSearchState}
    />
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
    marginTop: 40,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.colors.radius,
    padding: 10,
  },
  greetingText: {
    fontWeight: "bold",
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
}))
