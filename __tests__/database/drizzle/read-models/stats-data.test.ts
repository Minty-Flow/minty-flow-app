import { describe, expect, it, vi } from "vitest"

// The date helpers read i18n, MMKV-backed stores and device locale at load
// time; none of that matters for balance math.
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

import { eq } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  computeBalanceTimeline,
  fetchAllStatsData,
} from "~/database/drizzle/read-models/stats-data"
import { accounts } from "~/database/drizzle/schema"
import {
  createTransaction,
  deleteTransaction,
  restoreTransaction,
  updateTransaction,
} from "~/database/services/ledger-service"
import type { RowAccount } from "~/database/types/rows"
import type { BalanceRawRow, StatsDateRange } from "~/types/stats"
import type { TransactionType } from "~/types/transactions"

const FROM = new Date(2026, 0, 10)
const TO = new Date(2026, 0, 12, 23, 59)

/** The account as it is now: `balance` already holds every confirmed row. */
const account = (balance: number, id = "acc-1"): RowAccount => ({
  id,
  name: "Checking",
  type: "checking",
  balance,
  currency_code: "USD",
  icon: null,
  color_scheme_name: null,
  is_primary: 0,
  exclude_from_balance: 0,
  is_archived: 0,
  sort_order: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
})

const row = (
  type: TransactionType,
  amount: number,
  subtype: string | null = null,
  date = new Date(2026, 0, 11, 12),
  accountId = "acc-1",
): BalanceRawRow => ({
  date,
  accountId,
  amount,
  type,
  subtype,
  currencyCode: "USD",
})

