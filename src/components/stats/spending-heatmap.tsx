import { eachDayOfInterval } from "date-fns"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useWeekStartStore } from "~/stores/week-start.store"
import type { DailyDataPoint } from "~/types/stats"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import {
  formatDateKey,
  formatShortMonthName,
  getWeekdayLabel,
  startOfAppWeek,
} from "~/utils/time-utils"

interface HeatmapWeek {
  key: string
  /** Month label shown above this column ("" when same month as previous week) */
  monthLabel: string
  /** 7 cells, index = offset from week start; null = outside range */
  days: ({ dateKey: string; expense: number } | null)[]
}

interface SpendingHeatmapProps {
  dailyData: DailyDataPoint[]
  from: Date
  to: Date
  /** Grid-card variant: smaller cells, no labels/legend, no scroll */
  compact?: boolean
}

function buildWeeks(from: Date, to: Date, expenseByKey: Map<string, number>) {
  const weekStartsOn = getWeekStartsOn()
  const days = eachDayOfInterval({ start: from, end: to })
  const weeks: HeatmapWeek[] = []
  let prevMonth = -1

  for (const day of days) {
    const weekKey = formatDateKey(startOfAppWeek(day))
    let week = weeks[weeks.length - 1]
    if (!week || week.key !== weekKey) {
      const month = day.getMonth()
      week = {
        key: weekKey,
        monthLabel: month === prevMonth ? "" : formatShortMonthName(day),
        days: Array(7).fill(null),
      }
      prevMonth = month
      weeks.push(week)
    }
    const offset = (day.getDay() - weekStartsOn + 7) % 7
    const dateKey = formatDateKey(day)
    week.days[offset] = { dateKey, expense: expenseByKey.get(dateKey) ?? 0 }
  }
  return { weeks, weekStartsOn }
}

/** Quartile thresholds of nonzero expenses → intensity bucket 0–4 */
function buildBucketFn(expenses: number[]) {
  const nonzero = expenses.filter((e) => e > 0).sort((a, b) => a - b)
  if (nonzero.length === 0) return () => 0
  const q = (p: number) =>
    nonzero[Math.min(nonzero.length - 1, Math.floor(nonzero.length * p))]
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)]
  return (expense: number) => {
    if (expense <= 0) return 0
    if (expense <= q1) return 1
    if (expense <= q2) return 2
    if (expense <= q3) return 3
    return 4
  }
}

const BUCKET_OPACITY = ["14", "40", "80", "BF", "FF"]

export function SpendingHeatmap({
  dailyData,
  from,
  to,
  compact,
}: SpendingHeatmapProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  // `buildWeeks` reads the week-start setting through `getWeekStartsOn()`, so
  // the memo depends on store state it never receives as an argument. Subscribed
  // here (and listed as a dep) purely to recompute when it changes; today a
  // fresh `dailyData` happens to arrive too, but that is incidental.
  const weekStart = useWeekStartStore((s) => s.weekStart)

  // biome-ignore lint/correctness/useExhaustiveDependencies: weekStart is read indirectly by buildWeeks
  const { weeks, weekStartsOn, bucketOf } = useMemo(() => {
    const expenseByKey = new Map(dailyData.map((d) => [d.dateKey, d.expense]))
    const built = buildWeeks(from, to, expenseByKey)
    return {
      ...built,
      bucketOf: buildBucketFn(dailyData.map((d) => d.expense)),
    }
  }, [dailyData, from, to, weekStart])

  const cellStyle = compact ? styles.cellCompact : styles.cell
  const cellColor = (bucket: number) =>
    bucket === 0
      ? `${theme.colors.onSurface}1F`
      : `${theme.colors.primary}${BUCKET_OPACITY[bucket]}`

  // M/W/F row labels — offsets 1/3/5 relative to a Sunday-start week
  const dayLabels = compact
    ? null
    : [1, 3, 5].map((day) => ({
        offset: (day - weekStartsOn + 7) % 7,
        label: getWeekdayLabel(day, "narrow"),
      }))

  const grid = (
    <View style={styles.gridRow}>
      {dayLabels && (
        <View style={styles.labelColumn}>
          {Array.from({ length: 7 }, (_, offset) => (
            <View key={String(offset)} style={[cellStyle, styles.labelCell]}>
              <Text variant="muted" style={styles.dayLabel}>
                {dayLabels.find((l) => l.offset === offset)?.label ?? ""}
              </Text>
            </View>
          ))}
        </View>
      )}
      {weeks.map((week) => (
        <View key={week.key} style={styles.weekColumn}>
          {!compact && (
            <Text variant="muted" style={styles.monthLabel} numberOfLines={1}>
              {week.monthLabel}
            </Text>
          )}
          {week.days.map((day, offset) => (
            <View
              key={day?.dateKey ?? `empty-${offset}`}
              style={[
                cellStyle,
                {
                  backgroundColor: day
                    ? cellColor(bucketOf(day.expense))
                    : "transparent",
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  )

  if (compact) return grid

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {grid}
      </ScrollView>
      <View style={styles.legend}>
        <Text variant="muted" style={styles.legendLabel}>
          {t("screens.stats.calendar.less")}
        </Text>
        {BUCKET_OPACITY.map((_, bucket) => (
          <View
            key={String(bucket)}
            style={[styles.cell, { backgroundColor: cellColor(bucket) }]}
          />
        ))}
        <Text variant="muted" style={styles.legendLabel}>
          {t("screens.stats.calendar.more")}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: 10,
  },
  gridRow: {
    flexDirection: "row",
    gap: 3,
  },
  labelColumn: {
    gap: 3,
    marginTop: 16,
  },
  labelCell: {
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  weekColumn: {
    gap: 3,
  },
  monthLabel: {
    fontSize: 9,
    height: 13,
    overflow: "visible",
  },
  dayLabel: {
    fontSize: 9,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  cellCompact: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 1,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  legendLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
  },
}))
