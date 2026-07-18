/**
 * Owns every date operation that depends on app state — the active locale
 * (formatting) and the first day of the week (`getWeekStartsOn`). Anything that
 * reads one of those must live here so the policy is applied in exactly one
 * place; callers that reach for date-fns directly are how those settings drift.
 *
 * Locale-independent math (`startOfMonth`, `addDays`, `differenceInDays`, …) is
 * deliberately NOT re-exported: it carries no policy, and importing it straight
 * from date-fns keeps the import site honest about whether app state is involved.
 * If a future setting makes that math app-aware too — a user-configurable week
 * start, a fiscal year, a fixed reporting timezone — then that assumption breaks
 * and everything date-related should be exported from this file instead.
 */

import {
  addWeeks,
  type Day,
  endOfWeek,
  type FormatOptions,
  format,
  formatDistanceToNow,
  getWeek,
  isSameWeek,
  isThisWeek,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  type Locale,
  startOfWeek,
  subWeeks,
} from "date-fns"
import { ar, enUS } from "date-fns/locale"

import i18n from "~/i18n/config"
import { LangCodeEnum, type LangCodeType } from "~/i18n/language.constants"

import { getWeekStartsOn } from "./get-week-start-on"

const { t } = i18n

const DATE_FNS_LOCALES = {
  [LangCodeEnum.EN]: enUS,
  [LangCodeEnum.AR]: ar,
} as const

export type DateRangePresetId =
  | "last30"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"
  | "allTime"
  | "byMonth"
  | "byYear"
  | "custom"

type DateInput = Date | string | number | undefined | null

/** * Using localized date-fns tokens:
 * P = localized date (05/29/1453)
 * PP = localized medium date (May 29, 1453)
 * p = localized time (12:00 AM)
 * PPpp = localized date and time
 */
const FORMAT = {
  DAY_NAME: "EEEE",
  ORDINAL_DAY: "do",
  MONTH_DAY: "MMMM d",
  DATE_KEY: "yyyy-MM-dd",
  DATE_TITLE: "EEEE, MMM d",
  HOUR_KEY: "yyyy-MM-dd-HH",
  HOUR_TITLE: "MMM d, yyyy h a",
  WEEK_KEY: "RRRR-'W'II",
  WEEK_TITLE_SHORT: "MMM d",
  SHORT_MONTH_DAY: "MMM d",
  MONTH_KEY: "yyyy-MM",
  MONTH_TITLE: "MMMM yyyy",
  YEAR: "yyyy",
  FRIENDLY_FALLBACK: "P",
  CREATED_AT: "PPpp",
  READABLE_TIME: "p",
  LOAN_DATE: "PP",
  MONTH_NAME: "LLLL",
  MONTH_NAME_YEAR: "LLLL yyyy",
  SHORT_MONTH_NAME: "MMM",
  DAY_YEAR: "d, yyyy",
  SHORT_MONTH_DAY_YEAR: "MMM d, yyyy",
  SHORT_DAY_NAME: "EEE",
  DAY_INITIAL: "EEEEE",
  DAY_OF_MONTH: "d",
} as const

// Helper to get the current locale object from the store
/**
 * Return the current date-fns Locale object (from i18n).
 * Exported so components can default to app locale when caller doesn't pass a locale.
 */
function getCurrentLocale(): Locale {
  const code = (i18n.language || LangCodeEnum.EN) as LangCodeType
  return (DATE_FNS_LOCALES[code] as Locale) || enUS
}

function fmt(
  date: string | number | Date,
  formatStr: string,
  options?: FormatOptions | undefined,
): string {
  return format(date, formatStr, { locale: getCurrentLocale(), ...options })
}

function toDate(date: DateInput): Date | null {
  if (date == null) return null
  const dateObj = date instanceof Date ? date : new Date(date)
  return isValid(dateObj) ? dateObj : null
}

/**
 * Week boundaries honouring the user's week-start setting (device region when
 * that setting is "auto").
 *
 * Never call date-fns `startOfWeek`/`endOfWeek`/`isSameWeek`/`getWeek` directly:
 * their default is Sunday and passing an explicit `weekStartsOn: 1` hardcodes
 * Monday. Either way the app disagrees with itself across screens for anyone
 * whose week starts elsewhere.
 */
