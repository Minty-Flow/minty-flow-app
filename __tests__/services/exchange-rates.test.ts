import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/utils/toast", () => ({
  Toast: { success: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))

import { exchangeRatesService } from "~/services/exchange-rates"

const erUsd = {
  result: "success",
  time_last_update_unix: 1_791_849_451,
  rates: { USD: 1, EUR: 0.89, SYP: 121.7 },
}
const erSyp = {
  result: "success",
  time_last_update_unix: 1_791_849_451,
  rates: { SYP: 1, USD: 0.008217, EUR: 0.0073 },
}
const fawazUsd = {
  date: "2026-10-13",
  usd: { eur: 0.9, syp: 13_001, btc: 0.000009 },
}

/** Route fetch by URL; a missing route is an HTTP 500. */
function stubFetch(routes: Record<string, unknown>) {
  const fetchMock = vi.fn(async (url: string) => {
    const hit = Object.entries(routes).find(([fragment]) =>
      url.includes(fragment),
    )
    return hit
      ? { ok: true, status: 200, json: async () => hit[1] }
      : { ok: false, status: 500, statusText: "down", json: async () => ({}) }
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

beforeEach(() => exchangeRatesService.clearCache())
afterEach(() => vi.unstubAllGlobals())

describe("exchange rates source", () => {
  it("quotes the Syrian pound on the new scale", async () => {
    stubFetch({
      "open.er-api.com/v6/latest/USD": erUsd,
      "currencies/usd.min.json": fawazUsd,
    })

    const rates = await exchangeRatesService.fetchRates("USD")

    expect(rates?.rates.syp).toBe(121.7)
  })

  it("fills crypto from fawazahmed0 without letting it override a rate", async () => {
    stubFetch({
      "open.er-api.com/v6/latest/USD": erUsd,
      "currencies/usd.min.json": fawazUsd,
    })

    const rates = await exchangeRatesService.fetchRates("USD")

    expect(rates?.rates.btc).toBe(0.000009)
    expect(rates?.rates.eur).toBe(0.89)
  })

  it("falls back to fawazahmed0 when open.er-api.com is down, minus the Syrian pound", async () => {
    stubFetch({ "currencies/usd.min.json": fawazUsd })

    const rates = await exchangeRatesService.fetchRates("USD")

    expect(rates?.rates.eur).toBe(0.9)
    expect(rates?.rates.syp).toBeUndefined()
  })

  it("converts USD to SYP and back on the new scale", async () => {
    stubFetch({
      "open.er-api.com/v6/latest/USD": erUsd,
      "open.er-api.com/v6/latest/SYP": erSyp,
      "currencies/usd.min.json": fawazUsd,
    })

    expect(await exchangeRatesService.getRate("USD", "SYP")).toBe(121.7)
    expect(await exchangeRatesService.getRate("SYP", "USD")).toBe(0.008217)
  })

  it("gives no Syrian pound rate rather than the old-scale one when the primary is down", async () => {
    stubFetch({
      "currencies/usd.min.json": fawazUsd,
      "currencies/syp.min.json": {
        date: "2026-10-13",
        syp: { usd: 0.0000769 },
      },
    })

    expect(await exchangeRatesService.getRate("USD", "SYP")).toBeNull()
  })
})
