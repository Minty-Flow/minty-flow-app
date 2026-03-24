import { withObservables } from "@nozbe/watermelondb/react"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet } from "react-native-unistyles"
import { startWith } from "rxjs"

import { ConfirmModal } from "~/components/confirm-modal"
import { InfoModal } from "~/components/info-modal"
import { MonthYearPicker } from "~/components/month-year-picker"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { View } from "~/components/ui/view"
import { getMonthRange } from "~/database/services/account-service"
import { observeCategoriesByType } from "~/database/services/category-service"
import { observeTags } from "~/database/services/tag-service"
import {
  destroyTransactionModel,
  observeTransactionModelsFull,
  restoreTransactionModel,
  type TransactionWithRelations,
} from "~/database/services/transaction-service"
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
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"
import { buildTransactionListFilters } from "~/utils/transaction-list-utils"

const EMPTY_TRANSACTIONS: TransactionWithRelations[] = []
const EMPTY_CATEGORIES: Category[] = []
const EMPTY_TAGS: Tag[] = []

interface TrashScreenInnerProps {
  transactionsFull: TransactionWithRelations[]
  categoriesExpense: Category[]
  categoriesIncome: Category[]
  categoriesTransfer: Category[]
  tags: Tag[]
  selectedYear: number
  selectedMonth: number
  onMonthYearChange: (year: number, month: number) => void
  filterState: TransactionListFilterState
  onFilterChange: (state: TransactionListFilterState) => void
  searchState: SearchState
  onSearchApply: (state: SearchState) => void
}

