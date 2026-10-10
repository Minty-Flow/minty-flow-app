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
  endOfMonth,
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
  startOfMonth,
  startOfWeek,
  subWeeks,
} from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { getCalendars } from "expo-localization"

import i18n from "~/i18n/config"
import { LangCodeEnum, type LangCodeType } from "~/i18n/language.constants"
import {
  type ClockFormatPreference,
  type DateOrderPreference,
  type DateStylePreference,
  useCalendarFormatStore,
} from "~/stores/calendar-format.store"

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
const STATIC_FORMAT = {
  DAY_NAME: "EEEE",
  ORDINAL_DAY: "do",
  DATE_KEY: "yyyy-MM-dd",
  HOUR_KEY: "yyyy-MM-dd-HH",
  WEEK_KEY: "RRRR-'W'II",
  MONTH_KEY: "yyyy-MM",
  MONTH_TITLE: "MMMM yyyy",
  YEAR: "yyyy",
  MONTH_NAME: "LLLL",
  MONTH_NAME_YEAR: "LLLL yyyy",
  SHORT_MONTH_NAME: "MMM",
  DAY_YEAR: "d, yyyy",
  SHORT_DAY_NAME: "EEE",
  DAY_INITIAL: "EEEEE",
  DAY_OF_MONTH: "d",
} as const

type ResolvedDateOrder = Exclude<DateOrderPreference, "default">

const NUMERIC_PATTERN: Record<ResolvedDateOrder, string> = {
  mdy: "MM/dd/yyyy",
  dmy: "dd/MM/yyyy",
  ymd: "yyyy/MM/dd",
  ydm: "yyyy/dd/MM",
}
/** Spelled-out day, current year left off: "October 10" / "10 October". */
const WORDS_PATTERN: Record<ResolvedDateOrder, string> = {
  mdy: "MMMM d",
  dmy: "d MMMM",
  ymd: "MMMM d",
  ydm: "d MMMM",
}
/** Spelled-out day with the year: "October 10, 2025". */
const WORDS_YEAR_PATTERN: Record<ResolvedDateOrder, string> = {
  mdy: "MMMM d, yyyy",
  dmy: "d MMMM yyyy",
  ymd: "yyyy MMMM d",
  ydm: "yyyy d MMMM",
}

/** "default" follows the app language: Arabic reads day-first, English month-first. */
function resolveDateOrder(order: DateOrderPreference): ResolvedDateOrder {
  if (order !== "default") return order
  return i18n.language === LangCodeEnum.AR ? "dmy" : "mdy"
}

function dateOrder(): ResolvedDateOrder {
  return resolveDateOrder(useCalendarFormatStore.getState().dateOrder)
}

/** The device's 12h/24h clock setting, or undefined when it can't be read. */
function deviceUses24HourClock(): boolean | undefined {
  try {
    return getCalendars()[0]?.uses24hourClock ?? undefined
  } catch {
    return undefined
  }
}

export function resolveClockFormat(pref: ClockFormatPreference): "12h" | "24h" {
  if (pref !== "auto") return pref
  return deviceUses24HourClock() ? "24h" : "12h"
}

/** Clock part, honouring the 12h / 24h preference. */
function timePattern(): string {
  const pref = useCalendarFormatStore.getState().clockFormat
  if (pref === "auto" && deviceUses24HourClock() === undefined) return "p"
  return resolveClockFormat(pref) === "24h" ? "HH:mm" : "h:mm a"
}

function relativeDayWord(date: Date): string | null {
  if (isToday(date)) return t("dates.today")
  if (isYesterday(date)) return t("dates.yesterday")
  if (isTomorrow(date)) return t("dates.tomorrow")
  return null
}

/**
 * The app's day label in the user's date style and order. Full and Numeric show
 * just "Today" / "Yesterday" / "Tomorrow" on those days (no date after it) and
 * the date otherwise; Date only and Numeric only always show the date, e.g.
 * "October 10" or "10/10/2026". Spelled-out dates leave the year off for the
 * current year.
 */
function buildDateLabel(
  date: Date,
  style: DateStylePreference,
  orderPref: DateOrderPreference,
): string {
  const order = resolveDateOrder(orderPref)
  const spelledOut = style === "full" || style === "dateOnly"
  const sameYear = date.getFullYear() === new Date().getFullYear()
  const body = spelledOut
    ? fmt(date, sameYear ? WORDS_PATTERN[order] : WORDS_YEAR_PATTERN[order])
    : fmt(date, NUMERIC_PATTERN[order])
  const relative =
    style === "full" || style === "numeric" ? relativeDayWord(date) : null
  return relative ?? body
}

/** A full date for places that always show the year (loans, created-at). */
function buildDateWithYear(date: Date): string {
  const { dateStyle } = useCalendarFormatStore.getState()
  const order = dateOrder()
  const spelledOut = dateStyle === "full" || dateStyle === "dateOnly"
  return fmt(
    date,
    spelledOut ? WORDS_YEAR_PATTERN[order] : NUMERIC_PATTERN[order],
  )
}

/**
 * Preview of a style/order pair for the settings UI, built from the current date
 * so it is never stale. Relative styles show both forms: "Today · October 10";
 * the "only" styles show just the date: "October 10" / "10/10/2026".
 */
