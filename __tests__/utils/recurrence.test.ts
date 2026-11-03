import { describe, expect, it } from "vitest"

import {
  buildRRuleString,
  countOccurrencesBetween,
  nextAbsoluteOccurrence,
  parseRecurrence,
} from "~/utils/recurrence"

describe("countOccurrencesBetween", () => {
  const monthly = { interval: 1, unit: "month" } as const

  it("counts the start date and the end date", () => {
    const count = countOccurrencesBetween(
      new Date("2026-01-15T00:00:00Z"),
      new Date("2026-03-15T00:00:00Z"),
      monthly,
    )
    expect(count).toBe(3)
  })

  it("returns 0 when the end is before the start", () => {
    const count = countOccurrencesBetween(
      new Date("2026-03-15T00:00:00Z"),
      new Date("2026-01-15T00:00:00Z"),
      monthly,
    )
    expect(count).toBe(0)
  })
})

describe("parseRecurrence", () => {
  it("falls back to every month on an unparseable string", () => {
    expect(parseRecurrence("not a rule")).toEqual({
      interval: 1,
      unit: "month",
    })
  })
})

describe("local wall-clock time", () => {
  const original = process.env.TZ
  const inZone = (tz: string, fn: () => void) => () => {
    process.env.TZ = tz
    try {
      fn()
    } finally {
      if (original === undefined) delete process.env.TZ
      else process.env.TZ = original
    }
  }
  const range = (from: Date, to: Date) => ({
    from: from.getTime(),
    to: to.getTime(),
  })
  const rule = (start: Date) => [
    buildRRuleString({ interval: 1, unit: "month", startDate: start }),
  ]

  it(
    "keeps 23:30 across the March DST change in Berlin",
    inZone("Europe/Berlin", () => {
      const start = new Date(2026, 2, 14, 23, 30)
      const next = nextAbsoluteOccurrence(
        rule(start),
        range(start, new Date(2026, 11, 31)),
        start,
      )
      expect(next?.getMonth()).toBe(3)
      expect(next?.getDate()).toBe(14)
      expect(next?.getHours()).toBe(23)
      expect(next?.getMinutes()).toBe(30)
    }),
  )

  it(
    "keeps 00:30 across the October DST change in New York",
    inZone("America/New_York", () => {
      const start = new Date(2026, 9, 3, 0, 30)
      const next = nextAbsoluteOccurrence(
        rule(start),
        range(start, new Date(2026, 11, 31)),
        start,
      )
      expect(next?.getMonth()).toBe(10)
      expect(next?.getDate()).toBe(3)
      expect(next?.getHours()).toBe(0)
      expect(next?.getMinutes()).toBe(30)
    }),
  )

  it(
    "does not move a 1st-of-the-month rule to the 31st east of UTC",
    inZone("Asia/Damascus", () => {
      // 00:30 on the 1st is the 31st of the previous month in UTC.
      const start = new Date(2026, 0, 1, 0, 30)
      let anchor = start
      const days: number[] = []
      for (let i = 0; i < 4; i++) {
        const next = nextAbsoluteOccurrence(
          rule(start),
          range(start, new Date(2027, 0, 1)),
          anchor,
        )
        if (!next) break
        days.push(next.getDate())
        anchor = next
      }
      expect(days).toEqual([1, 1, 1, 1])
    }),
  )

  it(
    "counts occurrences by local day",
    inZone("Europe/Berlin", () => {
      const count = countOccurrencesBetween(
        new Date(2026, 2, 14, 23, 30),
        new Date(2026, 5, 14, 23, 30),
        { interval: 1, unit: "month" },
      )
      expect(count).toBe(4)
    }),
  )

  it(
    "returns the start itself when a DST change repeats its hour",
    inZone("Asia/Beirut", () => {
      // Clocks go back at midnight on 25 Oct 2026, so 23:30 on the 24th happens
      // twice. This is the second one (UTC+2).
      const start = new Date(Date.UTC(2026, 9, 24, 21, 30))
      const first = nextAbsoluteOccurrence(
        rule(start),
        range(start, new Date(2027, 0, 1)),
        new Date(start.getTime() - 1),
      )
      expect(first?.getTime()).toBe(start.getTime())
    }),
  )
})

