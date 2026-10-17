import { describe, expect, it } from "vitest"

import {
  formatAmountPreview,
  formatAmountText,
} from "~/components/smart-amount-input/format-amount"
import { minorUnitsToDecimalString, parseMajorUnits } from "~/utils/money"

describe("formatAmountText", () => {
  it("groups a positive amount and leaves the symbol to the field", () => {
    expect(formatAmountText(100_050, "USD")).toBe("1,000.5")
  })

  it("keeps the minus sign of a negative amount", () => {
    expect(formatAmountText(-100_050, "USD")).toBe("-1,000.5")
  })

  it("keeps the minus sign for a currency without decimals", () => {
    expect(formatAmountText(-500, "JPY")).toBe("-500")
  })

  it("keeps the minus sign for a small negative amount", () => {
    expect(formatAmountText(-5, "USD")).toBe("-0.05")
  })

  it("is empty for zero", () => {
    expect(formatAmountText(0, "USD")).toBe("")
  })

  it("shows the same sign as the field does once it is focused", () => {
    for (const minor of [-100_050, -5, 100_050]) {
      const focused = minorUnitsToDecimalString(minor, "USD")
      expect(formatAmountText(minor, "USD").startsWith("-")).toBe(
        focused.startsWith("-"),
      )
      // And what is focused parses back to the same amount.
      expect(parseMajorUnits(focused, "USD")).toBe(minor)
    }
  })
})

describe("formatAmountPreview", () => {
  it("shows a negative result of a calculation with its sign", () => {
    expect(formatAmountPreview(-500, "USD")).toContain("-")
    expect(formatAmountPreview(-500, "USD")).toContain("5")
  })

  it("shows a positive result without one", () => {
    expect(formatAmountPreview(500, "USD")).not.toContain("-")
  })
})
