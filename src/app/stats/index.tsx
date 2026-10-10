import { type Href, router } from "expo-router"
import { StyleSheet } from "react-native-unistyles"

import { CashFlowCard } from "~/components/stats/dashboard/cash-flow-card"
import {
  type StatsInsightsRoute,
  StatsInsightsSection,
} from "~/components/stats/dashboard/insights-section"
import { PaceCard } from "~/components/stats/dashboard/pace-card"
import { TopCategoriesCard } from "~/components/stats/dashboard/top-categories-card"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { StatsPendingNotice } from "~/components/stats/stats-pending-notice"
import { View } from "~/components/ui/view"

export default function StatsScreen() {
  type ScreensType = Extract<
    Href,
    | "/stats/categories"
    | "/stats/wrapped"
    | "/stats/cash-flow"
    | "/stats/net-worth"
    | "/stats/calendar"
  >

  return (
    <StatsDetailShell variant="dashboard" emptyScenario="noTransactionsEver">
      {({ stats, supplement, dateRange, activePreset }) => {
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
          <>
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
          </>
        )
      }}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create({
  // Both cards always share one height: the row stretches them to the taller.
  halfRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
})