export function startOfAppWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: getWeekStartsOn() })
}

export function endOfAppWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: getWeekStartsOn() })
}

function isSameAppWeek(a: Date, b: Date): boolean {
  return isSameWeek(a, b, { weekStartsOn: getWeekStartsOn() })
}

/**
 * Week-of-year number anchored to the app's week start — unlike `getISOWeek`,
 * which is always Monday-anchored and drifts a week off its own buckets.
 */
export function getAppWeek(date: Date): number {
  return getWeek(date, { weekStartsOn: getWeekStartsOn() })
}

function formatWithPattern(date: DateInput, pattern: string): string {
  const dateObj = toDate(date)
  if (!dateObj) return ""

  // Pass the locale here
  return fmt(dateObj, pattern)
}

/**
 * Formats time in a human-readable way (e.g., "3:42 PM").
 *
 * @param date - Date to format
 * @returns Formatted time string or "Unknown" if invalid
 */
export function formatReadableTime(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")
  return fmt(dateObj, FORMAT.READABLE_TIME)
}

/** FRIENDLY: "Today", "Last Wednesday", etc. */
export function formatFriendlyDate(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")

  if (isToday(dateObj)) return t("dates.today")
  if (isYesterday(dateObj)) return t("dates.yesterday")
  if (isTomorrow(dateObj)) return t("dates.tomorrow")

  const now = new Date()

  if (isThisWeek(dateObj, { weekStartsOn: getWeekStartsOn() as Day })) {
    return t("dates.thisDay", {
      day: fmt(dateObj, FORMAT.DAY_NAME),
    })
  }

  if (isSameAppWeek(dateObj, startOfAppWeek(subWeeks(now, 1)))) {
    return t("dates.lastDay", {
      day: fmt(dateObj, FORMAT.DAY_NAME),
    })
  }

  if (isSameAppWeek(dateObj, startOfAppWeek(addWeeks(now, 1)))) {
    return t("dates.nextDay", {
      day: fmt(dateObj, FORMAT.DAY_NAME),
    })
  }

  return fmt(dateObj, FORMAT.FRIENDLY_FALLBACK)
}

/**
 * Formats a date as "yyyy-MM-dd" for stable grouping/sorting keys.
 *
 * @param date - Date to format
 * @returns Formatted date string or empty string if invalid
 */
export function formatDateKey(date: DateInput): string {
  return formatWithPattern(date, FORMAT.DATE_KEY)
}

/** Day name (e.g. "Wednesday") — for recurrence labels. */
export function formatDayName(date: DateInput): string {
  return formatWithPattern(date, FORMAT.DAY_NAME)
}

/** Ordinal day (e.g. "15th") — for recurrence labels. */
export function formatOrdinalDay(date: DateInput): string {
  return formatWithPattern(date, FORMAT.ORDINAL_DAY)
}

/** Month and day (e.g. "January 15") — for recurrence labels. */
export function formatMonthDay(date: DateInput): string {
  return formatWithPattern(date, FORMAT.MONTH_DAY)
}

/** Hour-grouping key (e.g. "2025-02-15-14"). */
export function formatHourKey(date: DateInput): string {
  return formatWithPattern(date, FORMAT.HOUR_KEY)
}

/** Hour-grouping title (e.g. "Feb 15, 2025 2 PM"). */
export function formatHourTitle(date: DateInput): string {
  return formatWithPattern(date, FORMAT.HOUR_TITLE)
}

/** ISO week key (e.g. "2025-W07"). Pass week start date. */
export function formatWeekKey(weekStart: DateInput): string {
  return formatWithPattern(weekStart, FORMAT.WEEK_KEY)
}

/** WEEK TITLE: "Week of Feb 15" */
export function formatWeekTitle(weekStart: DateInput): string {
  const formatted = formatWithPattern(weekStart, FORMAT.WEEK_TITLE_SHORT)
  return formatted ? t("dates.weekOf", { date: formatted }) : ""
}

