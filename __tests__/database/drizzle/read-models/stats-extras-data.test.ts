import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))
vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import {
  fetchRecurringSpend,
  fetchSpendingPlaces,
  groupSpendingPlaces,
  type PlaceRow,
} from "~/database/drizzle/read-models/stats-extras-data"
import { accounts } from "~/database/drizzle/schema"
import { createTransaction } from "~/database/services/ledger-service"
import { createRecurringRule } from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

describe("groupSpendingPlaces", () => {
  const row = (
    amount: number,
    location: object | string | null,
    extra: Partial<PlaceRow> = {},
  ): PlaceRow => ({
    amount,
    type: "expense",
    subtype: null,
    loanId: null,
    kind: null,
    location:
      location === null || typeof location === "string"
        ? location
        : JSON.stringify(location),
    ...extra,
  })
  const cafe = { latitude: 1, longitude: 2, address: "Cafe" }

  it("merges the same address and nearby unaddressed points", () => {
    const places = groupSpendingPlaces([
      row(500, cafe),
      row(300, { ...cafe, latitude: 1.0004, address: " cafe " }),
      row(200, { latitude: 10.0001, longitude: 20, address: null }),
      row(100, { latitude: 10.0002, longitude: 20, address: null }),
    ])
    expect(places.map((p) => [p.address, p.total, p.count])).toEqual([
      ["Cafe", 800, 2],
      [null, 300, 2],
    ])
  })

  it("keeps one address typed at two far-apart spots as two places", () => {
    const places = groupSpendingPlaces([
      row(500, { latitude: 1, longitude: 2, address: "Home" }),
      row(300, { latitude: 40, longitude: 2, address: "Home" }),
    ])
    expect(places.map((p) => [p.address, p.total])).toEqual([
      ["Home", 500],
      ["Home", 300],
    ])
  })

  it("skips income, loans, bad locations and refunded-away places", () => {
    const places = groupSpendingPlaces([
      row(500, cafe, { type: "income" }),
      row(500, cafe, { loanId: "loan-1" }),
      row(500, "not json"),
      row(500, null),
      row(400, { latitude: 5, longitude: 5, address: "Shop" }),
      row(
        400,
        { latitude: 5, longitude: 5, address: "Shop" },
        {
          subtype: "refund",
        },
      ),
    ])
    expect(places).toEqual([])
  })
})

describe("fetchRecurringSpend", () => {
  const now = "2026-01-01T00:00:00.000Z"
  for (const [id, currencyCode] of [
    ["acc-usd", "USD"],
    ["acc-eur", "EUR"],
  ]) {
    drizzleDb
      .insert(accounts)
      .values({
        id,
        name: id,
        type: "checking",
        currencyCode,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  }

  // Whole seconds: RRule drops milliseconds from DTSTART.
  const start = Math.floor((Date.now() - 60_000) / 1000) * 1000
  const rule = (
    title: string,
    amount: number,
    opts: { type?: "expense" | "income"; accountId?: string } = {},
  ) =>
    createRecurringRule({
      amount,
      type: opts.type ?? "expense",
      accountId: opts.accountId ?? "acc-usd",
      categoryId: null,
      title,
      description: null,
      subtype: null,
      tags: [],
      kind: "subscription",
      range: { from: start, to: new Date(2099, 11, 31).getTime() },
      rules: [
        buildRRuleString({
          interval: 1,
          unit: "month",
          startDate: new Date(start),
        }),
      ],
    })

  it("sums recurring expenses of one currency in the range", async () => {
    await rule("Netflix", 1_500)
    await rule("Salary", 500_000, { type: "income" })
    await rule("Paris flat", 90_000, { accountId: "acc-eur" })

    // Each rule spawns today's instance plus next month's upcoming one; the
    // range covers both, and only the confirmed one counts.
    const range = {
      from: new Date(start - 1_000),
      to: new Date(start + 40 * 24 * 60 * 60 * 1_000),
    }
    expect(fetchRecurringSpend(range, "USD")).toEqual({
      total: 1_500,
      count: 1,
    })
    expect(fetchRecurringSpend(range, "EUR")).toEqual({
      total: 90_000,
      count: 1,
    })
  })
})

describe("fetchSpendingPlaces", () => {
  const at = (address: string) =>
    JSON.stringify({ latitude: 1, longitude: 2, address })
  const expense = (
    accountId: string,
    amount: number,
    date: Date,
    location: string,
    extra: Record<string, unknown> = {},
  ) =>
    createTransaction({
      amount,
      type: "expense",
      transactionDate: date,
      accountId,
      title: "x",
      tags: [],
      isPending: false,
      kind: "default",
      location,
      ...extra,
    } as Parameters<typeof createTransaction>[0])

  it("keeps only confirmed expenses of one currency inside the range", async () => {
    const inRange = new Date(2025, 5, 15, 12)
    await expense("acc-usd", 700, inRange, at("Kept"))
    await expense("acc-usd", 900, inRange, at("Upcoming"), {
      isPending: true,
      kind: "upcoming",
    })
    await expense("acc-eur", 800, inRange, at("Euro"))
    await expense("acc-usd", 600, new Date(2025, 7, 1, 12), at("Later"))

    const places = fetchSpendingPlaces(
      { from: new Date(2025, 5, 1), to: new Date(2025, 5, 30, 23, 59) },
      "USD",
    )
    expect(places.map((p) => [p.address, p.total])).toEqual([["Kept", 700]])
  })
})
