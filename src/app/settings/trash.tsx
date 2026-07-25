import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { IconSvg } from "~/components/icons"
import { InfoModal } from "~/components/info-modal"
import { MonthYearPicker } from "~/components/month-year-picker"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import { getMonthRange } from "~/database/services-sqlite/account-service"
import {
  destroyTransaction,
  restoreTransaction,
} from "~/database/services-sqlite/transaction-service"
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
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"
import {
  applySearch,
  applyTransactionFilters,
} from "~/utils/transaction-list-utils"

export default function TrashScreen() {
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
  const [pendingDestroyItem, setPendingDestroyItem] =
    useState<TransactionWithRelations | null>(null)
  const [showSwipeInfo, setShowSwipeInfo] = useState(false)

  const categoriesExpense = useCategoriesByType(TransactionTypeEnum.EXPENSE)
  const categoriesIncome = useCategoriesByType(TransactionTypeEnum.INCOME)
  const categoriesTransfer = useCategoriesByType(TransactionTypeEnum.TRANSFER)
  const tags = useTags()

  const { fromDate, toDate } = useMemo(
    () => getMonthRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  )

  const { items: allDeleted } = useTransactions({
    from: new Date(fromDate).toISOString(),
    to: new Date(toDate).toISOString(),
    deletedOnly: true,
  })

  const transactionsFull = useMemo(
    () =>
      applySearch(
        applyTransactionFilters(allDeleted, filterState),
        searchState,
      ),
    [allDeleted, filterState, searchState],
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setShowSwipeInfo(true)}
            accessibilityLabel={t("screens.settings.trash.a11y.infoButton")}
          >
            <IconSvg name="info-circle-outline" size={20} />
          </Button>
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
        </View>
      ),
    })
  }, [navigation, showFilters, t])

  const handleRestore = useCallback(
    (item: TransactionWithRelations) => async () => {
      try {
        await restoreTransaction(item.id)
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
      await destroyTransaction(item.id)
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
        onPress={() => router.push(`/transaction/${item.id}`)}
        onDelete={() => setPendingDestroyItem(item)}
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
    [router, handleRestore, t],
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
          <View style={styles.emptyStateWrapper}>
            <EmptyState
              icon="trash-outline"
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
        icon="trash-outline"
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
