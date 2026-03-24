import {
  Circle,
  Line as SkiaLine,
  Text as SkiaText,
  vec,
} from "@shopify/react-native-skia"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useWindowDimensions } from "react-native"
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { runOnJS } from "react-native-worklets"
import { Area, CartesianChart, Line, useChartPressState } from "victory-native"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useChartFont } from "~/hooks/use-chart-font"
import type { DailyDataPoint } from "~/types/stats"

import { ChartContainer } from "./chart-container"
import { ChartCrosshair } from "./chart-crosshair"

const CHART_HEIGHT = 220

interface DailyExpenseLineChartProps {
  dailyData: DailyDataPoint[]
  previousDailyData: DailyDataPoint[]
  currency: string
}

interface ActivePoint {
  day: number
  current: number
  prev: number
}

export function DailyExpenseLineChart({
  dailyData,
  previousDailyData,
  currency,
}: DailyExpenseLineChartProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const font = useChartFont()
  const Dimensions = useWindowDimensions()

  // x typed as `number` explicitly so ChartPressState generic resolves correctly
  const { state } = useChartPressState({
    x: 0 as number,
    y: { current: 0, prev: 0 },
  })

  // Keep stale values so the tooltip doesn't flicker on lift — animated style drives show/hide
  const [activePoint, setActivePoint] = useState<ActivePoint>({
    day: 0,
    current: 0,
    prev: 0,
  })

  const [tooltipWidth, setTooltipWidth] = useState(0)
  const screenWidth = Dimensions.width

  const tooltipLeft = useDerivedValue(() => {
    "worklet"
    const xPos = state.x.position.value
    let left = xPos - tooltipWidth / 2
    left = Math.max(8, left)
    left = Math.min(left, screenWidth - tooltipWidth - 8)
    return left
  })

  const tooltipTop = useDerivedValue(() => {
    "worklet"
    return state.y.current.position.value - 60
  })

  // Derived opacity for the Skia circle — runs on UI thread
  const circleOpacity = useDerivedValue(() => (state.isActive.value ? 1 : 0))

  // Single animated style that handles both position and visibility
  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: withSpring(state.isActive.value ? 1 : 0),
    transform: [{ scale: withSpring(state.isActive.value ? 1 : 0.8) }],
    left: tooltipLeft.value,
    top: tooltipTop.value,
  }))

  useAnimatedReaction(
    () => ({
      x: state.x.value.value,
      current: state.y.current.value.value,
      prev: state.y.prev.value.value,
    }),
    (next) => {
      runOnJS(setActivePoint)({
        day: Math.round(next.x),
        current: next.current,
        prev: next.prev,
      })
    },
    [],
  )

  const chartData = useMemo(
    () =>
      dailyData.map((d, i) => ({
        x: d.date.getDate(),
        current: d.expense,
        prev: previousDailyData[i]?.expense ?? 0,
      })),
    [dailyData, previousDailyData],
  )

  const hasPreviousData = useMemo(
    () => previousDailyData.some((d) => d.expense > 0),
    [previousDailyData],
  )

  const averageExpense = useMemo(() => {
    const nonZero = chartData.filter((d) => d.current > 0)
    if (nonZero.length === 0) return 0
    return nonZero.reduce((sum, d) => sum + d.current, 0) / nonZero.length
  }, [chartData])

  // Use actual max of non-zero values to avoid p95 picking zeros on sparse datasets
  const maxValue = useMemo(() => {
    const values = chartData
      .flatMap((d) => (hasPreviousData ? [d.current, d.prev] : [d.current]))
      .filter((v) => v > 0)
    if (values.length === 0) return 1
    return Math.max(...values) * 1.2
  }, [chartData, hasPreviousData])

  if (chartData.length === 0 || chartData.every((d) => d.current === 0)) {
    return null
  }

  const legend = (
    <View style={styles.legendRow}>
      {hasPreviousData && (
        <>
          <View style={styles.prevSwatch} />
          <Text variant="muted" style={styles.legendLabel}>
            {t("screens.stats.chart.prevPeriod")}
          </Text>
        </>
      )}
      <View style={styles.currentSwatch} />
      <Text variant="muted" style={styles.legendLabel}>
        {t("screens.stats.chart.currentPeriod")}
      </Text>
    </View>
  )

  return (
    <ChartContainer
      title={t("screens.stats.chart.dailyTrend")}
      legend={legend}
      legendBelow
    >
      <View style={styles.chartArea}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["current", "prev"]}
          domain={{ y: [0, maxValue] }}
          domainPadding={{ top: 8, bottom: 0, left: 8, right: 8 }}
          xAxis={{
            font,
            tickCount: 5,
            labelColor: theme.colors.customColors.semi,
            lineColor: `${theme.colors.customColors.semi}40`,
            lineWidth: 1,
          }}
          yAxis={[
            {
              font,
              tickCount: 4,
              labelColor: theme.colors.customColors.semi,
              lineColor: `${theme.colors.customColors.semi}50`,
              lineWidth: 1,
              formatYLabel: (v) => {
                const n = v as number
                if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
                if (n >= 100) return `$${Math.round(n)}`
                if (n > 0) return `$${n.toFixed(0)}`
                return "$0"
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
          {({ points, chartBounds, yScale }) => {
            const avgY = yScale(averageExpense)
            return (
              <>
                {hasPreviousData && (
                  <Line
                    points={points.prev}
                    color={theme.colors.customColors.semi}
                    strokeWidth={1.5}
                    opacity={0.35}
                    curveType="monotoneX"
                  />
                )}
                <Area
                  points={points.current}
                  color={theme.colors.primary}
                  opacity={0.12}
                  curveType="monotoneX"
                  y0={chartBounds.bottom}
                />
                <Line
                  points={points.current}
                  color={theme.colors.primary}
                  strokeWidth={2.5}
                  curveType="monotoneX"
                />
                <Circle
                  cx={state.x.position}
                  cy={state.y.current.position}
                  r={5}
                  color={theme.colors.primary}
                  opacity={circleOpacity}
                />
                {averageExpense > 0 && (
                  <>
                    <SkiaLine
                      p1={vec(chartBounds.left, avgY)}
                      p2={vec(chartBounds.right, avgY)}
                      color={theme.colors.primary}
                      strokeWidth={1}
                      opacity={0.4}
                    />
                    {font && (
                      <SkiaText
                        x={chartBounds.right - 48}
                        y={avgY - 4}
                        text={
                          averageExpense >= 1000
                            ? `$${(averageExpense / 1000).toFixed(1)}k`
                            : `$${averageExpense.toFixed(1)}`
                        }
                        font={font}
                        color={theme.colors.primary}
                        opacity={0.7}
                      />
                    )}
                  </>
                )}
              </>
            )
          }}
        </CartesianChart>
      </View>

      <Animated.View
        style={[styles.floatingTooltip, tooltipStyle]}
        onLayout={(e) => setTooltipWidth(e.nativeEvent.layout.width)}
      >
        <Text variant="small" style={styles.tooltipDay}>
          {activePoint.day}
        </Text>
        <Money
          value={activePoint.current}
          currency={currency}
          tone="expense"
          variant="small"
        />
        {hasPreviousData && (
          <Money
            value={activePoint.prev}
            currency={currency}
            tone="transfer"
            variant="muted"
            compact
          />
        )}
      </Animated.View>
    </ChartContainer>
  )
}

const styles = StyleSheet.create((theme) => ({
  chartArea: {
    height: CHART_HEIGHT,
  },
  tooltipDay: {
    color: theme.colors.customColors.semi,
    fontWeight: "600",
    minWidth: 20,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currentSwatch: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.primary,
  },
  prevSwatch: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.customColors.semi,
    opacity: 0.5,
  },
  legendLabel: {
    fontSize: 11,
    marginRight: 6,
  },

  floatingTooltip: {
    position: "absolute",
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    gap: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}))
