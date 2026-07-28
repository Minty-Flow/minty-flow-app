import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { InsightCard } from "~/components/stats/insight-card"
import { MiniBars } from "~/components/stats/mini-bars"
import { RhythmInsightCard } from "~/components/stats/rhythm-insight-card"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { EmptyState } from "~/components/ui/empty-state"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import { fetchWrappedInsights } from "~/database/services-sqlite/stats-service"
import { useDebouncedCallback } from "~/hooks/use-debounced-callback"
import type {
  CurrencyStats,
  StatsDateRange,
  WrappedInsights,
} from "~/types/stats"
import { logger } from "~/utils/logger"
import { formatNumber } from "~/utils/number-format"

function CategoryTrendCard({
  trend,
  currency,
}: {
  trend: NonNullable<WrappedInsights["topCategoryTrend"]>
  currency: string
}) {
  const { t } = useTranslation()
  if (trend.trailingAvg <= 0) return null

  const percent = formatNumber(
    (Math.abs(trend.currentTotal - trend.trailingAvg) / trend.trailingAvg) *
      100,
    { maximumFractionDigits: 0 },
  )
  const above = trend.currentTotal >= trend.trailingAvg

  return (
    <InsightCard
      icon="chart-donut"
      badge={t("screens.stats.wrapped.badgeCategory")}
      sentence={t(
        above
          ? "screens.stats.wrapped.categoryAbove"
          : "screens.stats.wrapped.categoryBelow",
        { category: trend.categoryName, percent },
      )}
    >
      <View style={styles.supportRow}>
        <Text variant="muted">{t("screens.stats.wrapped.vsAvg")}</Text>
        <Money
          value={trend.trailingAvg}
          currency={currency}
          tone="transfer"
          variant="muted"
          compact
        />
      </View>

      <MiniBars
        bars={trend.months.map((month, i) => ({
          label: month.label,
          value: month.total,
          // The current range is the last bar — the one the sentence compares.
          active: i === trend.months.length - 1,
        }))}
      />
    </InsightCard>
  )
}

function WrappedContent({
  stats,
  dateRange,
}: {
  stats: CurrencyStats
  dateRange: StatsDateRange
}) {
  const { t } = useTranslation()
  const [insights, setInsights] = useState<WrappedInsights[]>([])
  const [isInsightsLoading, setIsInsightsLoading] = useState(true)
  const fetchIdRef = useRef(0)

  const fetchInsights = useCallback((range: StatsDateRange) => {
    const fetchId = ++fetchIdRef.current
    setIsInsightsLoading(true)
    fetchWrappedInsights(range)
      .then((result) => {
        if (fetchIdRef.current === fetchId) setInsights(result)
      })
      .catch((error) => logger.error("wrapped insights fetch failed", error))
      .finally(() => {
        if (fetchIdRef.current === fetchId) setIsInsightsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchInsights(dateRange)
  }, [dateRange, fetchInsights])

  const debouncedFetchInsights = useDebouncedCallback(fetchInsights, 300)

  // These cards read straight from SQLite rather than `useStats`, so nothing
  // else re-runs them when a transaction changes.
  useEffect(() => {
    const unsub1 = on("transactions:dirty", () =>
      debouncedFetchInsights(dateRange),
    )
    const unsub2 = on("categories:dirty", () =>
      debouncedFetchInsights(dateRange),
    )
    return () => {
      fetchIdRef.current++
      unsub1()
      unsub2()
    }
  }, [dateRange, debouncedFetchInsights])

  const insight = insights.find((i) => i.currency === stats.currency)
  const hasRhythm = stats.spendingByDayOfWeek.some((day) => day.avgExpense > 0)
  const hasAnyInsight = Boolean(
    insight?.topCategoryTrend ||
      insight?.mostFrequent ||
      insight?.medianPurchase != null ||
      hasRhythm,
  )

  if (!isInsightsLoading && !hasAnyInsight) {
    return (
      <EmptyState
        title={t("screens.stats.wrapped.emptyTitle")}
        description={t("screens.stats.wrapped.emptyDescription")}
      />
    )
  }

  return (
    <>
      {insight?.topCategoryTrend && (
        <CategoryTrendCard
          trend={insight.topCategoryTrend}
          currency={stats.currency}
        />
      )}

      {insight?.mostFrequent && (
        <InsightCard
          icon="repeat-outline"
          badge={t("screens.stats.wrapped.badgeFrequent")}
          sentence={t("screens.stats.wrapped.frequentSentence", {
            title: insight.mostFrequent.title,
            count: insight.mostFrequent.count,
          })}
        />
      )}

      <RhythmInsightCard days={stats.spendingByDayOfWeek} />

      {insight?.medianPurchase != null && (
        <InsightCard
          icon="sparkles"
          badge={t("screens.stats.wrapped.badgeShape")}
          sentence={
            <>
              {t("screens.stats.wrapped.shapeSentence")}{" "}
              <Money
                value={insight.medianPurchase}
                currency={stats.currency}
                tone="transfer"
                variant="large"
                compact
                style={styles.inlineMoney}
              />
            </>
          }
        />
      )}
    </>
  )
}

export default function StatsWrappedScreen() {
  return (
    <StatsDetailShell>
      {({ stats, dateRange }) => (
        <WrappedContent stats={stats} dateRange={dateRange} />
      )}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create(() => ({
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inlineMoney: {
    fontWeight: "700",
  },
}))
