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
  /** Month label shown above the column containing the month's first visible day. */
  monthLabel: string
  /** 7 cells, index = offset from week start; null = outside range */
  days: ({
    dateKey: string
    expense: number
  } | null)[]
}
interface SpendingHeatmapProps {
  dailyData: DailyDataPoint[]
  from: Date
  to: Date
  /** Grid-card variant: smaller cells, no labels/legend, no scroll */
  compact?: boolean
}
function buildWeeks(
  from: Date,
  to: Date,
  expenseByKey: Map<string, number>,
  weekStartsOn: number,
) {
  if (from > to) return []

  const days = eachDayOfInterval({ start: from, end: to })
  const firstDateKey = formatDateKey(from)
  const weeks: HeatmapWeek[] = []
  for (const day of days) {
    const weekKey = formatDateKey(startOfAppWeek(day, weekStartsOn))
    let week = weeks[weeks.length - 1]
    if (!week || week.key !== weekKey) {
      week = {
        key: weekKey,
        monthLabel: "",
        days: Array(7).fill(null),
      }
      weeks.push(week)
    }
    const offset = (day.getDay() - weekStartsOn + 7) % 7
    const dateKey = formatDateKey(day)
    if (!week.monthLabel && (dateKey === firstDateKey || day.getDate() === 1)) {
      week.monthLabel = formatShortMonthName(day).slice(0, 2)
    }
    week.days[offset] = { dateKey, expense: expenseByKey.get(dateKey) ?? 0 }
  }
  return weeks
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
  const weekStartsOn = useWeekStartStore(() => getWeekStartsOn())
  const { weeks, bucketOf } = useMemo(() => {
    const expenseByKey = new Map(dailyData.map((d) => [d.dateKey, d.expense]))
    return {
      weeks: buildWeeks(from, to, expenseByKey, weekStartsOn),
      bucketOf: buildBucketFn(dailyData.map((d) => d.expense)),
    }
  }, [dailyData, from, to, weekStartsOn])
  const cellStyle = compact ? styles.cellCompact : styles.cell
  const cellColor = (bucket: number) =>
    bucket === 0
      ? `${theme.colors.onSurface}1F`
      : `${theme.colors.primary}${BUCKET_OPACITY[bucket]}`
  // Keep GitHub-style M/W/F anchors, plus S when the week visibly starts on weekend.
  const dayLabels = useMemo(() => {
    if (compact) return null
    const labels = [1, 3, 5].map((day) => ({
      offset: (day - weekStartsOn + 7) % 7,
      label: getWeekdayLabel(day, "narrow"),
    }))
    if (weekStartsOn === 0 || weekStartsOn === 6) {
      labels.unshift({
        offset: 0,
        label: getWeekdayLabel(weekStartsOn, "narrow"),
      })
    }
    return labels
  }, [compact, weekStartsOn])
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
        <View
          key={week.key}
          style={compact ? styles.weekColumnCompact : styles.weekColumn}
        >
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
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 5,
  },
  labelColumn: {
    gap: 5,
    marginTop: 23,
  },
  labelCell: {
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  weekColumn: {
    width: 16,
    gap: 5,
  },
  weekColumnCompact: {
    width: 8,
    gap: 5,
  },
  monthLabel: {
    fontSize: 11,
    height: 18,
    lineHeight: 16,
    overflow: "visible",
  },
  dayLabel: {
    fontSize: 11,
    lineHeight: 16,
  },
  cell: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  cellCompact: {
    width: 8,
    height: 8,
    borderRadius: 2,
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
