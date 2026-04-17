import { useRouter } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import Animated, { FadeIn } from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsSupplement,
} from "~/types/stats"
import { formatRangeLabel } from "~/utils/stats-date-range"

import { BalanceTimelineChart } from "./balance-timeline-chart"
import { CurrencyHeroRow } from "./currency-hero-row"
import { DailyExpenseLineChart } from "./daily-expense-line-chart"
import { StatsAveragesRow } from "./stats-averages-row"
import { StatsCategoryPie } from "./stats-category-pie"
import { StatsEmptyState } from "./stats-empty-state"
import { StatsPendingNotice } from "./stats-pending-notice"
import { StatsUncategorizedAlert } from "./stats-uncategorized-alert"

interface CurrencyStatSectionProps {
  stats: CurrencyStats
  dateRange: StatsDateRange
  isFirst: boolean
  supplement?: StatsSupplement
}

export function CurrencyStatSection({
  stats,
  dateRange,
  isFirst,
  supplement,
}: CurrencyStatSectionProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isEmpty = stats.current.transactionCount === 0

  const handleCategorizePress = useCallback(() => {
    router.push("/(tabs)")
  }, [router])

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {/* Divider between currency sections */}
      {!isFirst && <View style={styles.divider} />}

      {/* Currency header */}
      <View style={styles.header}>
        <Text variant="h4" style={styles.currencyTitle}>
          {t("screens.stats.currency.sectionHeader", {
            currency: stats.currency,
          })}
        </Text>
      </View>

      {isEmpty ? (
        <StatsEmptyState
          currency={stats.currency}
          rangeLabel={formatRangeLabel(dateRange)}
        />
      ) : (
        <View style={styles.sections}>
          {/* Actionable alerts */}
          <StatsPendingNotice
            pendingSummary={stats.pendingSummary}
            currency={stats.currency}
          />
          <StatsUncategorizedAlert
            uncategorizedSummary={stats.uncategorizedSummary}
            currency={stats.currency}
            onCategorizePress={handleCategorizePress}
          />

          {/* Hero cards row: expense / income / net */}
          <CurrencyHeroRow stats={stats} forecast={stats.forecast} />

          {/* Daily trend line chart */}
          <DailyExpenseLineChart
            dailyData={stats.dailyData}
            previousDailyData={stats.previousDailyData}
            currency={stats.currency}
          />

          {/* Net balance over time */}
          {supplement && (
            <BalanceTimelineChart
              timeline={stats.balanceTimeline}
              openingBalance={stats.openingBalance}
              closingBalance={stats.closingBalance}
              currency={stats.currency}
              accountBreakdown={supplement.accountBalanceSummary}
            />
          )}

          {/* Averages by day */}
          <View style={styles.sectionWithHeader}>
            <Text variant="small" style={styles.sectionTitle}>
              {t("screens.stats.averages.title")}
            </Text>
            <StatsAveragesRow
              current={stats.current}
              previous={stats.previous}
              currency={stats.currency}
            />
          </View>

          {/* Category breakdown pie */}
          <StatsCategoryPie
            breakdown={stats.categoryBreakdown}
            currency={stats.currency}
          />
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: `${theme.colors.customColors.semi}30`,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  currencyTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
  },
  sections: {
    gap: 16,
  },
  sectionWithHeader: {
    gap: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
  },
}))
