import { describe, expect, it } from "vitest"

import {
  fillMissingRates,
  parseFawaz,
  parseOpenErApi,
} from "~/services/exchange-rate-sources"

describe("parseOpenErApi", () => {
  it("reads a successful response with lowercase keys", () => {
    const parsed = parseOpenErApi({
      result: "success",
      time_last_update_unix: Date.UTC(2026, 9, 12, 23, 57) / 1000,
      rates: { USD: 1, SYP: 121.7, EUR: 0.89 },
    })

    expect(parsed).toEqual({
      date: "2026-10-12",
      rates: { usd: 1, syp: 121.7, eur: 0.89 },
    })
  })

  it("rejects the HTTP 200 error the API sends for an unsupported code", () => {
    expect(
      parseOpenErApi({ result: "error", "error-type": "unsupported-code" }),
    ).toBeNull()
  })

  it("drops rates that are not positive finite numbers", () => {
    const parsed = parseOpenErApi({
      result: "success",
      rates: { USD: 1, BAD: 0, WORSE: Number.NaN, TEXT: "1.2" },
    })

    expect(parsed?.rates).toEqual({ usd: 1 })
  })
})

describe("parseFawaz", () => {
  const response = {
    date: "2026-10-12",
    usd: { eur: 0.89, syp: 13_010, btc: 0.000009 },
  }

  it("never uses the Syrian pound rate, which is still in old units", () => {
    expect(parseFawaz(response, "usd")?.rates).toEqual({
      eur: 0.89,
      btc: 0.000009,
    })
  })

  it("refuses a Syrian pound base, whose every rate is on the old scale", () => {
    expect(
      parseFawaz({ date: "2026-10-12", syp: { usd: 0.0000769 } }, "syp"),
    ).toBeNull()
  })

  it("rejects a response without the base currency", () => {
    expect(parseFawaz({ date: "2026-10-12" }, "usd")).toBeNull()
  })
})

describe("fillMissingRates", () => {
  it("adds missing codes and never replaces one the primary has", () => {
    const primary = { date: "2026-10-12", rates: { eur: 0.89, syp: 121.7 } }
    const extra = { date: "2026-10-12", rates: { eur: 0.5, btc: 0.000009 } }

    expect(fillMissingRates(primary, extra).rates).toEqual({
      eur: 0.89,
      syp: 121.7,
      btc: 0.000009,
    })
  })

  it("returns the primary untouched when there is nothing to add", () => {
    const primary = { date: "2026-10-12", rates: { eur: 0.89 } }

    expect(fillMissingRates(primary, null)).toBe(primary)
  })
})
