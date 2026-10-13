import { describe, expect, it, vi } from "vitest"

// The date helpers read i18n, MMKV-backed stores and device locale at load
// time; none of that matters for balance math.
vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import {
  computeBalanceTimeline,
  fetchHistoricalOpenings,
} from "~/database/drizzle/read-models/stats-data"
import { accounts, transactions } from "~/database/drizzle/schema"
import type { RowAccount } from "~/database/types/rows"
import type { BalanceRawRow } from "~/types/stats"
import type { TransactionType } from "~/types/transactions"

const FROM = new Date(2026, 0, 10)
const TO = new Date(2026, 0, 12, 23, 59)

const account = (balance: number): RowAccount => ({
  id: "acc-1",
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
): BalanceRawRow => ({
  date: new Date(2026, 0, 11, 12),
  accountId: "acc-1",
  accountBalanceBefore: 10_000,
  amount,
  type,
  subtype,
  currencyCode: "USD",
})

/** Balance shown on 11 Jan, the day of the single row. */
function balanceAfter(r: BalanceRawRow) {
  const { timeline } = computeBalanceTimeline([r], [account(0)], FROM, TO)
  return timeline[1]?.balance
}

describe("computeBalanceTimeline", () => {
  it("lowers the balance for an expense", () => {
    expect(balanceAfter(row("expense", 2_500))).toBe(7_500)
  })

  it("raises the balance for income", () => {
    expect(balanceAfter(row("income", 2_500))).toBe(12_500)
  })

  it("raises the balance for a refund", () => {
    expect(balanceAfter(row("expense", 2_500, "refund"))).toBe(12_500)
  })

  it("applies the stored sign of a transfer leg", () => {
    expect(balanceAfter(row("transfer", -2_500))).toBe(7_500)
  })

  it("reports opening and closing for an expense", () => {
    const { opening, closing } = computeBalanceTimeline(
      [row("expense", 2_500)],
      [account(0)],
      FROM,
      TO,
    )
    expect(opening).toBe(10_000)
    expect(closing).toBe(7_500)
  })
})

describe("fetchHistoricalOpenings", () => {
  it("lowers the opening balance for an earlier expense", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc-1",
        name: "Checking",
        type: "checking",
        balance: 7_500,
        currencyCode: "USD",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      })
      .run()
    drizzleDb
      .insert(transactions)
      .values({
        id: "t-1",
        accountId: "acc-1",
        amount: 2_500,
        type: "expense",
        accountBalanceBefore: 10_000,
        transactionDate: new Date(2026, 0, 5).toISOString(),
        createdAt: "2026-01-05T00:00:00.000Z",
        updatedAt: "2026-01-05T00:00:00.000Z",
      })
      .run()

    const openings = await fetchHistoricalOpenings([account(7_500)], FROM)

    expect(openings.get("acc-1")).toBe(7_500)
  })
})
