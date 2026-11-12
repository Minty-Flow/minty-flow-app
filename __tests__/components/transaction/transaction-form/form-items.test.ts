import { describe, expect, it } from "vitest"

import {
  canHaveItems,
  itemsTotal,
} from "~/components/transaction/transaction-form/form-utils"

describe("itemsTotal", () => {
  it("sums unit price × quantity", () => {
    expect(
      itemsTotal([
        { name: "Milk", unitPrice: 150, quantity: 2 },
        { name: "Bread", unitPrice: 200, quantity: 1 },
      ]),
    ).toBe(500)
    expect(itemsTotal([])).toBe(0)
  })
})

describe("canHaveItems", () => {
  it("allows one-off expenses and income only", () => {
    expect(canHaveItems("expense", "default")).toBe(true)
    expect(canHaveItems("income", "upcoming")).toBe(true)
    expect(canHaveItems("transfer", "default")).toBe(false)
    expect(canHaveItems("expense", "subscription")).toBe(false)
    expect(canHaveItems("expense", "repetitive")).toBe(false)
    expect(canHaveItems("expense", "lent")).toBe(false)
    expect(canHaveItems("income", "borrowed")).toBe(false)
  })
})
