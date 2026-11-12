import { describe, expect, it } from "vitest"

import { getBalancesByCurrency } from "~/utils/account-balances"

describe("getBalancesByCurrency", () => {
  it("sums per currency and skips excluded accounts", () => {
    expect(
      getBalancesByCurrency([
        { currencyCode: "USD", balance: 1000, excludeFromBalance: false },
        { currencyCode: "EUR", balance: 250, excludeFromBalance: false },
        { currencyCode: "USD", balance: -300, excludeFromBalance: false },
        { currencyCode: "USD", balance: 9999, excludeFromBalance: true },
        { currencyCode: "GBP", balance: 50, excludeFromBalance: true },
      ]),
    ).toEqual([
      { currency: "USD", balance: 700 },
      { currency: "EUR", balance: 250 },
    ])
  })

  it("returns nothing for no accounts", () => {
    expect(getBalancesByCurrency([])).toEqual([])
  })
})
