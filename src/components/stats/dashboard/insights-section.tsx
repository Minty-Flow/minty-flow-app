import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { CalendarCard } from "~/components/stats/dashboard/calendar-card"
import { NetWorthCard } from "~/components/stats/dashboard/net-worth-card"
import { StatCard } from "~/components/stats/dashboard/stat-card"
import { WrappedCard } from "~/components/stats/dashboard/wrapped-card"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsSupplement,
} from "~/types/stats"
import { formatRangeLabel } from "~/utils/stats-date-range"
import { formatMonthName } from "~/utils/time-utils"

export type StatsInsightsRoute =
  | "/stats/wrapped"
  | "/stats/net-worth"
  | "/stats/calendar"

interface StatsInsightsSectionProps {
  stats: CurrencyStats
  supplement?: StatsSupplement
  dateRange: StatsDateRange
  onNavigate: (route: StatsInsightsRoute) => void
  showHeader?: boolean
}

export function StatsInsightsSection({
  stats,
  supplement,
  dateRange,
  onNavigate,
  showHeader = false,
}: StatsInsightsSectionProps) {
  const { t } = useTranslation()

  return (
    <>
      {showHeader ? (
        <Text variant="h4" style={styles.sectionHeader}>
          {t("screens.stats.dashboard.insights")}
        </Text>
      ) : null}

      <WrappedCard
        stats={stats}
        monthLabel={formatMonthName(dateRange.from)}
        onPress={() => onNavigate("/stats/wrapped")}
      />

      <NetWorthCard
        netBalance={supplement?.currentNetBalance ?? stats.closingBalance}
        balanceDelta={stats.balanceDelta}
        periodLabel={formatRangeLabel(dateRange)}
        timeline={stats.balanceTimeline}
        currency={stats.currency}
        onPress={() => onNavigate("/stats/net-worth")}
      />

      <View style={styles.halfRow}>
        <CalendarCard
          dailyData={stats.dailyData}
          from={dateRange.from}
          to={dateRange.to}
          currency={stats.currency}
          onPress={() => onNavigate("/stats/calendar")}
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
    </>
  )
}

const styles = StyleSheet.create(() => ({
  halfRow: {
    flexDirection: "row",
    gap: 12,
  },
  sectionHeader: {
    fontWeight: "700",
    marginTop: 8,
  },
}))
