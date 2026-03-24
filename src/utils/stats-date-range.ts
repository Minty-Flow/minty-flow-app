import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getISOWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"

import type { StatsDateRange, StatsDateRangePreset } from "~/types/stats"
import {
  formatDateKey,
  formatDayYear,
  formatShortMonthDay,
  formatShortMonthDayYear,
  formatShortMonthName,
} from "~/utils/time-utils"

/**
 * Build a StatsDateRange from a preset string.
 * Calculates from/to, previousFrom/previousTo, and optimal interval.
 */
export function buildStatsDateRange(
  preset: StatsDateRangePreset,
  customFrom?: Date,
  customTo?: Date,
): StatsDateRange {
  const now = new Date()

  switch (preset) {
    case "thisWeek": {
      const from = startOfWeek(now, { weekStartsOn: 1 })
      const to = endOfWeek(now, { weekStartsOn: 1 })
      const prevFrom = subDays(from, 7)
      const prevTo = subDays(to, 7)
      return {
        preset,
        from,
        to,
        previousFrom: prevFrom,
        previousTo: prevTo,
        interval: "day",
      }
    }

    case "thisMonth": {
      const from = startOfMonth(now)
      const to = endOfMonth(now)
      const prevFrom = startOfMonth(subMonths(now, 1))
      const prevTo = endOfMonth(subMonths(now, 1))
      return {
        preset,
        from,
        to,
        previousFrom: prevFrom,
        previousTo: prevTo,
        interval: "day",
      }
    }

    case "last30": {
      const to = now
      const from = startOfDay(subDays(now, 30))
      const prevTo = subDays(from, 1)
      const prevFrom = startOfDay(subDays(prevTo, 29))
      return {
        preset,
        from,
        to,
        previousFrom: prevFrom,
        previousTo: prevTo,
        interval: "day",
      }
    }

    case "thisYear": {
      const from = startOfYear(now)
      const to = endOfYear(now)
      const prevFrom = startOfYear(subYears(now, 1))
      const prevTo = endOfYear(subYears(now, 1))
      return {
        preset,
        from,
        to,
        previousFrom: prevFrom,
        previousTo: prevTo,
        interval: "month",
      }
    }

    case "custom": {
      const from = customFrom ? startOfDay(customFrom) : startOfMonth(now)
      const to = customTo ? startOfDay(customTo) : endOfMonth(now)
      const spanDays = differenceInDays(to, from)
      const interval =
        spanDays <= 14 ? "day" : spanDays <= 90 ? "week" : "month"

      // Mirror the same span into the past
      const prevTo = subDays(from, 1)
      const prevFrom = subDays(prevTo, spanDays)

      return {
        preset,
        from,
        to,
        previousFrom: prevFrom,
        previousTo: prevTo,
        interval,
      }
    }

    default: {
      const _exhaustive: never = preset
      throw new Error(`buildStatsDateRange: unhandled preset "${_exhaustive}"`)
    }
  }
}

/**
 * Given a date and interval, produce a chart x-axis label.
 * Day → "Mar 5", Week → "W10", Month → "Mar"
 */
export function formatIntervalLabel(
  date: Date,
  interval: "day" | "week" | "month",
): string {
  switch (interval) {
    case "day":
      return formatShortMonthDay(date)
    case "week":
      return `W${getISOWeek(date)}`
    case "month":
      return formatShortMonthName(date)
  }
}

/**
 * Generate all bucket start-dates in order for the given interval.
 * Used to fill gaps so days with zero transactions still appear on chart.
 */
export function generateDateBuckets(
  from: Date,
  to: Date,
  interval: "day" | "week" | "month",
): Date[] {
  const buckets: Date[] = []
  let cursor =
    interval === "week"
      ? startOfWeek(from, { weekStartsOn: 1 })
      : interval === "month"
        ? startOfMonth(from)
        : startOfDay(from)

  while (cursor <= to) {
    buckets.push(cursor)
    switch (interval) {
      case "day":
        cursor = addDays(cursor, 1)
        break
      case "week":
        cursor = addWeeks(cursor, 1)
        break
      case "month":
        cursor = addMonths(cursor, 1)
        break
    }
  }

  return buckets
}

/**
 * Human-readable range description for UI header.
 */
export function formatRangeLabel(range: StatsDateRange): string {
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  const sameMonth = sameYear && range.from.getMonth() === range.to.getMonth()

  if (sameMonth) {
    return `${formatShortMonthDay(range.from)} – ${formatDayYear(range.to)}`
  }
  if (sameYear) {
    return `${formatShortMonthDay(range.from)} – ${formatShortMonthDayYear(range.to)}`
  }
  return `${formatShortMonthDayYear(range.from)} – ${formatShortMonthDayYear(range.to)}`
}

/**
 * Format a date as 'yyyy-MM-dd' string key for daily data bucketing.
 */
export function toDateKey(date: Date): string {
  return formatDateKey(date)
}

/**
 * Build a StatsDateRange for a specific calendar month.
 * Previous period = same month one year prior.
 */
export function buildMonthRange(year: number, month: number): StatsDateRange {
  const anchor = new Date(year, month, 1)
  const from = startOfMonth(anchor)
  const to = endOfMonth(anchor)
  const prevAnchor = subMonths(anchor, 1)
  return {
    preset: "custom",
    from,
    to,
    previousFrom: startOfMonth(prevAnchor),
    previousTo: endOfMonth(prevAnchor),
    interval: "day",
  }
}
