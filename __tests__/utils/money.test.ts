import { describe, expect, it } from "vitest"

import {
  assertMinorUnits,
  convertMinorUnits,
  normalizeMajorUnitInput,
  roundToSafeInteger,
} from "~/utils/money"

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

describe("normalizeMajorUnitInput", () => {
  it("reads a pasted amount with a currency symbol", () => {
    expect(normalizeMajorUnitInput("$12.50")).toBe("12.50")
  })

  it("reads a decimal comma", () => {
    expect(normalizeMajorUnitInput("12,5")).toBe("12.5")
    expect(normalizeMajorUnitInput("12,50")).toBe("12.50")
  })

  it("still treats a three-digit group as thousands", () => {
    expect(normalizeMajorUnitInput("1,234.5")).toBe("1234.5")
  })

  it("rejects text with no digits and mixed separators", () => {
    expect(normalizeMajorUnitInput("abc")).toBeNull()
    expect(normalizeMajorUnitInput("12,34.56")).toBeNull()
  })
})

describe("convertMinorUnits", () => {
  it("rounds half away from zero without float drift", () => {
    expect(convertMinorUnits(1005, "USD", "USD", 0.1)).toBe(101)
    expect(convertMinorUnits(-1005, "USD", "USD", 0.1)).toBe(-101)
    expect(convertMinorUnits(5, "USD", "USD", 0.1)).toBe(1)
  })

  it("converts across currencies with different digits", () => {
    expect(convertMinorUnits(10_000, "USD", "JPY", 150)).toBe(15_000)
    expect(convertMinorUnits(1_500, "JPY", "USD", 0.0067)).toBe(1_005)
  })
})