describe("month-end clamping", () => {
  const range = (from: Date, to: Date) => ({
    from: from.getTime(),
    to: to.getTime(),
  })

  /** Walk the rule the way the recurring sync does. */
  function occurrences(rule: string, start: Date, end: Date): Date[] {
    const out: Date[] = []
    let anchor = new Date(start.getTime() - 1)
    for (let i = 0; i < 100; i++) {
      const next = nextAbsoluteOccurrence([rule], range(start, end), anchor)
      if (!next) break
      out.push(next)
      anchor = next
    }
    return out
  }

  const ymd = (d: Date) => [d.getFullYear(), d.getMonth() + 1, d.getDate()]

  it("clamps a monthly rule from the 31st to each month's last day", () => {
    const start = new Date(2026, 0, 31, 9, 0)
    const rule = buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2026, 5, 30, 23, 59))
    expect(dates.map(ymd)).toEqual([
      [2026, 1, 31],
      [2026, 2, 28],
      [2026, 3, 31],
      [2026, 4, 30],
      [2026, 5, 31],
      [2026, 6, 30],
    ])
  })

  it("clamps February to the 29th in a leap year", () => {
    const start = new Date(2028, 0, 31, 9, 0)
    const rule = buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2028, 2, 31, 23, 59))
    expect(dates.map(ymd)).toEqual([
      [2028, 1, 31],
      [2028, 2, 29],
      [2028, 3, 31],
    ])
  })

  it("keeps the 30th where the month has one and clamps February", () => {
    const start = new Date(2026, 0, 30, 9, 0)
    const rule = buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2026, 3, 30, 23, 59))
    expect(dates.map(ymd)).toEqual([
      [2026, 1, 30],
      [2026, 2, 28],
      [2026, 3, 30],
      [2026, 4, 30],
    ])
  })

  it("steps by the interval before clamping", () => {
    const start = new Date(2026, 0, 31, 9, 0)
    const rule = buildRRuleString({
      interval: 2,
      unit: "month",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2026, 6, 31, 23, 59))
    expect(dates.map(ymd)).toEqual([
      [2026, 1, 31],
      [2026, 3, 31],
      [2026, 5, 31],
      [2026, 7, 31],
    ])
  })

  it("clamps a yearly rule from Feb 29 to Feb 28 in non-leap years", () => {
    const start = new Date(2028, 1, 29, 9, 0)
    const rule = buildRRuleString({
      interval: 1,
      unit: "year",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2032, 11, 31))
    expect(dates.map(ymd)).toEqual([
      [2028, 2, 29],
      [2029, 2, 28],
      [2030, 2, 28],
      [2031, 2, 28],
      [2032, 2, 29],
    ])
  })

  it("leaves a rule from the 28th or earlier alone", () => {
    const start = new Date(2026, 0, 28, 9, 0)
    const rule = buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: start,
    })
    const dates = occurrences(rule, start, new Date(2026, 2, 31))
    expect(dates.map(ymd)).toEqual([
      [2026, 1, 28],
      [2026, 2, 28],
      [2026, 3, 28],
    ])
  })

  it("counts the same occurrences the sync walks", () => {
    const start = new Date(2026, 0, 31, 9, 0)
    const end = new Date(2026, 5, 30, 23, 59)
    const rule = buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: start,
    })
    expect(
      countOccurrencesBetween(start, end, { interval: 1, unit: "month" }),
    ).toBe(occurrences(rule, start, end).length)
    expect(occurrences(rule, start, end)).toHaveLength(6)
  })
})
