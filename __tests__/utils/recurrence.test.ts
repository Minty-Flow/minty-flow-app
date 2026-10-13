import { describe, expect, it } from "vitest"

import { countOccurrencesBetween, parseRecurrence } from "~/utils/recurrence"

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
