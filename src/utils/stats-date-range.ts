import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns"

import type { StatsDateRange, StatsDateRangePreset } from "~/types/stats"
import type { DateRangePresetId } from "~/utils/time-utils"
import {
  endOfAppWeek,
  formatDateKey,
  formatDayYear,
  formatShortMonthDay,
  formatShortMonthDayYear,
  formatShortMonthName,
  getAppWeek,
  getDisplayMonthTitle,
  startOfAppWeek,
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
      const from = startOfAppWeek(now)
      const to = endOfAppWeek(now)
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

    case "allTime": {
      // TODO: transactions dated before 2000 are excluded. The floor is a fixed
      // date rather than MIN(transaction_date) because `from` sizes a per-day
      // bucket array; the epoch would double it to ~20k entries to cover a case
      // that shouldn't happen. Query the real minimum if it ever does.
      const from = startOfYear(new Date(2000, 0, 1))
      const to = endOfDay(now)
      // No prior period exists. `fetchAllStatsData` detects that via
      // `previousFrom === from` and reports no previous rather than comparing
      // the range against itself.
      return {
        preset,
        from,
        to,
        previousFrom: from,
        previousTo: to,
        interval: "year",
      }
    }

    case "custom": {
      const from = customFrom ? startOfDay(customFrom) : startOfMonth(now)
      const to = customTo ? endOfDay(customTo) : endOfMonth(now)
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
      const exhaustive: never = preset
      throw new Error(`buildStatsDateRange: unhandled preset "${exhaustive}"`)
    }
  }
}

/**
 * Given a date and interval, produce a chart x-axis label.
 * Day → "Mar 5", Week → "W10", Month → "Mar"
 */
export function formatIntervalLabel(
  date: Date,
  interval: "day" | "week" | "month" | "year",
): string {
  switch (interval) {
    case "day":
      return formatShortMonthDay(date)
    case "week":
      return `W${getAppWeek(date)}`
    case "month":
      return formatShortMonthName(date)
    case "year":
      return String(date.getFullYear())
  }
}

/**
 * Generate all bucket start-dates in order for the given interval.
 * Used to fill gaps so days with zero transactions still appear on chart.
 */
export function generateDateBuckets(
  from: Date,
  to: Date,
  interval: "day" | "week" | "month" | "year",
): Date[] {
  const buckets: Date[] = []
  let cursor =
    interval === "week"
      ? startOfAppWeek(from)
      : interval === "month"
        ? startOfMonth(from)
        : interval === "year"
          ? startOfYear(from)
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
      case "year":
        cursor = addYears(cursor, 1)
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
 * Previous period = previous calendar month
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

/**
 * Whether the given preset supports chevron navigation.
 * `last30` and `allTime` are static ranges — no navigation.
 */
export function canNavigate(preset: DateRangePresetId): boolean {
  return preset !== "last30" && preset !== "allTime"
}

/**
 * Shift the date range by one unit in the given direction, preserving the preset.
 * Returns the same range unchanged for non-navigable presets.
 */
export function navigateRange(
  range: StatsDateRange,
  preset: DateRangePresetId,
  direction: "prev" | "next",
): StatsDateRange {
  const d = direction === "next" ? 1 : -1

  switch (preset) {
    case "thisWeek": {
      const from = addWeeks(range.from, d)
      const to = addWeeks(range.to, d)
      const previousFrom = addWeeks(range.previousFrom, d)
      const previousTo = addWeeks(range.previousTo, d)
      return { ...range, from, to, previousFrom, previousTo }
    }

    case "thisMonth":
    case "byMonth": {
      const from = addMonths(range.from, d)
      const to = endOfMonth(from)
      const previousFrom = addMonths(range.previousFrom, d)
      const previousTo = endOfMonth(previousFrom)
      return { ...range, from, to, previousFrom, previousTo }
    }

    case "thisYear":
    case "byYear": {
      const from = addYears(range.from, d)
      const to = endOfYear(from)
      const previousFrom = addYears(range.previousFrom, d)
      const previousTo = endOfYear(previousFrom)
      return { ...range, from, to, previousFrom, previousTo }
    }

    case "custom": {
      const spanDays = differenceInDays(range.to, range.from)
      const shift = (spanDays + 1) * d
      const from = addDays(range.from, shift)
      const to = addDays(range.to, shift)
      const previousTo = subDays(from, 1)
      const previousFrom = subDays(previousTo, spanDays)
      return { ...range, from, to, previousFrom, previousTo }
    }

    case "last30":
    case "allTime":
      return range
  }
}

/**
 * Produce a human-readable pill label for the navigator based on the active preset.
 * Note: `last30` and `allTime` are handled by the caller via i18n — this function
 * returns empty strings for those cases.
 */
export function formatNavigatorLabel(
  range: StatsDateRange,
  preset: DateRangePresetId,
): string {
  switch (preset) {
    case "thisMonth":
    case "byMonth":
      return getDisplayMonthTitle(
        range.from.getFullYear(),
        range.from.getMonth(),
      )
    case "thisYear":
    case "byYear":
      return String(range.from.getFullYear())
    case "thisWeek":
      return `${formatShortMonthDay(range.from)} – ${formatShortMonthDay(range.to)}`
    case "last30":
    case "allTime":
      return ""
    case "custom":
      return formatRangeLabel(range)
  }
}
