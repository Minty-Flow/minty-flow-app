import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { CartesianChart, Line } from "victory-native"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useChartFont } from "~/hooks/use-chart-font"
import type { PayoffMonth } from "~/utils/debt-payoff"
import { toMajorUnits } from "~/utils/money"
import { formatNumber } from "~/utils/number-format"

const CHART_HEIGHT = 200

interface PayoffChartProps {
  /** `schedule` from `debtPayoff`, end-of-month total balances. */
  schedule: PayoffMonth[]
  /** Total owed right now — plotted as month 0 so the line starts at today. */
  startBalanceMinor: number
  currency: string
}

/**
 * Total debt descending to zero under the selected strategy. Re-renders
 * whenever `schedule` changes (extra payment / strategy toggle upstream).
 */
export function PayoffChart({
  schedule,
  startBalanceMinor,
  currency,
}: PayoffChartProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const font = useChartFont()

  const data = [
    { x: 0, balance: toMajorUnits(startBalanceMinor, currency) },
    ...schedule.map((m) => ({
      x: m.month,
      balance: toMajorUnits(m.totalBalanceMinor, currency),
    })),
  ]

  if (data.length < 2) return null

  return (
    <View style={styles.card}>
      <Text variant="small" style={styles.title}>
        {t("screens.settings.loans.payoff.chartTitle")}
      </Text>
      <View style={styles.chartArea}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["balance"]}
          domainPadding={{ top: 8, bottom: 8, left: 4, right: 8 }}
          xAxis={{
            font,
            tickCount: Math.min(6, data.length),
            labelColor: theme.colors.semantic.semi,
            lineColor: "transparent",
            formatXLabel: (v) =>
              t("screens.settings.loans.payoff.chartMonthLabel", {
                count: Math.round(v as number),
              }),
          }}
          yAxis={[
            {
              font,
              tickCount: 4,
              labelColor: theme.colors.semantic.semi,
              lineColor: `${theme.colors.semantic.semi}30`,
              lineWidth: 1,
              formatYLabel: (v) => {
                const n = v as number
                return formatNumber(n, {
                  maximumFractionDigits: Math.abs(n) >= 1000 ? 1 : 0,
                  notation: Math.abs(n) >= 1000 ? "compact" : "standard",
                })
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
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 8,
  },
  title: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  chartArea: {
    height: CHART_HEIGHT,
  },
}))
