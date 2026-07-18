import { type Href, router } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { RefreshControl, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { CurrencySwitcher } from "~/components/stats/currency-switcher"
import { CalendarCard } from "~/components/stats/dashboard/calendar-card"
import { CashFlowCard } from "~/components/stats/dashboard/cash-flow-card"
import { NetWorthCard } from "~/components/stats/dashboard/net-worth-card"
import { PaceCard } from "~/components/stats/dashboard/pace-card"
import { StatCard } from "~/components/stats/dashboard/stat-card"
import { TopCategoriesCard } from "~/components/stats/dashboard/top-categories-card"
import { WrappedCard } from "~/components/stats/dashboard/wrapped-card"
import { StatsEmptyState } from "~/components/stats/stats-empty-state"
import { StatsPendingNotice } from "~/components/stats/stats-pending-notice"
import { StatsPeriodHeader } from "~/components/stats/stats-period-header"
import { StatsSkeleton } from "~/components/stats/stats-skeleton"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useStats } from "~/hooks/use-stats"
import { formatRangeLabel } from "~/utils/stats-date-range"
import { formatMonthName } from "~/utils/time-utils"

export default function StatsScreen() {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
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

  const pushDetail = (screen: ScreensType) =>
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

      {isFirstLoad && <StatsSkeleton />}

      {hasNoData && (
        <StatsEmptyState
          rangeLabel={formatRangeLabel(dateRange)}
          scenario="noTransactionsEver"
        />
      )}

      {stats && (
        <>
          <CurrencySwitcher
            currencies={byCurrency.map((s) => s.currency)}
            value={stats.currency}
            onChange={setSelectedCurrency}
          />

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

            <Text variant="h4" style={styles.sectionHeader}>
              {t("screens.stats.dashboard.insights")}
            </Text>

            <WrappedCard
              stats={stats}
              monthLabel={formatMonthName(dateRange.from)}
              onPress={() => pushDetail("/stats/wrapped")}
            />

            <NetWorthCard
              netBalance={supplement?.currentNetBalance ?? stats.closingBalance}
              balanceDelta={stats.balanceDelta}
              periodLabel={formatRangeLabel(dateRange)}
              timeline={stats.balanceTimeline}
              currency={stats.currency}
              onPress={() => pushDetail("/stats/net-worth")}
            />

            <View style={styles.halfRow}>
              <CalendarCard
                dailyData={stats.dailyData}
                from={dateRange.from}
                to={dateRange.to}
                onPress={() => pushDetail("/stats/calendar")}
              />
              <StatCard
                title={t("screens.stats.dashboard.recurring")}
                icon="repeat-outline"
                soon
              />
            </View>

            <StatCard
              title={t("screens.stats.dashboard.spendingMap")}
              icon="map-outline"
              soon
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
  grid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  halfRow: {
    flexDirection: "row",
    gap: 12,
  },
  sectionHeader: {
    fontWeight: "700",
    marginTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
}))