/** Short month and day (e.g. "Feb 15") — for range labels and compact headers. */
export function formatShortMonthDay(date: DateInput): string {
  return formatWithPattern(date, FORMAT.SHORT_MONTH_DAY)
}

/** Month-grouping key (e.g. "2025-02"). */
export function formatMonthKey(date: DateInput): string {
  return formatWithPattern(date, FORMAT.MONTH_KEY)
}

/** Month-grouping title (e.g. "February 2025"). */
export function formatMonthTitle(date: DateInput): string {
  return formatWithPattern(date, FORMAT.MONTH_TITLE)
}

/** Year key/title (e.g. "2025"). */
export function formatYear(date: DateInput): string {
  return formatWithPattern(date, FORMAT.YEAR)
}

export function formatSectionDateTitle(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")
  if (isToday(dateObj)) return t("dates.today")
  return formatWithPattern(dateObj, FORMAT.DATE_TITLE)
}

/**
 * Formats a creation date with time (e.g., "Nov 7 2025 09:10 AM").
 *
 * @param date - Date to format
 * @returns Formatted date with time or "Unknown" if invalid
 */
export function formatCreatedAt(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")
  return formatWithPattern(dateObj, FORMAT.CREATED_AT)
}

/** LOAN DATE: Localized medium date (Feb 15, 2024) */
export function formatLoanDate(date: DateInput): string {
  return formatWithPattern(date, FORMAT.LOAN_DATE)
}

/**
 * Return all 12 month names localized (stand-alone form).
 * Uses "LLLL" token (stand-alone month) which is appropriate for UI labels.
 */
export function getMonthNames(): string[] {
  // Use an arbitrary year where months are stable (no DST weirdness concerns)
  return Array.from({ length: 12 }, (_, i) =>
    fmt(new Date(2026, i, 1), FORMAT.MONTH_NAME),
  )
}

/**
 * Return a display string "March 2026" localized.
 */
export function getDisplayMonthTitle(year: number, monthIndex: number) {
  return fmt(new Date(year, monthIndex, 1), FORMAT.MONTH_NAME_YEAR)
}

/** Short month name (e.g. "Feb"). */
export function formatShortMonthName(date: DateInput): string {
  return formatWithPattern(date, FORMAT.SHORT_MONTH_NAME)
}

/** Stand-alone month name (e.g. "February") — for headings, not full dates. */
export function formatMonthName(date: DateInput): string {
  return formatWithPattern(date, FORMAT.MONTH_NAME)
}

/** Day of month without padding (e.g. "5") — for compact chart axes. */
export function formatDayOfMonth(date: DateInput): string {
  return formatWithPattern(date, FORMAT.DAY_OF_MONTH)
}

/**
 * Localized weekday label by index (0 = Sunday … 6 = Saturday).
 * "short" → "Mon", "narrow" → "M".
 */
export function getWeekdayLabel(
  day: number,
  style: "short" | "narrow" = "short",
): string {
  // 2024-01-07 was a Sunday, so `7 + day` lands on the matching weekday
  return fmt(
    new Date(2024, 0, 7 + day),
    style === "narrow" ? FORMAT.DAY_INITIAL : FORMAT.SHORT_DAY_NAME,
  )
}

/** Relative distance from now (e.g. "3 hours ago"). */
export function formatRelativeToNow(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return ""
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: getCurrentLocale(),
  })
}

/** Day and year (e.g. "15, 2025"). */
export function formatDayYear(date: DateInput): string {
  return formatWithPattern(date, FORMAT.DAY_YEAR)
}

/** Short month, day, and year (e.g. "Feb 15, 2025"). */
export function formatShortMonthDayYear(date: DateInput): string {
  return formatWithPattern(date, FORMAT.SHORT_MONTH_DAY_YEAR)
}

/** Budget custom period range label (e.g. "Jan 15 – Feb 28"), locale-aware. */
export function formatCustomPeriodRange(
  startDate: Date,
  endDate: Date | null,
): string {
  const start = formatShortMonthDay(startDate)
  const end = endDate ? formatShortMonthDay(endDate) : "?"
  return `${start} – ${end}`
}
