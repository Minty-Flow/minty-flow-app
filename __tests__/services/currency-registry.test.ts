import { describe, expect, it } from "vitest"

import { currencyRegistryService } from "~/services/currency-registry"

describe("currency registry", () => {
  it("builds the grouped table once", () => {
    expect(currencyRegistryService.groupedCurrencies).toBe(
      currencyRegistryService.groupedCurrencies,
    )
  })

  it("sees a custom currency registered after the table was built", () => {
    const before = currencyRegistryService.groupedCurrencies
    expect(currencyRegistryService.isCurrencyCodeValid("ZZQTEST")).toBe(false)
    currencyRegistryService.registerCustomCurrency({
      code: "ZZQTEST",
      name: "Test coin",
      symbol: "Z",
      country: "",
    } as Parameters<typeof currencyRegistryService.registerCustomCurrency>[0])
    expect(currencyRegistryService.isCurrencyCodeValid("ZZQTEST")).toBe(true)
    expect(currencyRegistryService.groupedCurrencies).not.toBe(before)
    expect(currencyRegistryService.getCurrencyByCode("zzqtest")?.name).toBe(
      "Test coin",
    )
  })
})
