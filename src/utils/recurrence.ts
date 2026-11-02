import { endOfDay } from "date-fns"
import type { RRuleSet } from "rrule"
import * as rruleNs from "rrule"

import type { Recurrence, RecurrenceUnit } from "~/types/transactions"

// rrule publishes a CJS bundle flagged `__esModule` with no genuine default
// export. Metro surfaces its members on the namespace object; Node's ESM loader
// (used by scripts/checks/verify-recurrence.mts) nests them under `.default`.
// Normalise to one shape so both runtimes work.
type RRuleModule = typeof import("rrule")
type RRuleNamespace = typeof rruleNs
const rrulePkg: RRuleModule =
  "RRule" in rruleNs
    ? (rruleNs as RRuleModule)
    : (rruleNs as RRuleNamespace & { default: RRuleModule }).default
const { RRule, rrulestr } = rrulePkg
type RRule = InstanceType<typeof RRule>

interface TimeRange {
  from: number // Unix ms
  to: number // Unix ms
}

const FREQ_BY_UNIT: Record<RecurrenceUnit, number> = {
  day: RRule.DAILY,
  week: RRule.WEEKLY,
  month: RRule.MONTHLY,
  year: RRule.YEARLY,
}

const UNIT_BY_FREQ: Record<number, RecurrenceUnit> = {
  [RRule.DAILY]: "day",
  [RRule.WEEKLY]: "week",
  [RRule.MONTHLY]: "month",
  [RRule.YEARLY]: "year",
}

/** Clamp any number to an integer in 1..999. */
export function clampInterval(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.min(999, Math.max(1, Math.floor(n)))
}

/**
 * rrule does its arithmetic on the UTC fields of a Date. Feeding it real
 * instants makes a "23:30 on the 14th" rule come out an hour off after a DST
 * change, and puts a rule whose local day differs from its UTC day on the wrong
 * day of the month. These two helpers move a Date's local wall-clock fields
 * into UTC fields and back, so rrule steps in local time.
 */
function toFloating(d: Date): Date {
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds(),
    ),
  )
}

function fromFloating(d: Date): Date {
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds(),
  )
}

type RuleOptions = NonNullable<ConstructorParameters<typeof RRule>[0]>

/**
 * RFC 5545 skips a date that does not exist: a monthly rule from the 31st
 * would fire only in 31-day months. People expect the last day of the month
 * instead (Jan 31, Feb 28, Mar 31, Apr 30), as banking and calendar apps do.
 *
 * BYMONTHDAY lists the start day and every day down to 28, and BYSETPOS=-1
 * keeps the last one that exists in the month, which is the start day or the
 * month's last day. `floatingStart` carries the local wall-clock day in its
 * UTC fields.
 */
function clampToMonthEnd(
  options: RuleOptions,
  floatingStart: Date | null | undefined,
): RuleOptions {
  if (!floatingStart) return options
  if (options.bymonthday != null || options.bysetpos != null) return options
  const day = floatingStart.getUTCDate()

  if (options.freq === RRule.MONTHLY && day > 28) {
    const days = Array.from({ length: day - 27 }, (_, i) => 28 + i)
    return { ...options, bymonthday: days, bysetpos: -1 }
  }
  // Feb 29 exists only in leap years; clamp to Feb 28 in the others.
  if (
    options.freq === RRule.YEARLY &&
    floatingStart.getUTCMonth() === 1 &&
    day === 29 &&
    options.bymonth == null
  ) {
    return { ...options, bymonth: [2], bymonthday: [28, 29], bysetpos: -1 }
  }
  return options
}

/** The same rule, stepping through local wall-clock time. */
function toLocalRule(rule: RRule): RRule {
  const { dtstart, until, ...rest } = rule.origOptions
  const floatingStart = dtstart ? toFloating(dtstart) : null
  return new RRule(
    clampToMonthEnd(
      {
        ...rest,
        ...(floatingStart ? { dtstart: floatingStart } : {}),
        ...(until ? { until: toFloating(until) } : {}),
      },
      floatingStart,
    ),
  )
}