describe("computeBalanceTimeline", () => {
  // One row on 11 Jan. The live balance is what it left behind.
  const dayOfRow = (r: BalanceRawRow, live: number) =>
    computeBalanceTimeline([r], [account(live)], FROM, TO).timeline[1]?.balance

  it("lowers the balance for an expense", () => {
    expect(dayOfRow(row("expense", 2_500), 7_500)).toBe(7_500)
  })

  it("starts from the balance before the expense", () => {
    const { timeline } = computeBalanceTimeline(
      [row("expense", 2_500)],
      [account(7_500)],
      FROM,
      TO,
    )
    expect(timeline[0]?.balance).toBe(10_000)
  })

  it("raises the balance for income", () => {
    const { opening, closing } = computeBalanceTimeline(
      [row("income", 2_500)],
      [account(12_500)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
    expect(closing).toBe(12_500)
  })

  it("raises the balance for a refund", () => {
    const { opening } = computeBalanceTimeline(
      [row("expense", 2_500, "refund")],
      [account(12_500)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
  })

  it("applies the stored sign of a transfer leg", () => {
    const { opening } = computeBalanceTimeline(
      [row("transfer", -2_500)],
      [account(7_500)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
  })

  it("reports opening and closing for an expense", () => {
    const { opening, closing } = computeBalanceTimeline(
      [row("expense", 2_500)],
      [account(7_500)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
    expect(closing).toBe(7_500)
  })

  it("only moves the closing balance for a row dated after the range", () => {
    // 5 000 income on 20 Jan, after the range: the live balance holds it.
    const { opening, closing, timeline } = computeBalanceTimeline(
      [row("income", 5_000, null, new Date(2026, 0, 20, 12))],
      [account(15_000)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
    expect(closing).toBe(10_000)
    expect(timeline.map((p) => p.balance)).toEqual([10_000, 10_000, 10_000])
  })

  it("keeps an account with no rows flat at its live balance", () => {
    const { opening, closing, timeline } = computeBalanceTimeline(
      [],
      [account(4_200)],
      FROM,
      TO,
    )
    expect(opening).toBe(4_200)
    expect(closing).toBe(4_200)
    expect(timeline.every((p) => p.balance === 4_200)).toBe(true)
  })

  it("sums several accounts", () => {
    const { opening, closing } = computeBalanceTimeline(
      [
        row("expense", 1_000, null, new Date(2026, 0, 11), "a"),
        row("income", 500, null, new Date(2026, 0, 12), "b"),
      ],
      [account(9_000, "a"), account(2_500, "b")],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000 + 2_000)
    expect(closing).toBe(9_000 + 2_500)
  })

  it("returns an empty timeline when there are no accounts", () => {
    expect(computeBalanceTimeline([], [], FROM, TO)).toEqual({
      timeline: [],
      opening: 0,
      closing: 0,
    })
  })
})

// ── Against the real ledger ────────────────────────────────────────────────

const rangeOf = (from: Date, to: Date): StatsDateRange => ({
  preset: "custom",
  from,
  to,
  previousFrom: new Date(2025, 11, 1),
  previousTo: new Date(2025, 11, 31),
  interval: "day",
})

const YEAR = rangeOf(new Date(2026, 0, 1), new Date(2026, 11, 31, 23, 59, 59))

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(
  id: string,
  currencyCode: string,
  balance: number,
  excludeFromBalance = 0,
) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance,
      currencyCode,
      excludeFromBalance: excludeFromBalance as 0 | 1,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const liveBalance = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()
    ?.balance as number

const entry = (
  accountId: string,
  type: "income" | "expense",
  amount: number,
  date: Date,
  extra: Record<string, unknown> = {},
) =>
  ({
    amount,
    type,
    transactionDate: date,
    accountId,
    title: "x",
    tags: [],
    isPending: false,
    kind: "default",
    ...extra,
  }) as Parameters<typeof createTransaction>[0]

async function statsFor(currency: string, range = YEAR) {
  const all = await fetchAllStatsData(range)
  const stats = all.find((s) => s.currency === currency)
  if (!stats) throw new Error(`no stats for ${currency}`)
  return stats
}

describe("stats balance against the real ledger", () => {
  it("closes on the live balance after a backdated transaction", async () => {
    seedAccount("backdate", "EUR", 100_000)
    await createTransaction(
      entry("backdate", "income", 10_000, new Date(2026, 0, 10, 12)),
    )
    // Entered later, dated earlier: its stored snapshot is the balance now.
    await createTransaction(
      entry("backdate", "expense", 5_000, new Date(2026, 0, 5, 12)),
    )
    const stats = await statsFor("EUR")
    expect(liveBalance("backdate")).toBe(105_000)
    expect(stats.closingBalance).toBe(105_000)
    expect(stats.openingBalance).toBe(100_000)
    const day = (d: number) =>
      stats.balanceTimeline.find(
        (p) => p.date.getMonth() === 0 && p.date.getDate() === d,
      )?.balance
    expect(day(4)).toBe(100_000)
    expect(day(5)).toBe(95_000)
    expect(day(10)).toBe(105_000)
  })

  it("closes on the live balance after editing an older transaction", async () => {
    seedAccount("edit", "GBP", 100_000)
    const old = await createTransaction(
      entry("edit", "expense", 2_000, new Date(2026, 1, 3, 12)),
    )
    await createTransaction(
      entry("edit", "income", 7_000, new Date(2026, 2, 3, 12)),
    )
    await updateTransaction(old, { amount: 9_000 })
    const stats = await statsFor("GBP")
    expect(stats.closingBalance).toBe(liveBalance("edit"))
    expect(stats.openingBalance).toBe(100_000)
  })

  it("closes on the live balance after a delete and a restore", async () => {
    seedAccount("trash", "CAD", 100_000)
    const id = await createTransaction(
      entry("trash", "expense", 4_000, new Date(2026, 3, 3, 12)),
    )
    await createTransaction(
      entry("trash", "income", 1_000, new Date(2026, 4, 3, 12)),
    )
    await deleteTransaction(id)
    expect((await statsFor("CAD")).closingBalance).toBe(liveBalance("trash"))
    await restoreTransaction(id)
    const stats = await statsFor("CAD")
    expect(stats.closingBalance).toBe(liveBalance("trash"))
    expect(stats.openingBalance).toBe(100_000)
  })

  it("ignores a pending transaction", async () => {
    seedAccount("pending", "AUD", 50_000)
    await createTransaction(
      entry("pending", "expense", 1_000, new Date(2026, 5, 3, 12)),
    )
    await createTransaction(
      entry("pending", "expense", 9_000, new Date(2026, 6, 3, 12), {
        isPending: true,
        kind: "upcoming",
      }),
    )
    const stats = await statsFor("AUD")
    expect(stats.closingBalance).toBe(49_000)
    expect(stats.openingBalance).toBe(50_000)
  })

  it("takes back rows dated after a past range", async () => {
    seedAccount("past", "CHF", 100_000)
    await createTransaction(
      entry("past", "expense", 3_000, new Date(2026, 0, 10, 12)),
    )
    await createTransaction(
      entry("past", "income", 8_000, new Date(2026, 1, 10, 12)),
    )
    const january = rangeOf(
      new Date(2026, 0, 1),
      new Date(2026, 0, 31, 23, 59, 59),
    )
    const stats = await statsFor("CHF", january)
    // Live is 105 000; 8 000 came in February, after the range.
    expect(stats.closingBalance).toBe(97_000)
    expect(stats.openingBalance).toBe(100_000)
    expect(stats.balanceDelta).toBe(-3_000)
  })

  it("sums accounts of a currency and leaves out an excluded one", async () => {
    seedAccount("sum-a", "SEK", 10_000)
    seedAccount("sum-b", "SEK", 20_000)
    seedAccount("sum-x", "SEK", 999_000, 1)
    await createTransaction(
      entry("sum-a", "expense", 1_000, new Date(2026, 2, 3, 12)),
    )
    await createTransaction(
      entry("sum-b", "income", 500, new Date(2026, 2, 4, 12)),
    )
    await createTransaction(
      entry("sum-x", "expense", 700, new Date(2026, 2, 5, 12)),
    )
    const stats = await statsFor("SEK")
    expect(stats.closingBalance).toBe(9_000 + 20_500)
    expect(stats.openingBalance).toBe(10_000 + 20_000)
  })

  it("holds a quiet account flat at its live balance", async () => {
    seedAccount("quiet", "NOK", 6_000)
    seedAccount("busy", "NOK", 1_000)
    await createTransaction(
      entry("busy", "expense", 100, new Date(2026, 2, 3, 12)),
    )
    const stats = await statsFor("NOK")
    expect(stats.closingBalance).toBe(6_000 + 900)
    expect(stats.openingBalance).toBe(6_000 + 1_000)
  })

  it("matches the net worth figure for a range that includes today", async () => {
    seedAccount("nw-a", "DKK", 40_000)
    seedAccount("nw-b", "DKK", 5_000)
    await createTransaction(
      entry("nw-a", "expense", 6_000, new Date(2026, 1, 1, 12)),
    )
    await createTransaction(
      entry("nw-b", "income", 2_000, new Date(2026, 0, 15, 12)),
    )
    await createTransaction(
      entry("nw-a", "income", 1_500, new Date(2026, 0, 2, 12)),
    )
    const stats = await statsFor("DKK")
    expect(stats.closingBalance).toBe(liveBalance("nw-a") + liveBalance("nw-b"))
  })
})