export function formatDatePreview(
  date: Date,
  style: DateStylePreference,
  order: DateOrderPreference,
): string {
  const o = resolveDateOrder(order)
  const spelledOut = style === "full" || style === "dateOnly"
  const sameYear = date.getFullYear() === new Date().getFullYear()
  const body = spelledOut
    ? fmt(date, sameYear ? WORDS_PATTERN[o] : WORDS_YEAR_PATTERN[o])
    : fmt(date, NUMERIC_PATTERN[o])
  const relative =
    style === "full" || style === "numeric" ? relativeDayWord(date) : null
  return relative ? `${relative} · ${body}` : body
}

/**
 * The clock split into its visible parts, for the form's time button:
 * 12h -> { hour: "11", minute: "26", period: "PM" }, 24h -> no period.
 */
export function formatTimeParts(date: DateInput): {
  hour: string
  minute: string
  period: string | null
} {
  const dateObj = toDate(date)
  if (!dateObj) return { hour: "--", minute: "--", period: null }
  const is24h =
    resolveClockFormat(useCalendarFormatStore.getState().clockFormat) === "24h"
  return {
    hour: fmt(dateObj, is24h ? "HH" : "h"),
    minute: fmt(dateObj, "mm"),
    period: is24h ? null : fmt(dateObj, "a"),
  }
}

/** Preview of a clock format for the settings screen. */
export function formatClockPreview(date: Date, format: "12h" | "24h"): string {
  return fmt(date, format === "24h" ? "HH:mm" : "h:mm a")
}

/**
 * Format patterns. The date/time ones are getters so they follow the user's
 * calendar-format settings at the moment they are read (never cached).
 * date-fns tokens: P = localized date, PP = medium date, p = localized time.
 */
const FORMAT = {
  ...STATIC_FORMAT,
  get READABLE_TIME() {
    return timePattern()
  },
  get FRIENDLY_FALLBACK() {
    return NUMERIC_PATTERN[dateOrder()]
  },
  get SHORT_MONTH_DAY() {
    return dateOrder() === "dmy" || dateOrder() === "ydm" ? "d MMM" : "MMM d"
  },
  get WEEK_TITLE_SHORT(): string {
    return dateOrder() === "dmy" || dateOrder() === "ydm" ? "d MMM" : "MMM d"
  },
  get MONTH_DAY() {
    return WORDS_PATTERN[dateOrder()]
  },
  get DATE_TITLE() {
    return dateOrder() === "dmy" || dateOrder() === "ydm"
      ? "EEEE, d MMM"
      : "EEEE, MMM d"
  },
  get SHORT_MONTH_DAY_YEAR() {
    return WORDS_YEAR_PATTERN[dateOrder()].replace(/MMMM/g, "MMM")
  },
  get HOUR_TITLE() {
    const hour =
      resolveClockFormat(useCalendarFormatStore.getState().clockFormat) ===
      "24h"
        ? "HH:00"
        : "h a"
    return `${WORDS_YEAR_PATTERN[dateOrder()].replace(/MMMM/g, "MMM")} ${hour}`
  },
}

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
export function startOfAppWeek(date: Date, weekStartsOn?: Day | number): Date {
  return startOfWeek(date, {
    weekStartsOn: (weekStartsOn ?? getWeekStartsOn()) as Day,
  })
}

export function endOfAppWeek(date: Date, weekStartsOn?: Day | number): Date {
  return endOfWeek(date, {
    weekStartsOn: (weekStartsOn ?? getWeekStartsOn()) as Day,
  })
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

  const { dateStyle, dateOrder: orderPref } = useCalendarFormatStore.getState()

  // Today / Yesterday / Tomorrow follow the user's date style.
  if (relativeDayWord(dateObj)) {
    return buildDateLabel(dateObj, dateStyle, orderPref)
  }

  // Weekday names ("This Wednesday") belong to the Full style only; the other
  // styles always show the date itself.
  if (dateStyle === "full") {
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
  }

  return buildDateLabel(dateObj, dateStyle, orderPref)
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
  return `${buildDateWithYear(dateObj)} ${fmt(dateObj, FORMAT.READABLE_TIME)}`
}

/** The day half of the form's date button, in the user's date style and order. */
export function formatTransactionDay(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")
  const { dateStyle, dateOrder: orderPref } = useCalendarFormatStore.getState()
  return buildDateLabel(dateObj, dateStyle, orderPref)
}

/** Day + time in one string: "Today 3:42 PM", "Mar 4 3:42 PM". */
export function formatTransactionDateTime(date: DateInput): string {
  const dateObj = toDate(date)
  if (!dateObj) return t("dates.unknown")
  return `${formatTransactionDay(dateObj)} ${fmt(dateObj, FORMAT.READABLE_TIME)}`
}

/** LOAN DATE: Localized medium date (Feb 15, 2024) */
export function formatLoanDate(date: DateInput): string {
  const dateObj = toDate(date)
  return dateObj ? buildDateWithYear(dateObj) : ""
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

/** Start / end (epoch ms) of a calendar month; `month` is 0-based. */
export function getMonthRange(
  year: number,
  month: number,
): { fromDate: number; toDate: number } {
  const d = new Date(year, month, 1)
  return {
    fromDate: startOfMonth(d).getTime(),
    toDate: endOfMonth(d).getTime(),
  }
}
