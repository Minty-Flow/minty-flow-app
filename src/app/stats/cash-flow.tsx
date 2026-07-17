import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { InOutRow } from "~/components/stats/dashboard/cash-flow-card"
import { DeltaBadge } from "~/components/stats/delta-badge"
import { SankeyFlow, type SankeyNode } from "~/components/stats/sankey-flow"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { CurrencyPeriodStats, CurrencyStats } from "~/types/stats"

interface SankeyLabels {
  income: string
  other: string
  fromBalance: string
  saved: string
  uncategorized: string
}

interface SankeyColors {
  income: string
  neutral: string
  fallback: string
}

const MAX_EXPENSE_NODES = 6

function buildSankeyNodes(
  stats: CurrencyStats,
  labels: SankeyLabels,
  colors: SankeyColors,
): { left: SankeyNode[]; right: SankeyNode[] } {
  const { totalIncome, totalExpense } = stats.current
  const total = Math.max(totalIncome, totalExpense)
  if (total <= 0) return { left: [], right: [] }

  const nodeColor = (colorSchemeName: string | null, fallback: string) =>
    getThemeStrict(colorSchemeName)?.primary ?? fallback

  const categoryLabel = (name: string, categoryId: string | null) =>
    categoryId === null ? labels.uncategorized : name

  const left: SankeyNode[] = stats.categoryBreakdown
    .filter((b) => b.totalIncome > 0)
    .sort((a, b) => b.totalIncome - a.totalIncome)
    .map((b) => ({
      label: categoryLabel(b.categoryName, b.categoryId),
      color: nodeColor(b.categoryColorSchemeName, colors.income),
      value: b.totalIncome,
    }))
  if (left.length === 0 && totalIncome > 0) {
    left.push({
      label: labels.income,
      color: colors.income,
      value: totalIncome,
    })
  }
  if (totalExpense > totalIncome) {
    left.push({
      label: labels.fromBalance,
      color: colors.neutral,
      value: totalExpense - totalIncome,
    })
  }

  const expenseItems = stats.categoryBreakdown
    .filter((b) => b.totalExpense > 0)
    .sort((a, b) => b.totalExpense - a.totalExpense)
  const topExpense = expenseItems.slice(0, MAX_EXPENSE_NODES)
  const otherTotal = expenseItems
    .slice(MAX_EXPENSE_NODES)
    .reduce((s, b) => s + b.totalExpense, 0)

  const right: SankeyNode[] = topExpense.map((b) => ({
    label: categoryLabel(b.categoryName, b.categoryId),
    color: nodeColor(b.categoryColorSchemeName, colors.fallback),
    value: b.totalExpense,
  }))
  if (otherTotal > 0) {
    right.push({
      label: labels.other,
      color: colors.neutral,
      value: otherTotal,
    })
  }
  if (totalIncome > totalExpense) {
    right.push({
      label: labels.saved,
      color: colors.income,
      value: totalIncome - totalExpense,
    })
  }

  return { left, right }
}

function LegendList({
  title,
  nodes,
  total,
  currency,
}: {
  title: string
  nodes: SankeyNode[]
  total: number
  currency: string
}) {
  if (nodes.length === 0) return null

  return (
    <View style={styles.card}>
      <Text variant="muted" style={styles.sectionTitle}>
        {title}
      </Text>
      {nodes.map((node) => (
        <View key={node.label} style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: node.color }]} />
          <Text variant="small" style={styles.legendName} numberOfLines={1}>
            {node.label}
          </Text>
          <Text variant="muted" style={styles.legendPercent}>
            {total > 0 ? `${((node.value / total) * 100).toFixed(1)}%` : ""}
          </Text>
          <Money
            value={node.value}
            currency={currency}
            tone="transfer"
            variant="muted"
            compact
          />
        </View>
      ))}
    </View>
  )
}

