/**
 * Reusable transaction SectionList with filtering, grouping, section headers,
 * swipe-to-delete, and optional upcoming transactions section.
 *
 * Used by both the home screen and the account detail screen.
 */
import { useRouter } from "expo-router"
import {
  type ComponentProps,
  type ComponentType,
  Fragment,
  memo,
  type ReactElement,
  useCallback,
  useMemo,
} from "react"
import { useTranslation } from "react-i18next"
import { SectionList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { UpcomingTransactionsSection } from "~/components/transaction/upcoming-transactions-section"
import { EmptyState } from "~/components/ui/empty-state"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import { useSingleOpenSwipeable } from "~/hooks/use-transaction-list-state"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import type {
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  DEFAULT_SEARCH_STATE,
  PendingOptionsEnum,
} from "~/types/transaction-filters"
import {
  applyPendingFilter,
  applySearch,
  applyTransactionFilters,
  applyTransferLayout,
  buildTransactionSections,
  type TransactionSection,
} from "~/utils/transaction-list-utils"

interface TransactionSectionListProps {
  /** All transactions including pending/upcoming. Used for filtering + upcoming section. */
  transactionsFull: TransactionWithRelations[]
  /** Current filter state. */
  filterState: TransactionListFilterState
  /** Current search state; defaults to an empty search. */
  searchState?: SearchState
  /** Whether to show the upcoming transactions section above the list. */
  showUpcoming?: boolean
  /** Additional content rendered at the top of the list (before upcoming). */
  ListHeaderComponent?: ComponentType<unknown> | ReactElement | null
}
interface TransactionRowProps {
  item: TransactionWithRelations
  onPressId: (transactionId: string) => void
  onDelete: () => void
  onWillOpen: ComponentProps<typeof TransactionItem>["onWillOpen"]
}

// Stable props let React skip rows whose data did not change (search typing,
// filter toggles, unrelated parent state).
const TransactionRow = memo(function TransactionRow({
  item,
  onPressId,
  onDelete,
  onWillOpen,
}: TransactionRowProps) {
  const handlePress = useCallback(
    () => onPressId(item.id),
    [onPressId, item.id],
  )
  return (
    <TransactionItem
      transactionWithRelations={item}
      onPress={handlePress}
      onDelete={onDelete}
      onWillOpen={onWillOpen}
    />
  )
})

const keyExtractor = (item: TransactionWithRelations) => item.id

export function TransactionSectionList({
  transactionsFull,
  filterState,
  searchState = DEFAULT_SEARCH_STATE,
  showUpcoming = true,
  ListHeaderComponent,
}: TransactionSectionListProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { onWillOpen: handleWillOpen, closeOpen: closeOpenSwipeable } =
    useSingleOpenSwipeable()
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  // Pending rows live in the Upcoming section only under "all"; the "pending"
  // and "notPending" filters route them through the main list (or hide them),
  // so the Upcoming section is suppressed to avoid rendering a row twice.
  const upcomingVisible =
    showUpcoming && filterState.pendingFilter === PendingOptionsEnum.ALL
  const allTimeLabel = t("components.filters.groupByOptions.allTime")
  // Recurring instances render in the upcoming section, never the main list.
  // Pending visibility follows the pending filter; structural filters apply on top.
  const sections = useMemo(() => {
    const withoutRecurring = transactionsFull.filter(
      (r) => !r.extra?.recurringId,
    )
    const byPending = applyPendingFilter(
      withoutRecurring,
      filterState.pendingFilter,
    )
    const byFilters = applyTransactionFilters(byPending, filterState)
    const filtered = applySearch(byFilters, searchState)
    return buildTransactionSections(
      applyTransferLayout(filtered, transferLayout),
      filterState.groupBy,
      allTimeLabel,
    )
  }, [transactionsFull, filterState, searchState, transferLayout, allTimeLabel])
  const handleOnTransactionPress = useCallback(
    (transactionId: string) => {
      router.push({
        pathname: "/transaction/[id]",
        params: { id: transactionId },
      })
    },
    [router],
  )
  // TransactionItem handles transfer vs non-transfer delete (modal + deleteTransfer or deleteTransactionModel); we only close the swipeable.
  const handleDeleteDone = closeOpenSwipeable
  // Elements, not render functions: a new function type each render would
  // remount the header and lose its state (summary, upcoming sheets).
  const header = (
    <>
      {ListHeaderComponent != null &&
        (typeof ListHeaderComponent === "function" ? (
          <ListHeaderComponent />
        ) : (
          ListHeaderComponent
        ))}
      {upcomingVisible && (
        <UpcomingTransactionsSection
          transactions={transactionsFull}
          onTransactionPress={handleOnTransactionPress}
        />
      )}
    </>
  )
  const emptyList = (
    <View style={styles.emptyStateWrapper}>
      <EmptyState
        icon="receipt-outline"
        title={t("screens.home.emptyState.title")}
        description={t("components.transactionList.emptyDescription")}
      />
    </View>
  )
  const renderItem = useCallback(
    ({ item }: { item: TransactionWithRelations }) => (
      <TransactionRow
        item={item}
        onPressId={handleOnTransactionPress}
        onDelete={handleDeleteDone}
        onWillOpen={handleWillOpen}
      />
    ),
    [handleOnTransactionPress, handleDeleteDone, handleWillOpen],
  )
  return (
    <SectionList<TransactionWithRelations, TransactionSection>
      sections={sections}
      ListHeaderComponent={header}
      ListEmptyComponent={emptyList}
      keyExtractor={keyExtractor}
      initialNumToRender={12}
      windowSize={7}
      maxToRenderPerBatch={10}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => {
        const s = section
        if (!s.title && s.data.length === 0) return null
        return (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text variant="large" style={styles.sectionTitle}>
                {s.title}
              </Text>
              <View style={styles.sectionDivider} />
            </View>
            <View style={styles.sectionTotalsContainer}>
              <View style={styles.totalsContainer}>
                {Object.entries(s.totals).map(([curr, total], idx) => (
                  <Fragment key={curr + idx.toString()}>
                    <Text variant="small" style={styles.sectionTotal}>
                      {idx > 0 && "|"}
                    </Text>
                    <Money
                      variant="small"
                      style={styles.sectionTotal}
                      value={total}
                      currency={curr}
                      tone="auto"
                      visualTone="transfer"
                      showSign
                    />
                  </Fragment>
                ))}
              </View>
              <Text variant="small" style={styles.sectionTotal}>
                {t("components.transactionList.transactionCount", {
                  count: s.data.length,
                })}
              </Text>
            </View>
          </View>
        )
      }}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  )
}
const styles = StyleSheet.create((theme) => ({
  listContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  emptyStateWrapper: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
  },
  sectionTotalsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  totalsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 1,
    gap: 8,
  },
  sectionTotal: {
    flexShrink: 0,
    fontWeight: "700",
    color: theme.colors.onSecondary,
    fontSize: theme.typography.labelMedium.fontSize,
  },
}))
