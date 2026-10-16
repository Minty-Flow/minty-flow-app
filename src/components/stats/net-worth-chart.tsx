import {
  Canvas,
  Circle,
  Line,
  LinearGradient,
  Path,
  vec,
} from "@shopify/react-native-skia"
import { useState } from "react"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { scheduleOnRN } from "react-native-worklets"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { BalanceTimelinePoint, StatsDateRange } from "~/types/stats"
import { toMajorUnits } from "~/utils/money"
import { formatNumber } from "~/utils/number-format"
import {
  formatDayOfMonth,
  formatMonthKey,
  formatShortMonthDay,
  formatShortMonthName,
} from "~/utils/time-utils"

const CHART_HEIGHT = 200
const LABEL_HEIGHT = 20
const PLOT_PAD = 8
const Y_TICKS = 4
const MAX_X_LABELS = 6

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
  const [width, setWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const points = bucketTimeline(timeline, interval)
  if (points.length < 2) return null

  const plotHeight = CHART_HEIGHT - LABEL_HEIGHT
  const values = points.map((p) => p.balance)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const usable = plotHeight - PLOT_PAD * 2
  const xAt = (i: number) => (i / (points.length - 1)) * width
  const yAt = (v: number) => PLOT_PAD + (1 - (v - min) / span) * usable

  const line: string[] = []
  const area: string[] = []
  points.forEach((p, i) => {
    const x = xAt(i)
    const y = yAt(p.balance)
    if (i === 0) {
      line.push(`M ${x} ${y}`)
      area.push(`M ${x} ${plotHeight}`, `L ${x} ${y}`)
    } else {
      line.push(`L ${x} ${y}`)
      area.push(`L ${x} ${y}`)
    }
  })
  area.push(`L ${width} ${plotHeight}`, "Z")
  const linePath = line.join(" ")
  const areaPath = area.join(" ")

  const gridValues = Array.from({ length: Y_TICKS }, (_, i) =>
    Math.round(min + (span * i) / (Y_TICKS - 1)),
  )
  const labelCount = Math.min(MAX_X_LABELS, points.length)
  const labelIndexes = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / Math.max(labelCount - 1, 1)) * (points.length - 1)),
  )

  const select = (x: number) => {
    if (width === 0) return
    const ratio = Math.min(Math.max(x / width, 0), 1)
    setActiveIndex(Math.round(ratio * (points.length - 1)))
  }
  const clear = () => setActiveIndex(null)

  const gesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onStart((e) => scheduleOnRN(select, e.x))
    .onUpdate((e) => scheduleOnRN(select, e.x))
    .onEnd(() => scheduleOnRN(clear))
    .onFinalize(() => scheduleOnRN(clear))

  const active = activeIndex === null ? null : points[activeIndex]
  const activeX = activeIndex === null ? 0 : xAt(activeIndex)
  const tooltipLeft = Math.min(
    Math.max(activeX - 45, 0),
    Math.max(width - 90, 0),
  )

  return (
    <View style={styles.card}>
      <GestureDetector gesture={gesture}>
        <View
          style={styles.chartArea}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          {width > 0 ? (
            <Canvas style={styles.canvas}>
              {gridValues.map((v) => (
                <Line
                  key={v}
                  p1={vec(0, yAt(v))}
                  p2={vec(width, yAt(v))}
                  color={`${theme.colors.semantic.semi}30`}
                  strokeWidth={1}
                />
              ))}
              <Path path={areaPath} style="fill">
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, plotHeight)}
                  colors={[
                    `${theme.colors.primary}40`,
                    `${theme.colors.primary}00`,
                  ]}
                />
              </Path>
              <Path
                path={linePath}
                style="stroke"
                strokeWidth={2.5}
                strokeJoin="round"
                strokeCap="round"
                color={theme.colors.primary}
              />
              {active ? (
                <>
                  <Line
                    p1={vec(activeX, 0)}
                    p2={vec(activeX, plotHeight)}
                    color="rgba(150,150,150,0.5)"
                    strokeWidth={1}
                  />
                  <Circle
                    cx={activeX}
                    cy={yAt(active.balance)}
                    r={5}
                    color={theme.colors.primary}
                  />
                </>
              ) : null}
            </Canvas>
          ) : null}

          <View style={styles.yLabels} pointerEvents="none">
            {[...gridValues].reverse().map((v) => {
              const n = toMajorUnits(v, currency)
              const big = Math.abs(n) >= 1000
              return (
                <Text key={v} style={styles.axisLabel}>
                  {formatNumber(n, {
                    maximumFractionDigits: big ? 1 : 0,
                    notation: big ? "compact" : "standard",
                  })}
                </Text>
              )
            })}
          </View>

          <View style={styles.xLabels} pointerEvents="none">
            {labelIndexes.map((i) => {
              const point = points[i]
              if (!point) return null
              return (
                <Text key={i} style={styles.axisLabel}>
                  {interval === "day"
                    ? formatDayOfMonth(point.date)
                    : formatShortMonthName(point.date)}
                </Text>
              )
            })}
          </View>

          {active ? (
            <View
              style={[styles.tooltip, { left: tooltipLeft }]}
              pointerEvents="none"
            >
              <Text variant="small" style={styles.tooltipLabel}>
                {formatShortMonthDay(active.date)}
              </Text>
              <Money
                value={active.balance}
                currency={currency}
                tone="transfer"
                compact
                variant="small"
                style={styles.tooltipValue}
              />
            </View>
          ) : null}
        </View>
      </GestureDetector>
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
  canvas: {
    height: CHART_HEIGHT - LABEL_HEIGHT,
  },
  yLabels: {
    position: "absolute",
    top: 0,
    left: 0,
    height: CHART_HEIGHT - LABEL_HEIGHT,
    justifyContent: "space-between",
    paddingVertical: PLOT_PAD - 6,
  },
  xLabels: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: LABEL_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  axisLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.semantic.semi,
  },
  tooltip: {
    position: "absolute",
    top: 0,
    width: 90,
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