function AverageCard({
  label,
  value,
  previousValue,
  currency,
  visualTone,
  invertedSentiment,
}: {
  label: string
  value: number
  previousValue: number | undefined
  currency: string
  visualTone?: "income" | "expense"
  invertedSentiment?: boolean
}) {
  return (
    <View style={[styles.card, styles.avgCard]}>
      <Text variant="muted" style={styles.avgLabel} numberOfLines={1}>
        {label}
      </Text>
      <Money
        value={value}
        currency={currency}
        tone="transfer"
        visualTone={visualTone}
        compact
        variant="small"
        style={styles.avgAmount}
      />
      <DeltaBadge
        current={value}
        previous={previousValue}
        invertedSentiment={invertedSentiment}
      />
    </View>
  )
}

function AveragesByDay({
  current,
  previous,
  currency,
}: {
  current: CurrencyPeriodStats
  previous: CurrencyPeriodStats | null
  currency: string
}) {
  const { t } = useTranslation()

  return (
    <>
      <Text variant="muted" style={styles.sectionTitle}>
        {t("screens.stats.cashFlow.averagesByDay")}
      </Text>
      <View style={styles.avgRow}>
        <AverageCard
          label={t("screens.stats.averages.expense")}
          value={current.avgDailyExpense}
          previousValue={previous?.avgDailyExpense}
          currency={currency}
          visualTone="expense"
          invertedSentiment
        />
        <AverageCard
          label={t("screens.stats.averages.income")}
          value={current.avgDailyIncome}
          previousValue={previous?.avgDailyIncome}
          currency={currency}
          visualTone="income"
        />
        <AverageCard
          label={t("screens.stats.averages.net")}
          value={current.avgDailyNet}
          previousValue={previous?.avgDailyNet}
          currency={currency}
        />
      </View>
    </>
  )
}

export default function StatsCashFlowScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <StatsDetailShell>
      {({ stats }) => {
        const overspent = stats.current.net < 0
        const { left, right } = buildSankeyNodes(
          stats,
          {
            income: t("screens.stats.cashFlow.income"),
            other: t("screens.stats.cashFlow.other"),
            fromBalance: t("screens.stats.cashFlow.fromBalance"),
            saved: t("screens.stats.cashFlow.savedNode"),
            uncategorized: t("screens.stats.chart.uncategorizedLabel"),
          },
          {
            income: theme.colors.semantic.income,
            neutral: theme.colors.semantic.semi,
            fallback: theme.colors.primary,
          },
        )
        const total = left.reduce((s, n) => s + n.value, 0)

        return (
          <>
            <View style={styles.card}>
              <View style={styles.headline}>
                <IconSvg
                  name={
                    overspent ? "trending-down-outline" : "trending-up-outline"
                  }
                  size={18}
                  color={
                    overspent
                      ? theme.colors.semantic.expense
                      : theme.colors.semantic.income
                  }
                />
                <Text variant="muted">
                  {overspent
                    ? t("screens.stats.dashboard.overspent")
                    : t("screens.stats.dashboard.saved")}
                </Text>
                <Money
                  value={Math.abs(stats.current.net)}
                  currency={stats.currency}
                  tone="transfer"
                  visualTone={overspent ? "expense" : "income"}
                  compact
                  style={styles.headlineAmount}
                />
              </View>
              <InOutRow
                totalIncome={stats.current.totalIncome}
                totalExpense={stats.current.totalExpense}
                currency={stats.currency}
              />
            </View>

            {left.length > 0 && right.length > 0 && (
              <View style={styles.card}>
                <SankeyFlow left={left} right={right} />
              </View>
            )}

            <LegendList
              title={t("screens.stats.cashFlow.income")}
              nodes={left}
              total={total}
              currency={stats.currency}
            />
            <LegendList
              title={t("screens.stats.cashFlow.spending")}
              nodes={right}
              total={total}
              currency={stats.currency}
            />

            <AveragesByDay
              current={stats.current}
              previous={stats.previous}
              currency={stats.currency}
            />
          </>
        )
      }}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  headline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headlineAmount: {
    fontWeight: "700",
  },
  sectionTitle: {
    ...theme.typography.labelMedium,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    flex: 1,
  },
  legendPercent: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
    minWidth: 40,
    textAlign: "right",
  },
  avgRow: {
    flexDirection: "row",
    gap: 8,
  },
  avgCard: {
    flex: 1,
    padding: 12,
    gap: 6,
    alignItems: "flex-start",
  },
  avgLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
  },
  avgAmount: {
    fontWeight: "700",
  },
}))
