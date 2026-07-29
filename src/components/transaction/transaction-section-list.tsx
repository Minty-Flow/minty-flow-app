/**
 * Reusable transaction SectionList with filtering, grouping, section headers,
 * swipe-to-delete, and optional upcoming transactions section.
 *
 * Used by both the home screen and the account detail screen.
 */
import { useRouter } from "expo-router"
import { type ComponentType, Fragment, type ReactElement, useRef } from "react"
import { useTranslation } from "react-i18next"
import { SectionList } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { UpcomingTransactionsSection } from "~/components/transaction/upcoming-transactions-section"
import { EmptyState } from "~/components/ui/empty-state"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
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
export function TransactionSectionList({
  transactionsFull,
  filterState,
  searchState = DEFAULT_SEARCH_STATE,
  showUpcoming = true,
  ListHeaderComponent,
}: TransactionSectionListProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)
  const list = transactionsFull ?? []
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  // Pending rows live in the Upcoming section only under "all"; the "pending"
  // and "notPending" filters route them through the main list (or hide them),
  // so the Upcoming section is suppressed to avoid rendering a row twice.
  const upcomingVisible =
    showUpcoming && filterState.pendingFilter === PendingOptionsEnum.ALL
  // Recurring instances render in the upcoming section, never the main list.
  // Pending visibility follows the pending filter; structural filters apply on top.
  const filtered = (() => {
    const withoutRecurring = list.filter((r) => !r.extra?.recurringId)
    const byPending = applyPendingFilter(
      withoutRecurring,
      filterState.pendingFilter,
    )
    const byFilters = applyTransactionFilters(byPending, filterState)
    return applySearch(byFilters, searchState)
  })()
  const listForSections = applyTransferLayout(filtered, transferLayout)
  const sections = buildTransactionSections(
    listForSections,
    filterState.groupBy,
    t("components.filters.groupByOptions.allTime"),
  )
  const handleOnTransactionPress = (transactionId: string) => {
    router.push({
      pathname: "/transaction/[id]",
      params: { id: transactionId },
    })
  }
  // TransactionItem handles transfer vs non-transfer delete (modal + deleteTransfer or deleteTransactionModel); we only close the swipeable.
  const handleDeleteDone = () => {
    openSwipeableRef.current?.close()
  }
  const renderHeader = () => (
    <>
      {ListHeaderComponent != null &&
        (typeof ListHeaderComponent === "function" ? (
          <ListHeaderComponent />
        ) : (
          ListHeaderComponent
        ))}
      {upcomingVisible && (
        <UpcomingTransactionsSection
          transactions={transactionsFull ?? []}
          onTransactionPress={handleOnTransactionPress}
        />
      )}
    </>
  )
  const renderEmptyList = () => (
    <View style={styles.emptyStateWrapper}>
      <EmptyState
        icon="receipt-outline"
        title={t("screens.home.emptyState.title")}
        description={t("components.transactionList.emptyDescription")}
      />
    </View>
  )
  const renderItem = ({ item }: { item: TransactionWithRelations }) => (
    <TransactionItem
      transactionWithRelations={item as TransactionWithRelations}
      onPress={() => handleOnTransactionPress(item.id)}
      onDelete={handleDeleteDone}
      onWillOpen={(methods) => {
        if (openSwipeableRef.current !== methods) {
          openSwipeableRef.current?.close()
        }
        openSwipeableRef.current = methods
      }}
    />
  )
  const keyExtractor = (item: TransactionWithRelations) => item.id
  return (
    <SectionList
      sections={sections}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyList}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => {
        const s = section as unknown as {
          title: string
          data: TransactionWithRelations[]
          totals: Record<string, number>
        }
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
