import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
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
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { useProfileImage } from "~/hooks/use-profile-image"
import { useDayKey } from "~/hooks/use-time-reactivity"
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
import {
  applyFiltersAndSearch,
  buildQueryFilters,
  hasActiveFilters,
} from "~/utils/transaction-list-utils"

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
  const image = useProfileImage()
  const accounts = useActiveAccounts()
  // dayKey re-bumps on app-foreground and at each date change, so "this month"
  // re-derives after a month rollover instead of serving a memoized stale range.
  const dayKey = useDayKey()
  const { fromDate, toDate } = useMemo(
    () => buildQueryFilters(selectedRange, homeTimeframe, dayKey),
    [selectedRange, homeTimeframe, dayKey],
  )
  const { items: transactionsFull, status: transactionsStatus } =
    useTransactions({
      from: new Date(fromDate).toISOString(),
      to: new Date(toDate).toISOString(),
    })
  // The summary describes the rows the filters keep, like the list below it.
  const filteredTransactions = useMemo(
    () => applyFiltersAndSearch(transactionsFull, filterState, searchState),
    [transactionsFull, filterState, searchState],
  )
  const summaryHeader = (
    <SummarySection
      transactionsWithRelations={filteredTransactions}
      filtered={hasActiveFilters(filterState, searchState)}
    />
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
            {profileName.trim()
              ? t("profile.greetingWithName", { name: profileName.trim() })
              : t("profile.greeting")}
          </Text>
        </Pressable>

        <PrivacyEyeControl />
      </View>

      {/* Inline filter header: pill bar + expandable filter panels */}
      <TransactionFilterHeader
        accounts={accounts}
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
        upcomingHorizonDays={homeTimeframe}
        ListHeaderComponent={summaryHeader}
      />
    </View>
  )
}
export default HomeScreen
const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    marginHorizontal: 20,
    // Below the status bar / notch whatever the device.
    marginTop: rt.insets.top + 12,
    marginBottom: 20,
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
