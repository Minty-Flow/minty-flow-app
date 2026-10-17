import { describe, expect, it } from "vitest"

import { assertMinorUnits, roundToSafeInteger } from "~/utils/money"

describe("assertMinorUnits", () => {
  it("accepts a safe integer", () => {
    expect(assertMinorUnits(1999)).toBe(1999)
  })

  it("rejects a fractional amount", () => {
    expect(() => assertMinorUnits(19.99)).toThrow()
  })
})

describe("roundToSafeInteger", () => {
  it("rounds half away from zero", () => {
    expect(roundToSafeInteger(2.5)).toBe(3)
    expect(roundToSafeInteger(-2.5)).toBe(-3)
  })
})