/**
 * Build an RRULE string from "every {interval} {unit}", a start date, and an
 * optional end date. `until` is normalised to end-of-day (device-local) so an
 * "until Oct 16" rule includes every occurrence that falls on Oct 16.
 * The string is plain RFC 5545, which skips months that lack the start day
 * (a monthly rule from Jan 31 would skip February). Occurrences are always
 * read through `toLocalRule`, which clamps those rules to the last day of the
 * month, so existing stored rules follow the same behaviour. Never do raw
 * setMonth/setDate arithmetic for intervals.
 */
export function buildRRuleString(opts: {
  interval: number
  unit: RecurrenceUnit
  startDate: Date
  until?: Date | null
}): string {
  const rule = new RRule({
    freq: FREQ_BY_UNIT[opts.unit],
    interval: clampInterval(opts.interval),
    dtstart: opts.startDate,
    ...(opts.until ? { until: endOfDay(opts.until) } : {}),
  })
  return rule.toString()
}

/**
 * Safely parse an RRULE string that may contain a DTSTART line.
 * `rrulestr` handles the full RFC format; fall back to `RRule.fromString`.
 */
function parseRRule(ruleString: string): RRule {
  try {
    const result = rrulestr(ruleString)
    if (result instanceof RRule) return result
    // rrulestr is typed as RRule but returns an RRuleSet for multi-rule strings.
    const rules = (result as unknown as RRuleSet).rrules()
    if (rules.length > 0) return rules[0]
    throw new Error(`rrulestr produced empty RRuleSet for: ${ruleString}`)
  } catch {
    return RRule.fromString(ruleString)
  }
}

/**
 * How many times the recurrence fires between `startDate` and `endDate`,
 * **inclusive of both ends and of the first occurrence** — exactly what
 * `synchronizeRecurringTransaction` spawns through `endDate`.
 */
export function countOccurrencesBetween(
  startDate: Date,
  endDate: Date,
  recurrence: Recurrence,
): number {
  if (endDate.getTime() < startDate.getTime()) return 0
  const floatingStart = toFloating(startDate)
  const rule = new RRule(
    clampToMonthEnd(
      {
        freq: FREQ_BY_UNIT[recurrence.unit],
        interval: clampInterval(recurrence.interval),
        dtstart: floatingStart,
        until: toFloating(endDate),
      },
      floatingStart,
    ),
  )
  return rule.between(floatingStart, toFloating(endDate), true).length
}

/**
 * Read the interval+unit back out of a stored RRULE string, for the edit
 * screen. Never throws into render:
 *  - missing INTERVAL   -> interval = 1
 *  - FREQ absent / unrecognised, or unparseable string -> { interval: 1, unit: "month" }
 *  - INTERVAL non-integer / < 1 -> Math.max(1, Math.floor(n)); > 999 -> 999
 */
export function parseRecurrence(ruleString: string): Recurrence {
  const fallback: Recurrence = { interval: 1, unit: "month" }
  if (!ruleString?.trim()) return fallback
  try {
    const rule = parseRRule(ruleString)
    const unit = UNIT_BY_FREQ[rule.options.freq]
    if (!unit) return fallback
    const raw = rule.options.interval
    const interval = raw == null ? 1 : clampInterval(raw)
    return { interval, unit }
  } catch {
    return fallback
  }
}

/**
 * Next occurrence strictly after `anchor` within `range`, or null.
 * (Unchanged from the pre-Slice-2 implementation — the synchroniser relies on
 * the inclusive/exclusive `after()` behaviour described below.)
 */
export function nextAbsoluteOccurrence(
  ruleStrings: string[],
  range: TimeRange,
  anchor: Date,
): Date | null {
  if (ruleStrings.length === 0) return null

  const parsed = parseRRule(ruleStrings[0])
  const rrule = toLocalRule(parsed)
  const fromDate = new Date(range.from)
  const toDate = new Date(range.to)
  if (anchor.getTime() > toDate.getTime()) return null

  const anchorBeforeRange = anchor.getTime() < fromDate.getTime()
  const start = anchorBeforeRange ? fromDate : anchor
  const found = rrule.after(toFloating(start), anchorBeforeRange)
  if (!found) return null
  // The rule's own start is an exact instant. Rebuilding it from wall-clock
  // fields would pick the earlier of two instants when a DST change repeats
  // that hour.
  const startInstant = parsed.origOptions.dtstart
  const next =
    startInstant && found.getTime() === toFloating(startInstant).getTime()
      ? startInstant
      : fromFloating(found)
  if (next.getTime() > range.to) return null
  return next
}
