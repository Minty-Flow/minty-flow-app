import { router } from "expo-router"

import { StatsInsightsSection } from "~/components/stats/dashboard/insights-section"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"

export default function StatsInsightsScreen() {
  return (
    <StatsDetailShell showPeriodHeader={false}>
      {({ stats, supplement, dateRange, activePreset }) => (
        <StatsInsightsSection
          stats={stats}
          supplement={supplement}
          dateRange={dateRange}
          onNavigate={(screen) =>
            router.push({
              pathname: screen,
              params: {
                preset: activePreset,
                from: dateRange.from.toISOString(),
                to: dateRange.to.toISOString(),
              },
            })
          }
        />
      )}
    </StatsDetailShell>
  )
}
