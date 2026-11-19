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

import { like } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  fetchRecurringSummary,
  groupSpendingPlaces,
  monthlyEquivalent,
  type PlaceRow,
} from "~/database/drizzle/read-models/stats-extras-data"
import { accounts, recurringTransactions } from "~/database/drizzle/schema"
import { createRecurringRule } from "~/database/services/recurring-transaction-service"
import type { RecurrenceUnit } from "~/types/transactions"
import { buildRRuleString } from "~/utils/recurrence"

describe("monthlyEquivalent", () => {
  it("scales each unit to one month", () => {
    expect(monthlyEquivalent(1_000, { interval: 1, unit: "month" })).toBe(1_000)
    expect(monthlyEquivalent(12_000, { interval: 1, unit: "year" })).toBe(1_000)
    expect(monthlyEquivalent(1_200, { interval: 3, unit: "month" })).toBe(400)
    expect(monthlyEquivalent(1_200, { interval: 1, unit: "week" })).toBe(5_200)
    expect(monthlyEquivalent(100, { interval: 1, unit: "day" })).toBe(3_044)
  })
})

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

describe("fetchRecurringSummary", () => {
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

  const start = Date.now() - 60_000
  const rule = (
    title: string,
    amount: number,
    opts: {
      type?: "expense" | "income"
      accountId?: string
      kind?: "subscription" | "repetitive"
      unit?: RecurrenceUnit
    } = {},
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
      kind: opts.kind ?? "subscription",
      range: { from: start, to: new Date(2099, 11, 31).getTime() },
      rules: [
        buildRRuleString({
          interval: 1,
          unit: opts.unit ?? "month",
          startDate: new Date(start),
        }),
      ],
    })

  it("lists active expense rules of one currency, split by kind", async () => {
    await rule("Netflix", 1_500)
    await rule("Gym", 12_000, { unit: "year" })
    await rule("Groceries", 1_000, { kind: "repetitive", unit: "week" })
    await rule("Salary", 500_000, { type: "income" })
    await rule("Paris flat", 90_000, { accountId: "acc-eur" })
    await rule("Old", 9_999)
    drizzleDb
      .update(recurringTransactions)
      .set({ disabled: 1 })
      .where(like(recurringTransactions.jsonTransactionTemplate, '%"Old"%'))
      .run()

    const summary = fetchRecurringSummary("USD")

    expect(
      summary.subscriptions.map((s) => [s.title, s.monthlyAmount]),
    ).toEqual([
      ["Netflix", 1_500],
      ["Gym", 1_000],
    ])
    expect(summary.repetitive.map((s) => s.title)).toEqual(["Groceries"])
    expect(summary.monthlyTotal).toBe(1_500 + 1_000 + 4_333)
    expect(summary.subscriptions[0].latestTransactionId).not.toBeNull()
    expect(summary.subscriptions[0].nextDate.getTime()).toBeGreaterThan(
      Date.now(),
    )
  })
})
