import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { RhythmInsightCard } from "~/components/stats/rhythm-insight-card"
import { SpendingHeatmap } from "~/components/stats/spending-heatmap"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { formatRangeLabel } from "~/utils/stats-date-range"

export default function StatsCalendarScreen() {
  const { t } = useTranslation()

  return (
    <StatsDetailShell init={{ preset: "thisYear" }}>
      {({ stats, dateRange }) => (
        <>
          <View style={styles.header}>
            <Text variant="muted">
              {t("screens.stats.calendar.spentIn", {
                period: formatRangeLabel(dateRange),
              })}
            </Text>
            <Money
              value={stats.current.totalExpense}
              currency={stats.currency}
              tone="transfer"
              visualTone="expense"
              variant="h2"
              compact
              style={styles.total}
            />
          </View>

          <View style={styles.heatmapCard}>
            <SpendingHeatmap
              dailyData={stats.dailyData}
              from={dateRange.from}
              to={dateRange.to}
            />
          </View>

          <RhythmInsightCard days={stats.spendingByDayOfWeek} />
        </>
      )}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    gap: 4,
    paddingVertical: 8,
  },
  total: {
    fontWeight: "700",
  },
  heatmapCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
  },
}))
