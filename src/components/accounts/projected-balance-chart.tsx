import { Circle, DashPathEffect } from "@shopify/react-native-skia"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { CartesianChart, Line } from "victory-native"

import { Money } from "~/components/money"
import { Chip } from "~/components/ui/chips"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useProjectedBalance } from "~/database/drizzle/read-models/projected-balance-read-model"
import { useChartFont } from "~/hooks/use-chart-font"
import { toMajorUnits } from "~/utils/money"
import { formatNumber } from "~/utils/number-format"
import { formatShortMonthDay } from "~/utils/time-utils"

const CHART_HEIGHT = 200
const HORIZONS = [30, 60, 90] as const

interface ProjectedBalanceChartProps {
  accountIds: string[]
  /** Overrides the currency the hook infers from the first account. */
  currencyCode?: string
  /** Merged onto the card — pass `{ marginHorizontal: 0 }` inside a padded page. */
  style?: StyleProp<ViewStyle>
}

/**
 * Forward-only balance forecast. The whole line is dashed — it is a
 * projection, never history (the app has no per-account balance-history
 * chart to extend from).
 */
export function ProjectedBalanceChart({
  accountIds,
  currencyCode,
  style,
}: ProjectedBalanceChartProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const font = useChartFont()
  const [horizonDays, setHorizonDays] = useState<number>(HORIZONS[0])

  const { result, currency, hasInputs } = useProjectedBalance(
    accountIds,
    horizonDays,
  )
  const code = currencyCode || currency

  const data = result.points.map((p, i) => ({
    x: i,
    balance: toMajorUnits(p.balanceMinor, code),
    isNegative: p.isNegative,
  }))

  const header = (
    <View style={styles.headerRow}>
      <Text variant="small" style={styles.title}>
        {t("screens.accounts.projectedBalance.title")}
      </Text>
      <View style={styles.chipRow}>
        {HORIZONS.map((h) => (
          <Chip
            key={h}
            label={t("screens.accounts.projectedBalance.horizonLabel", {
              days: h,
            })}
            selected={horizonDays === h}
            hideCheck
            onPress={() => setHorizonDays(h)}
          />
        ))}
      </View>
    </View>
  )

  if (!hasInputs || data.length < 2) {
    return (
      <View style={[styles.card, style]}>
        {header}
        <Text variant="small" style={styles.empty}>
          {t("screens.accounts.projectedBalance.empty")}
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.card, style]}>
      {header}
      <View style={styles.chartArea}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["balance"]}
          domainPadding={{ top: 8, bottom: 8, left: 4, right: 8 }}
          xAxis={{
            font,
            tickCount: 4,
            labelColor: theme.colors.semantic.semi,
            lineColor: "transparent",
            formatXLabel: (v) => {
              const pt = result.points[Math.round(v as number)]
              return pt ? formatShortMonthDay(new Date(pt.dateMs)) : ""
            },
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
            <>
              <Line
                points={points.balance}
                color={theme.colors.primary}
                strokeWidth={2}
                curveType="monotoneX"
              >
                <DashPathEffect intervals={[6, 6]} />
              </Line>
              {points.balance.map((pt, i) =>
                data[i]?.isNegative && pt.y != null ? (
                  <Circle
                    key={result.points[i]?.dateMs ?? i}
                    cx={pt.x}
                    cy={pt.y}
                    r={3.5}
                    color={theme.colors.semantic.expense}
                  />
                ) : null,
              )}
            </>
          )}
        </CartesianChart>
      </View>

      {result.low && (
        <View style={styles.lowRow}>
          <Text variant="small" style={styles.lowLabel}>
            {t("screens.accounts.projectedBalance.lowLabel")}
          </Text>
          <Money
            value={result.low.balanceMinor}
            currency={code}
            tone="expense"
            variant="small"
          />
          <Text variant="small" style={styles.lowLabel}>
            {t("screens.accounts.projectedBalance.lowOn", {
              date: formatShortMonthDay(new Date(result.low.dateMs)),
            })}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
    marginHorizontal: 20,
  },
  headerRow: {
    gap: 8,
  },
  title: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chartArea: {
    height: CHART_HEIGHT,
  },
  empty: {
    color: theme.colors.onSurface,
    opacity: 0.6,
  },
  lowRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  lowLabel: {
    color: theme.colors.semantic.expense,
    fontWeight: "600",
  },
}))
