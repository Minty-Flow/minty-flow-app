#!/usr/bin/env node
import assert from "node:assert/strict"
import { endOfDay } from "date-fns"
import RRulePkg from "rrule"
const { RRule } = RRulePkg

import {
  buildRRuleString,
  clampInterval,
  countOccurrencesBetween,
  parseRecurrence,
} from "../../src/utils/recurrence.ts"

// clampInterval
assert.equal(clampInterval(0), 1)
assert.equal(clampInterval(2.9), 2)
assert.equal(clampInterval(5000), 999)
assert.equal(clampInterval(Number.NaN), 1)

// build -> parse round-trip
const s = new Date(2026, 0, 1, 9, 0, 0)
for (const r of [
  { interval: 1, unit: "day" },
  { interval: 2, unit: "week" },
  { interval: 3, unit: "month" },
  { interval: 1, unit: "year" },
] as const) {
  const str = buildRRuleString({ ...r, startDate: s })
  assert.deepEqual(parseRecurrence(str), r, `round-trip ${r.interval} ${r.unit}`)
}

// legacy strings parse
assert.deepEqual(parseRecurrence("RRULE:FREQ=WEEKLY;INTERVAL=2"), {
  interval: 2,
  unit: "week",
}) // migrated "biweekly"
assert.deepEqual(parseRecurrence("RRULE:FREQ=MONTHLY"), {
  interval: 1,
  unit: "month",
}) // missing INTERVAL -> 1

// garbage -> fallback, never throws
assert.deepEqual(parseRecurrence("not an rrule"), { interval: 1, unit: "month" })
assert.deepEqual(parseRecurrence(""), { interval: 1, unit: "month" })

// countOccurrencesBetween counts the FIRST occurrence
const start = new Date(2026, 0, 1)
const until = new Date(2026, 0, 29) // Jan 1, 8, 15, 22, 29 -> 5
assert.equal(
  countOccurrencesBetween(start, until, { interval: 1, unit: "week" }),
  5,
)
// every 2 weeks Jan 1 .. Jan 29 -> Jan 1, 15, 29 -> 3
assert.equal(
  countOccurrencesBetween(start, until, { interval: 2, unit: "week" }),
  3,
)
// until before start -> 0
assert.equal(
  countOccurrencesBetween(until, start, { interval: 1, unit: "day" }),
  0,
)

// parseRecurrence clamps INTERVAL > 999 to 999
assert.deepEqual(parseRecurrence("RRULE:FREQ=WEEKLY;INTERVAL=5000"), {
  interval: 999,
  unit: "week",
})

// until-day occurrence: buildRRuleString normalizes until to end-of-day, so an
// occurrence that falls on the same day as until is counted
const dayStart = new Date(2026, 0, 10, 0, 0, 0)
const dayEnd = new Date(2026, 0, 10, 23, 59, 59)
assert.equal(
  countOccurrencesBetween(dayStart, dayEnd, { interval: 1, unit: "day" }),
  1,
)

// count==spawn: countOccurrencesBetween should equal the number of rrule.between entries
// this pins the contract with the recurring synchroniser
const from = new Date(2026, 2, 1, 8, 0, 0)
const untilEod = endOfDay(new Date(2026, 5, 1))
for (const rec of [
  { interval: 1, unit: "week" },
  { interval: 2, unit: "week" },
  { interval: 1, unit: "month" },
] as const) {
  const n = countOccurrencesBetween(from, untilEod, rec)
  const spawned = new RRule({
    freq: { day: RRule.DAILY, week: RRule.WEEKLY, month: RRule.MONTHLY, year: RRule.YEARLY }[rec.unit],
    interval: rec.interval,
    dtstart: from,
    until: untilEod,
  }).between(from, untilEod, true).length
  assert.equal(n, spawned, `count==spawn for ${rec.interval} ${rec.unit}`)
}

console.log("recurrence: OK")
