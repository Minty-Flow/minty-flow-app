import { RRule, type RRuleSet, rrulestr } from "rrule"

import type { RecurringFrequency } from "~/types/transactions"

interface TimeRange {
  from: number // Unix ms
  to: number // Unix ms
}

const FREQ_MAP: Record<NonNullable<RecurringFrequency>, number> = {
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  biweekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
  yearly: RRule.YEARLY,
}

/**
 * Build an RRULE string from the form's recurring frequency, start date, and optional end conditions.
 * - For "biweekly" we use WEEKLY with interval 2.
 * - `until` and `count` are mutually exclusive in RRULE spec.
 * - RRule handles month-end (e.g. Jan 31 → Feb 28/29); avoid raw setMonth/setDate for intervals.
 */
export function buildRRuleString(opts: {
  frequency: NonNullable<RecurringFrequency>
  startDate: Date
  endDate?: Date | null
  count?: number | null
}): string {
  const freq = FREQ_MAP[opts.frequency]
  const interval = opts.frequency === "biweekly" ? 2 : 1

  const rule = new RRule({
    freq,
    interval,
    dtstart: opts.startDate,
    ...(opts.endDate ? { until: opts.endDate } : {}),
    ...(opts.count ? { count: opts.count } : {}),
  })

  return rule.toString()
}

/**
 * Safely parse an RRULE string that may contain a DTSTART line.
 *
 * `RRule.fromString` can silently drop the DTSTART prefix in some versions
 * of the rrule library.  `rrulestr()` handles the full RFC format correctly
 * and always preserves the DTSTART, so we prefer it.  Fall back to
 * `RRule.fromString` only when `rrulestr` is unavailable or fails.
 */
function parseRRule(ruleString: string): RRule {
  try {
    // rrulestr handles multi-line "DTSTART:…\nRRULE:…" correctly
    const result = rrulestr(ruleString)
    // rrulestr may return an RRuleSet when there are multiple rules;
    // for our purposes we always store a single rule, so unwrap if needed.
    if (result instanceof RRule) return result
    // rrulestr may return an RRuleSet for multi-line DTSTART+RRULE strings.
    // The typings declare only RRule so we cast via unknown; use the public
    // rrules() API instead of the private _rrule field.
    const rules = (result as unknown as RRuleSet).rrules()
    if (rules.length > 0) return rules[0]
    throw new Error(`rrulestr produced empty RRuleSet for: ${ruleString}`)
  } catch {
    return RRule.fromString(ruleString)
  }
}

/**
 * Count how many times a recurrence occurs between startDate (inclusive) and endDate (inclusive).
 * Uses the same frequency/interval logic as buildRRuleString (e.g. biweekly = every 2 weeks).
 */
export function countOccurrencesBetween(
  startDate: Date,
  endDate: Date,
  frequency: NonNullable<RecurringFrequency>,
): number {
  if (endDate.getTime() < startDate.getTime()) return 0
  const freq = FREQ_MAP[frequency]
  const interval = frequency === "biweekly" ? 2 : 1
  const rule = new RRule({
    freq,
    interval,
    dtstart: startDate,
    until: endDate,
  })
  // rule.between() avoids materializing an unbounded array; inc=true makes both ends inclusive.
  const occurrences = rule.between(startDate, endDate, true)
  return occurrences.length
}

/**
 * Get the next occurrence **strictly after** `anchor` that falls within
 * the given range.  Returns null if no next occurrence exists in range.
 *
 * Matches the Flutter `Recurrence.nextAbsoluteOccurrence(anchor, subrange:)`
 * behaviour:
 * - When anchor < range.from → use inclusive search from range.from so the
 *   first occurrence itself is not skipped.
 * - When anchor >= range.from → exclusive search so we skip the already-
 *   generated occurrence at anchor.
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

  // When anchor < fromDate we need inclusive search (inc=true) so we don't
  // miss an occurrence that falls exactly on fromDate.
  // When anchor >= fromDate we need exclusive search (inc=false) to skip
  // the already-generated occurrence at anchor.
  const anchorBeforeRange = anchor.getTime() < fromDate.getTime()
  const start = anchorBeforeRange ? fromDate : anchor
  const next = rrule.after(start, anchorBeforeRange)
  if (!next) return null
  if (next.getTime() > range.to) return null
  return next
}
