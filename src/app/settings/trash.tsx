import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { FilterToggleButton } from "~/components/filter-toggle-button"
import { IconSvg } from "~/components/icons"
import { InfoSheet } from "~/components/info-sheet"
import { MonthYearPicker } from "~/components/month-year-picker"
import { RouteLoadingState } from "~/components/route-load-state"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { View } from "~/components/ui/view"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import {
  destroyTransaction,
  restoreTransaction,
} from "~/database/services/ledger-service"
import {
  useSelectedMonth,
  useSingleOpenSwipeable,
  useTransactionListFilters,
} from "~/hooks/use-transaction-list-state"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"
import {
  applySearch,
  applyTransactionFilters,
  applyTransferLayout,
} from "~/utils/transaction-list-utils"

export default function TrashScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { onWillOpen: handleWillOpen } = useSingleOpenSwipeable()
  const month = useSelectedMonth()
  const {
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    showFilters,
    toggleFilters,
  } = useTransactionListFilters()
  const [pendingDestroyItem, setPendingDestroyItem] =
    useState<TransactionWithRelations | null>(null)
  const [showSwipeInfo, setShowSwipeInfo] = useState(false)
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  const { items: allDeleted, status: transactionsStatus } = useTransactions({
    from: month.from,
    to: month.to,
    deletedOnly: true,
  })
  const transactionsFull = applyTransferLayout(
    applySearch(applyTransactionFilters(allDeleted, filterState), searchState),
    transferLayout,
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
          <FilterToggleButton active={showFilters} onPress={toggleFilters} />
        </View>
      ),
    })
  }, [navigation, showFilters, t, toggleFilters])
  if (transactionsStatus === "loading" && allDeleted.length === 0)
    return <RouteLoadingState />
  const handleRestore = (item: TransactionWithRelations) => async () => {
    try {
      await restoreTransaction(item.id)
      Toast.success({
        title: t("components.transactionForm.toast.restored"),
        description: t("components.transactionForm.toast.restoredDescription"),
      })
    } catch (e) {
      logger.error("Failed to restore transaction", { error: String(e) })
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.transactionForm.toast.restoreFailed"),
      })
    }
  }
  const handleConfirmDestroy = async () => {
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
  }
  const renderItem = ({ item }: { item: TransactionWithRelations }) => (
    <TransactionItem
      transactionWithRelations={item}
      onPress={() => router.push(`/transaction/${item.id}`)}
      onDelete={() => setPendingDestroyItem(item)}
      onRestore={handleRestore(item)}
      onWillOpen={handleWillOpen}
      rightActionAccessibilityLabel={t(
        "screens.settings.trash.a11y.moveToTrash",
      )}
      leftActionAccessibilityLabel={t("screens.settings.trash.a11y.restore")}
    />
  )
  const keyExtractor = (item: TransactionWithRelations) => item.id
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
      <ConfirmSheet
        visible={pendingDestroyItem !== null}
        onRequestClose={() => setPendingDestroyItem(null)}
        onConfirm={handleConfirmDestroy}
        title={t("common.sheets.deletePermanently")}
        description={t("components.transactionForm.destroySheet.description")}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
        icon="trash-outline"
      />
      <InfoSheet
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
