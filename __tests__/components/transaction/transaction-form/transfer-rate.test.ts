import { describe, expect, it } from "vitest"

import { checkTransferRate } from "~/components/transaction/transaction-form/transfer-rate"

describe("checkTransferRate", () => {
  it("needs no rate when both accounts share a currency", () => {
    expect(
      checkTransferRate({
        differentCurrencies: false,
        conversionRate: null,
        isLoading: false,
      }),
    ).toEqual({ ok: true, conversionRate: null })
  })

  it("accepts a rate of 1 for a pegged pair such as BMD/USD", () => {
    expect(
      checkTransferRate({
        differentCurrencies: true,
        conversionRate: 1,
        isLoading: false,
      }),
    ).toEqual({ ok: true, conversionRate: 1 })
  })

  it("accepts an ordinary rate", () => {
    expect(
      checkTransferRate({
        differentCurrencies: true,
        conversionRate: 0.92,
        isLoading: false,
      }),
    ).toEqual({ ok: true, conversionRate: 0.92 })
  })

  it("waits while a lookup is in flight", () => {
    expect(
      checkTransferRate({
        differentCurrencies: true,
        conversionRate: null,
        isLoading: true,
      }),
    ).toEqual({ ok: false, reason: "loading" })
  })

  it("asks for a rate once the lookup has finished without one", () => {
    expect(
      checkTransferRate({
        differentCurrencies: true,
        conversionRate: null,
        isLoading: false,
      }),
    ).toEqual({ ok: false, reason: "missing" })
  })

  it("rejects a rate of zero or less", () => {
    for (const conversionRate of [0, -1]) {
      expect(
        checkTransferRate({
          differentCurrencies: true,
          conversionRate,
          isLoading: false,
        }),
      ).toEqual({ ok: false, reason: "missing" })
    }
  })
})
