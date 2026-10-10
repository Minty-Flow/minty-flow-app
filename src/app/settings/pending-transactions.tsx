import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { FilterToggleButton } from "~/components/filter-toggle-button"
import { MonthYearPicker } from "~/components/month-year-picker"
import { RouteLoadingState } from "~/components/route-load-state"
import { DeleteRecurringSheet } from "~/components/transaction/delete-recurring-sheet"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { EmptyState } from "~/components/ui/empty-state"
import { View } from "~/components/ui/view"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import {
  useSelectedMonth,
  useSingleOpenSwipeable,
  useTransactionListFilters,
} from "~/hooks/use-transaction-list-state"
import {
  applySearch,
  applyTransactionFilters,
} from "~/utils/transaction-list-utils"
export default function PendingTransactionsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { onWillOpen: handleWillOpen, closeOpen: closeOpenSwipeable } =
    useSingleOpenSwipeable()
  const month = useSelectedMonth()
  const {
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    showFilters,
    toggleFilters,
  } = useTransactionListFilters()
  const [recurringToDelete, setRecurringToDelete] =
    useState<TransactionWithRelations | null>(null)
  const recurringRule = useRecurringRule(
    recurringToDelete?.extra?.recurringId ?? null,
  )
  const { items: allPending, status: transactionsStatus } = useTransactions({
    from: month.from,
    to: month.to,
    isPending: true,
  })
  const transactionsFull = applySearch(
    applyTransactionFilters(allPending, filterState),
    searchState,
  )
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FilterToggleButton active={showFilters} onPress={toggleFilters} />
      ),
    })
  }, [navigation, showFilters, toggleFilters])
  if (transactionsStatus === "loading" && allPending.length === 0)
    return <RouteLoadingState />
  const handleDeleteDone = () => {
    closeOpenSwipeable()
  }
  // Recurring spawns must route through the 3-option scope modal, not a plain
  // soft-delete — same guard the transaction form and Upcoming section use.
  const handleBeforeDelete = (row: TransactionWithRelations) => {
    if (row.extra?.recurringId) {
      setRecurringToDelete(row)
      return true
    }
    return false
  }
  const renderItem = ({ item }: { item: TransactionWithRelations }) => (
    <TransactionItem
      transactionWithRelations={item}
      onPress={() => router.push(`/transaction/${item.id}`)}
      onBeforeDelete={handleBeforeDelete}
      onDelete={handleDeleteDone}
      onWillOpen={handleWillOpen}
    />
  )
  const keyExtractor = (item: TransactionWithRelations) => item.id
  return (
    <View style={styles.container}>
      <MonthYearPicker
        allowFuture
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

      {recurringToDelete && recurringRule && (
        <DeleteRecurringSheet
          visible
          transaction={recurringToDelete}
          recurringRule={recurringRule}
          onRequestClose={() => setRecurringToDelete(null)}
          onDeleted={() => {
            setRecurringToDelete(null)
            closeOpenSwipeable()
          }}
        />
      )}
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
