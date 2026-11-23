import { describe, expect, it } from "vitest"

import {
  isOnPaceToExceed,
  paceOverageMinor,
  projectedSpendMinor,
} from "~/utils/pace-alert"

const base = { limitMinor: 10_000, totalDays: 30 }

describe("pace alert", () => {
  it("projects the run-rate to the period end", () => {
    expect(
      projectedSpendMinor({ ...base, spentMinor: 5_000, elapsedDays: 10 }),
    ).toBe(15_000)
  })

  it("fires when the projection beats the limit by more than the sensitivity", () => {
    const input = { ...base, spentMinor: 4_000, elapsedDays: 10 } // → 12 000
    expect(isOnPaceToExceed(input, 0.1)).toBe(true) // > 11 000
    expect(isOnPaceToExceed(input, 0.25)).toBe(false) // not > 12 500
    expect(paceOverageMinor(input)).toBe(2_000)
  })

  it("stays quiet when under pace", () => {
    expect(
      isOnPaceToExceed({ ...base, spentMinor: 1_000, elapsedDays: 10 }, 0.1),
    ).toBe(false)
  })

  it("stays quiet when already over the limit", () => {
    expect(
      isOnPaceToExceed({ ...base, spentMinor: 10_000, elapsedDays: 10 }, 0.1),
    ).toBe(false)
  })

  it("stays quiet on the last day and for a zero limit", () => {
    expect(
      isOnPaceToExceed({ ...base, spentMinor: 9_900, elapsedDays: 30 }, 0.1),
    ).toBe(false)
    expect(
      isOnPaceToExceed(
        { limitMinor: 0, totalDays: 30, spentMinor: 1, elapsedDays: 1 },
        0.1,
      ),
    ).toBe(false)
  })

  it("fires on day one for a big first-day spend", () => {
    expect(
      isOnPaceToExceed({ ...base, spentMinor: 2_000, elapsedDays: 1 }, 0.1),
    ).toBe(true)
  })
})