function TrashScreenInner({
  transactionsFull = EMPTY_TRANSACTIONS,
  categoriesExpense = EMPTY_CATEGORIES,
  categoriesIncome = EMPTY_CATEGORIES,
  categoriesTransfer = EMPTY_CATEGORIES,
  tags = EMPTY_TAGS,
  selectedYear,
  selectedMonth,
  onMonthYearChange,
  filterState,
  onFilterChange,
  searchState,
  onSearchApply,
}: TrashScreenInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)
  const [pendingDestroyItem, setPendingDestroyItem] =
    useState<TransactionWithRelations | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showSwipeInfo, setShowSwipeInfo] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setShowSwipeInfo(true)}
            accessibilityLabel={t("screens.settings.trash.a11y.infoButton")}
          >
            <IconSvg name="info-circle" size={20} />
          </Button>
          <Button
            variant={"ghost"}
            size="icon"
            onPress={() => setShowFilters((v) => !v)}
          >
            <IconSvg name={showFilters ? "filter-off" : "filter"} size={20} />
          </Button>
        </View>
      ),
    })
  }, [navigation, showFilters, t])

  const categoriesByType = useMemo(
    () => ({
      expense: categoriesExpense,
      income: categoriesIncome,
      transfer: categoriesTransfer,
    }),
    [categoriesExpense, categoriesIncome, categoriesTransfer],
  )

  const handlePress = useCallback(
    (item: TransactionWithRelations) => () => {
      router.push(`/transaction/${item.transaction.id}`)
    },
    [router],
  )

  const handleDestroy = useCallback(
    (item: TransactionWithRelations) => () => {
      setPendingDestroyItem(item)
    },
    [],
  )

  const handleRestore = useCallback(
    (item: TransactionWithRelations) => async () => {
      try {
        await restoreTransactionModel(item.transaction)
        Toast.success({
          title: t("components.transactionForm.toast.restored"),
          description: t(
            "components.transactionForm.toast.restoredDescription",
          ),
        })
      } catch (e) {
        logger.error("Failed to restore transaction", { error: String(e) })
        Toast.error({
          title: t("common.toast.error"),
          description: t("components.transactionForm.toast.restoreFailed"),
        })
      }
    },
    [t],
  )

  const handleConfirmDestroy = useCallback(async () => {
    if (!pendingDestroyItem) return
    const item = pendingDestroyItem
    try {
      await destroyTransactionModel(item.transaction)
      setPendingDestroyItem(null)
      Toast.success({
        title: t("common.toast.deleted"),
        description: t("components.transactionForm.toast.deletedDescription"),
      })
    } catch (e) {
      logger.error("Failed to destroy transaction", { error: String(e) })
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.transactionForm.toast.deleteFailed"),
      })
    }
  }, [pendingDestroyItem, t])

  const renderItem = useCallback(
    ({ item }: { item: TransactionWithRelations }) => (
      <TransactionItem
        transactionWithRelations={item}
        onPress={handlePress(item)}
        onDelete={handleDestroy(item)}
        onRestore={handleRestore(item)}
        onWillOpen={(methods) => {
          openSwipeableRef.current?.close()
          openSwipeableRef.current = methods
        }}
        rightActionAccessibilityLabel={t(
          "screens.settings.trash.a11y.moveToTrash",
        )}
        leftActionAccessibilityLabel={t("screens.settings.trash.a11y.restore")}
      />
    ),
    [handlePress, handleDestroy, handleRestore, t],
  )

  const keyExtractor = useCallback(
    (item: TransactionWithRelations) => item.transaction.id,
    [],
  )

  return (
    <View style={styles.container}>
      <MonthYearPicker
        initialYear={selectedYear}
        initialMonth={selectedMonth}
        onSelect={(y, m) => {
          onMonthYearChange(y, m)
        }}
      />

      {/* Filter header (when More options is on) */}
      {showFilters && (
        <TransactionFilterHeader
          accounts={[]}
          categoriesByType={categoriesByType}
          tags={tags}
          filterState={filterState}
          onFilterChange={onFilterChange}
          searchState={searchState}
          onSearchApply={onSearchApply}
          hiddenFilters={["accounts"]}
        />
      )}

      <FlatList
        contentContainerStyle={[
          styles.content,
          transactionsFull.length === 0 && styles.contentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyStateWrapper}>
            <EmptyState
              icon="trash-off"
              title={t("screens.settings.trash.empty.noTransactions")}
            />
          </View>
        }
        data={transactionsFull}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <ConfirmModal
        visible={pendingDestroyItem !== null}
        onRequestClose={() => setPendingDestroyItem(null)}
        onConfirm={handleConfirmDestroy}
        title={t("common.modals.deletePermanently")}
        description={t("components.transactionForm.destroyModal.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash"
      />
      <InfoModal
        visible={showSwipeInfo}
        onRequestClose={() => setShowSwipeInfo(false)}
        title={t("screens.settings.trash.swipeInfo.title")}
        description={t("screens.settings.trash.swipeInfo.description")}
      />
    </View>
  )
}

const EnhancedTrashScreen = withObservables(
  ["selectedYear", "selectedMonth", "filterState", "searchState"],
  ({
    selectedYear,
    selectedMonth,
    filterState,
    searchState,
  }: {
    selectedYear: number
    selectedMonth: number
    filterState: TransactionListFilterState
    searchState: SearchState
  }) => {
    const { fromDate, toDate } = getMonthRange(selectedYear, selectedMonth)
    const queryFilters = buildTransactionListFilters(filterState, {
      fromDate,
      toDate,
      search: searchState.query,
      searchMatchType: searchState.matchType,
      searchIncludeNotes: searchState.includeNotes,
    })
    return {
      transactionsFull: observeTransactionModelsFull({
        ...queryFilters,
        deletedOnly: true,
      }).pipe(startWith([] as TransactionWithRelations[])),
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
)(TrashScreenInner)

export default function TrashScreen() {
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

  const handleMonthYearChange = (year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  return (
    <EnhancedTrashScreen
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      onMonthYearChange={handleMonthYearChange}
      filterState={filterState}
      onFilterChange={setFilterState}
      searchState={searchState}
      onSearchApply={setSearchState}
    />
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
  emptyStateWrapper: {
    marginHorizontal: 20,
  },
}))
