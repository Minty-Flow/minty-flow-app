import { describe, expect, it } from "vitest"

import {
  addOrIncrementItem,
  canHaveItems,
  itemsTotal,
  parsePriceInput,
  sanitizePriceInput,
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

describe("addOrIncrementItem", () => {
  it("adds a new name with quantity 1 and counts up a known one", () => {
    const once = addOrIncrementItem([], { name: "Milk", unitPrice: 150 })
    expect(once).toEqual([{ name: "Milk", unitPrice: 150, quantity: 1 }])
    expect(
      addOrIncrementItem(once, { name: " milk ", unitPrice: 999 }),
    ).toEqual([{ name: "Milk", unitPrice: 150, quantity: 2 }])
  })
})

describe("price input", () => {
  it("reads a decimal comma as a point", () => {
    expect(parsePriceInput(sanitizePriceInput("1,5", "USD"), "USD")).toBe(150)
  })

  it("caps decimals at the currency's digits", () => {
    expect(sanitizePriceInput("1.999", "USD")).toBe("1.99")
    expect(sanitizePriceInput("1.5", "JPY")).toBe("1")
    expect(sanitizePriceInput("1.2.3", "USD")).toBe("1.23")
    expect(sanitizePriceInput("$12a", "USD")).toBe("12")
  })

  it("treats an empty field as no price and 0 as a price", () => {
    expect(parsePriceInput("", "USD")).toBeNull()
    expect(parsePriceInput(".", "USD")).toBeNull()
    expect(parsePriceInput("0", "USD")).toBe(0)
  })
})
