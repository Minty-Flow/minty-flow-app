import { type Href, router } from "expo-router"
import { useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { CashFlowCard } from "~/components/stats/dashboard/cash-flow-card"
import {
  type StatsInsightsRoute,
  StatsInsightsSection,
} from "~/components/stats/dashboard/insights-section"
import { PaceCard } from "~/components/stats/dashboard/pace-card"
import { TopCategoriesCard } from "~/components/stats/dashboard/top-categories-card"
import { StatsCurrencyToggle } from "~/components/stats/stats-currency-toggle"
import { StatsEmptyState } from "~/components/stats/stats-empty-state"
import { StatsPendingNotice } from "~/components/stats/stats-pending-notice"
import { StatsPeriodHeader } from "~/components/stats/stats-period-header"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { View } from "~/components/ui/view"
import { useStats } from "~/database/drizzle/read-models/stats-read-model"
import { formatRangeLabel } from "~/utils/stats-date-range"

export default function StatsScreen() {
  const { theme } = useUnistyles()
  const {
    byCurrency,
    supplementByCurrency,
    isLoading,
    dateRange,
    activePreset,
    activeYear,
    activeMonth,
    setMonthRange,
    setCustomRange,
    navigate,
    refetch,
  } = useStats()

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

  const isFirstLoad = isLoading && byCurrency.length === 0
  const hasNoData = !isLoading && byCurrency.length === 0

  const stats =
    byCurrency.find((s) => s.currency === selectedCurrency) ?? byCurrency[0]
  const supplement = stats
    ? supplementByCurrency.find((s) => s.currency === stats.currency)
    : undefined

  type ScreensType = Extract<
    Href,
    | "/stats/categories"
    | "/stats/wrapped"
    | "/stats/cash-flow"
    | "/stats/net-worth"
    | "/stats/calendar"
  >

  const pushDetail = (screen: ScreensType | StatsInsightsRoute) =>
    router.push({
      pathname: screen,
      params: {
        preset: activePreset,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      },
    })

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && byCurrency.length > 0}
          onRefresh={refetch}
          tintColor={theme.colors.onPrimary}
          colors={[theme.colors.onPrimary]}
        />
      }
    >
      <StatsPeriodHeader
        activeYear={activeYear}
        activeMonth={activeMonth}
        activePreset={activePreset}
        dateRange={dateRange}
        setMonthRange={setMonthRange}
        setCustomRange={setCustomRange}
        navigate={navigate}
      />

      {isFirstLoad && (
        <View style={styles.loading}>
          <ActivityIndicatorMinty />
        </View>
      )}

      {hasNoData && (
        <StatsEmptyState
          rangeLabel={formatRangeLabel(dateRange)}
          scenario="noTransactionsEver"
        />
      )}

      {stats && (
        <>
          <View style={styles.toggleRow}>
            <StatsCurrencyToggle
              currencies={byCurrency.map((s) => s.currency)}
              value={stats.currency}
              onChange={setSelectedCurrency}
            />
          </View>

          <View style={styles.grid}>
            <StatsPendingNotice
              pendingSummary={stats.pendingSummary}
              currency={stats.currency}
            />

            <View style={styles.halfRow}>
              <CashFlowCard
                current={stats.current}
                currency={stats.currency}
                onPress={() => pushDetail("/stats/cash-flow")}
              />
              <PaceCard
                current={stats.current}
                previous={stats.previous}
                currency={stats.currency}
                onPress={() => pushDetail("/stats/cash-flow")}
              />
            </View>

            <TopCategoriesCard
              breakdown={stats.categoryBreakdown}
              currency={stats.currency}
              onPress={() => pushDetail("/stats/categories")}
            />
            <StatsInsightsSection
              stats={stats}
              supplement={supplement}
              dateRange={dateRange}
              onNavigate={pushDetail}
              showHeader
            />
          </View>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    marginTop: 50,
    gap: 6,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  grid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  halfRow: {
    flexDirection: "row",
    gap: 12,
  },
  bottomSpacer: {
    height: 100,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
  },
}))
