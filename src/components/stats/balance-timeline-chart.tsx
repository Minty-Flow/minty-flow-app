import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { CartesianChart, Line } from "victory-native"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useChartFont } from "~/hooks/use-chart-font"
import { getThemeStrict } from "~/styles/theme/registry"
import type { BalanceTimelinePoint, StatsSupplement } from "~/types/stats"

import { ChartContainer } from "./chart-container"
import { DeltaBadge } from "./delta-badge"

const CHART_HEIGHT = 140

interface BalanceTimelineChartProps {
  timeline: BalanceTimelinePoint[]
  openingBalance: number
  closingBalance: number
  currency: string
  accountBreakdown: StatsSupplement["accountBalanceSummary"]
}

export function BalanceTimelineChart({
  timeline,
  openingBalance,
  closingBalance,
  currency,
  accountBreakdown,
}: BalanceTimelineChartProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const font = useChartFont()

  const chartData = useMemo(
    () =>
      timeline.map((point, i) => ({
        x: i,
        balance: point.balance,
      })),
    [timeline],
  )

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number]
    const values = chartData.map((d) => d.balance)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = Math.max((max - min) * 0.15, Math.abs(max) * 0.05, 1)
    return [min - padding, max + padding] as [number, number]
  }, [chartData])

  const fallbackPalette = [
    theme.colors.primary,
    theme.colors.customColors.income,
    theme.colors.customColors.info,
    theme.colors.customColors.warning,
    theme.colors.customColors.expense,
    theme.colors.customColors.success,
    theme.colors.secondary,
    theme.colors.error,
  ]

  const includedAccounts = useMemo(
    () => accountBreakdown.filter((a) => !a.excludeFromBalance),
    [accountBreakdown],
  )

  if (timeline.length === 0) return null

  const header = (
    <Money
      value={closingBalance}
      currency={currency}
      tone="transfer"
      hideSign
      style={styles.headerBalance}
    />
  )

  return (
    <ChartContainer title={t("screens.stats.balance.title")} legend={header}>
      {/* Line chart */}
      <View style={styles.chartArea}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["balance"]}
          domain={{ y: yDomain }}
          domainPadding={{ top: 4, bottom: 4, left: 8, right: 8 }}
          xAxis={{
            font,
            tickCount: 0,
            lineColor: "transparent",
          }}
          yAxis={[
            {
              font,
              tickCount: 3,
              labelColor: theme.colors.customColors.semi,
              lineColor: `${theme.colors.customColors.semi}40`,
              lineWidth: 1,
              formatYLabel: (v) => {
                const n = v as number
                if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`
                return String(Math.round(n))
              },
            },
          ]}
          frame={{ lineWidth: 0 }}
        >
          {({ points }) => (
            <Line
              points={points.balance}
              color={theme.colors.primary}
              strokeWidth={2.5}
              curveType="monotoneX"
            />
          )}
        </CartesianChart>
      </View>

      {/* Opening → Closing summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text variant="muted" style={styles.summaryLabel}>
            {t("screens.stats.balance.opening")}
          </Text>
          <Money
            value={openingBalance}
            currency={currency}
            tone="transfer"
            hideSign
            style={styles.summaryValue}
          />
        </View>
        <IconSvg
          name="arrow-narrow-right"
          size={14}
          color={theme.colors.customColors.semi}
        />
        <View style={styles.summaryItem}>
          <Text variant="muted" style={styles.summaryLabel}>
            {t("screens.stats.balance.closing")}
          </Text>
          <Money
            value={closingBalance}
            currency={currency}
            tone="transfer"
            hideSign
            style={styles.summaryValue}
          />
        </View>
        <DeltaBadge current={closingBalance} previous={openingBalance} />
      </View>

      {/* Per-account breakdown — only shown for 2+ accounts */}
      {includedAccounts.length > 1 && (
        <View style={styles.accountsList}>
          {includedAccounts.map((a, i) => {
            const scheme = getThemeStrict(a.colorSchemeName)
            const accountColor =
              scheme?.primary ??
              fallbackPalette[i % fallbackPalette.length] ??
              "#888888"
            return (
              <View key={a.accountId} style={styles.accountRow}>
                <DynamicIcon
                  icon={a.icon}
                  size={12}
                  color={accountColor}
                  variant="raw"
                />
                <Text
                  variant="small"
                  style={styles.accountName}
                  numberOfLines={1}
                >
                  {a.accountName}
                </Text>
                <Money
                  value={a.balance}
                  currency={currency}
                  tone="transfer"
                  hideSign
                  style={styles.accountBalance}
                />
              </View>
            )
          })}
        </View>
      )}
    </ChartContainer>
  )
}

const styles = StyleSheet.create((theme) => ({
  chartArea: {
    height: CHART_HEIGHT,
  },
  headerBalance: {
    ...theme.typography.labelLarge,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  summaryItem: {
    gap: 1,
  },
  summaryLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
    color: theme.colors.customColors.semi,
  },
  summaryValue: {
    ...theme.typography.bodyMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  accountsList: {
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.customColors.semi}30`,
    paddingTop: 10,
    gap: 8,
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountName: {
    color: theme.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  accountBalance: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
}))
