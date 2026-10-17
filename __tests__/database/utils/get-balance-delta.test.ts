import { describe, expect, it } from "vitest"

import { getBalanceDelta } from "~/database/utils/get-balance-delta"

describe("getBalanceDelta", () => {
  it("adds income", () => {
    expect(getBalanceDelta(1250, "income")).toBe(1250)
  })

  it("subtracts an expense", () => {
    expect(getBalanceDelta(1250, "expense")).toBe(-1250)
  })

  it("adds a refund", () => {
    expect(getBalanceDelta(1250, "expense", "refund")).toBe(1250)
  })

  it("keeps the stored sign of a transfer leg", () => {
    expect(getBalanceDelta(-500, "transfer")).toBe(-500)
    expect(getBalanceDelta(500, "transfer")).toBe(500)
  })

  it("rejects an amount that is not a whole number of minor units", () => {
    expect(() => getBalanceDelta(12.5, "income")).toThrow()
  })
})
