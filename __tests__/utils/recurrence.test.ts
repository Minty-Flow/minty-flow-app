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
})
