import { Circle } from "@shopify/react-native-skia"
import { useMemo, useState } from "react"
import { useWindowDimensions } from "react-native"
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { runOnJS } from "react-native-worklets"
import { CartesianChart, Line, useChartPressState } from "victory-native"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useChartFont } from "~/hooks/use-chart-font"
import type { BalanceTimelinePoint, StatsDateRange } from "~/types/stats"
import {
  formatDayOfMonth,
  formatMonthKey,
  formatShortMonthDay,
  formatShortMonthName,
} from "~/utils/time-utils"

import { ChartCrosshair } from "./chart-crosshair"

const CHART_HEIGHT = 220

interface NetWorthChartProps {
  timeline: BalanceTimelinePoint[]
  currency: string
  interval: StatsDateRange["interval"]
}

/** Keep the last point of each calendar month when the range spans months */
function bucketTimeline(
  timeline: BalanceTimelinePoint[],
  interval: StatsDateRange["interval"],
) {
  if (interval === "day" || interval === "week") return timeline
  const byMonth = new Map<string, BalanceTimelinePoint>()
  for (const point of timeline) {
    byMonth.set(formatMonthKey(point.date), point)
  }
  return [...byMonth.values()]
}

export function NetWorthChart({
  timeline,
  currency,
  interval,
}: NetWorthChartProps) {
  const { theme } = useUnistyles()
  const font = useChartFont()
  const { width: screenWidth } = useWindowDimensions()

  const points = useMemo(
    () => bucketTimeline(timeline, interval),
    [timeline, interval],
  )
  const chartData = useMemo(
    () => points.map((p, i) => ({ x: i, balance: p.balance })),
    [points],
  )

  const { state } = useChartPressState({ x: 0 as number, y: { balance: 0 } })
  const [active, setActive] = useState({ index: 0, balance: 0 })
  const [tooltipWidth, setTooltipWidth] = useState(0)

  useAnimatedReaction(
    () => ({ x: state.x.value.value, balance: state.y.balance.value.value }),
    (next) => {
      runOnJS(setActive)({ index: Math.round(next.x), balance: next.balance })
    },
    [],
  )

  const tooltipStyle = useAnimatedStyle(() => {
    let left = state.x.position.value - tooltipWidth / 2
    left = Math.min(Math.max(8, left), screenWidth - tooltipWidth - 48)
    return {
      opacity: withSpring(state.isActive.value ? 1 : 0),
      transform: [{ scale: withSpring(state.isActive.value ? 1 : 0.8) }],
      left,
      top: state.y.balance.position.value - 56,
    }
  })

  const dotOpacity = useDerivedValue(() => (state.isActive.value ? 1 : 0))

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number]
    const values = chartData.map((d) => d.balance)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = Math.max((max - min) * 0.15, Math.abs(max) * 0.05, 1)
    return [min - padding, max + padding] as [number, number]
  }, [chartData])

  const activeDate = points[active.index]?.date

  if (chartData.length < 2) return null

  return (
    <View style={styles.card}>
      <View style={styles.chartArea}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["balance"]}
          domain={{ y: yDomain }}
          domainPadding={{ top: 8, bottom: 8, left: 8, right: 8 }}
          xAxis={{
            font,
            tickCount: Math.min(6, chartData.length),
            labelColor: theme.colors.semantic.semi,
            lineColor: "transparent",
            formatXLabel: (v) => {
              const point = points[Math.round(v as number)]
              if (!point) return ""
              return interval === "day"
                ? formatDayOfMonth(point.date)
                : formatShortMonthName(point.date)
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
                if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`
                return String(Math.round(n))
              },
            },
          ]}
          frame={{ lineWidth: 0 }}
          chartPressState={state}
          renderOutside={({ chartBounds }) => (
            <ChartCrosshair
              xPosition={state.x.position}
              isActive={state.isActive}
              top={chartBounds.top}
              bottom={chartBounds.bottom}
            />
          )}
        >
          {({ points: chartPoints }) => (
            <>
              <Line
                points={chartPoints.balance}
                color={theme.colors.primary}
                strokeWidth={2.5}
                curveType="monotoneX"
              />
              <Circle
                cx={state.x.position}
                cy={state.y.balance.position}
                r={5}
                color={theme.colors.primary}
                opacity={dotOpacity}
              />
            </>
          )}
        </CartesianChart>
      </View>

      <Animated.View
        style={[styles.tooltip, tooltipStyle]}
        onLayout={(e) => setTooltipWidth(e.nativeEvent.layout.width)}
      >
        <Text variant="small" style={styles.tooltipLabel}>
          {activeDate ? formatShortMonthDay(activeDate) : ""}
        </Text>
        <Money
          value={active.balance}
          currency={currency}
          tone="transfer"
          compact
          variant="small"
          style={styles.tooltipValue}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
  },
  chartArea: {
    height: CHART_HEIGHT,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  tooltipLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.semantic.semi,
  },
  tooltipValue: {
    fontWeight: "700",
  },
}))
