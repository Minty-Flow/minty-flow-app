import { describe, expect, it } from "vitest"

import { maxAmountInputLength } from "~/components/smart-amount-input/math-utils"

// The cap must keep the biggest accepted text under MAX_SAFE_INTEGER minor
// units, or the field would show digits the form silently drops (map §4.3).
describe("maxAmountInputLength", () => {
  it("never lets a typed major-unit text overflow MAX_SAFE_INTEGER minor units", () => {
    for (const digits of [0, 1, 2, 3, 4, 8]) {
      const maxText = "9".repeat(maxAmountInputLength(digits))
      const minor = BigInt(maxText) * 10n ** BigInt(digits)
      expect(minor <= BigInt(Number.MAX_SAFE_INTEGER)).toBe(true)
    }
  })

  it("keeps a 2-decimal currency at 13 digits", () => {
    expect(maxAmountInputLength(2)).toBe(13)
  })

  it("allows more digits for a 0-decimal currency", () => {
    expect(maxAmountInputLength(0)).toBeGreaterThan(maxAmountInputLength(2))
  })
})
