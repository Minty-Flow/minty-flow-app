import { endOfDay } from "date-fns"
import type { RRuleSet } from "rrule"
import * as rruleNs from "rrule"

import type { Recurrence, RecurrenceUnit } from "~/types/transactions"

// rrule publishes a CJS bundle flagged `__esModule` with no genuine default
// export. Metro surfaces its members on the namespace object; Node's ESM loader
// (used by scripts/checks/verify-recurrence.mts) nests them under `.default`.
// Normalise to one shape so both runtimes work.
type RRuleModule = typeof import("rrule")
const rrulePkg: RRuleModule =
  "RRule" in rruleNs
    ? (rruleNs as RRuleModule)
    : (rruleNs as unknown as { default: RRuleModule }).default
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
 * Build an RRULE string from "every {interval} {unit}", a start date, and an
 * optional end date. `until` is normalised to end-of-day (device-local) so an
 * "until Oct 16" rule includes every occurrence that falls on Oct 16.
 * RRule handles month-end roll-over (Jan 31 -> Feb 28/29); never do raw
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
  const rule = new RRule({
    freq: FREQ_BY_UNIT[recurrence.unit],
    interval: clampInterval(recurrence.interval),
    dtstart: startDate,
    until: endDate,
  })
  return rule.between(startDate, endDate, true).length
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

  const rrule = parseRRule(ruleStrings[0])
  const fromDate = new Date(range.from)
  const toDate = new Date(range.to)
  if (anchor.getTime() > toDate.getTime()) return null

  const anchorBeforeRange = anchor.getTime() < fromDate.getTime()
  const start = anchorBeforeRange ? fromDate : anchor
  const next = rrule.after(start, anchorBeforeRange)
  if (!next) return null
  if (next.getTime() > range.to) return null
  return next
}
