import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet } from "react-native-unistyles"

import { MonthYearPicker } from "~/components/month-year-picker"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import { getMonthRange } from "~/database/services-sqlite/account-service"
import { useCategoriesByType } from "~/stores/db/category.store"
import { useTags } from "~/stores/db/tag.store"
import { useTransactions } from "~/stores/db/transaction.store"
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
  applySearch,
  applyTransactionFilters,
} from "~/utils/transaction-list-utils"

export default function PendingTransactionsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)

  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  )
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth(),
  )
  const [filterState, setFilterState] = useState<TransactionListFilterState>(
    DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  )
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE)
  const [showFilters, setShowFilters] = useState(false)

  const categoriesExpense = useCategoriesByType(TransactionTypeEnum.EXPENSE)
  const categoriesIncome = useCategoriesByType(TransactionTypeEnum.INCOME)
  const categoriesTransfer = useCategoriesByType(TransactionTypeEnum.TRANSFER)
  const tags = useTags()

  const { fromDate, toDate } = useMemo(
    () => getMonthRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  )

  const { items: allPending } = useTransactions({
    from: new Date(fromDate).toISOString(),
    to: new Date(toDate).toISOString(),
    isPending: true,
  })

  const transactionsFull = useMemo(
    () =>
      applySearch(
        applyTransactionFilters(allPending, filterState),
        searchState,
      ),
    [allPending, filterState, searchState],
  )

  const categoriesByType = useMemo(
    () => ({
      expense: categoriesExpense,
      income: categoriesIncome,
      transfer: categoriesTransfer,
    }),
    [categoriesExpense, categoriesIncome, categoriesTransfer],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant={"ghost"}
          size="icon"
          onPress={() => setShowFilters((v) => !v)}
        >
          <IconSvg
            name={showFilters ? "filter-2-x-outline" : "filter-2-outline"}
            size={20}
          />
        </Button>
      ),
    })
  }, [navigation, showFilters])

  const handleDeleteDone = useCallback(() => {
    openSwipeableRef.current?.close()
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: TransactionWithRelations }) => (
      <TransactionItem
        transactionWithRelations={item}
        onPress={() => router.push(`/transaction/${item.id}`)}
        onDelete={handleDeleteDone}
        onWillOpen={(methods) => {
          openSwipeableRef.current?.close()
          openSwipeableRef.current = methods
        }}
      />
    ),
    [router, handleDeleteDone],
  )

  const keyExtractor = useCallback(
    (item: TransactionWithRelations) => item.id,
    [],
  )

  return (
    <View style={styles.container}>
      <MonthYearPicker
        initialYear={selectedYear}
        initialMonth={selectedMonth}
        onSelect={(y, m) => {
          setSelectedYear(y)
          setSelectedMonth(m)
        }}
      />

      {showFilters && (
        <TransactionFilterHeader
          accounts={[]}
          categoriesByType={categoriesByType}
          tags={tags}
          filterState={filterState}
          onFilterChange={setFilterState}
          searchState={searchState}
          onSearchApply={setSearchState}
          hiddenFilters={["accounts", "pending"]}
        />
      )}

      <FlatList
        contentContainerStyle={[
          styles.content,
          transactionsFull.length === 0 && styles.contentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.contentEmptyWrapper}>
            <EmptyState
              icon="history-toggle-outline"
              title={t("screens.settings.pending.empty")}
            />
          </View>
        }
        data={transactionsFull}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  contentEmptyWrapper: {
    marginHorizontal: 20,
  },
}))
