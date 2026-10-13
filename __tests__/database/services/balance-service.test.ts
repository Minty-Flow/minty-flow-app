import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { getBalanceAtTransaction } from "~/database/services/balance-service"

const now = "2026-01-01T00:00:00.000Z"

type Row = {
  id: string
  amount: number
  type: "income" | "expense"
  day: number
  subtype?: "refund"
  isPending?: boolean
}

/**
 * Seed an account whose stored balance is the live balance: the initial
 * balance plus every confirmed row, as the ledger keeps it.
 */
function seed(accountId: string, initialBalance: number, rows: Row[]) {
  const live = rows
    .filter((r) => !r.isPending)
    .reduce((sum, r) => {
      const credit = r.type === "income" || r.subtype === "refund"
      return sum + (credit ? r.amount : -r.amount)
    }, initialBalance)

  drizzleDb
    .insert(accounts)
    .values({
      id: accountId,
      name: accountId,
      type: "checking",
      balance: live,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
  drizzleDb
    .insert(transactions)
    .values(
      rows.map((r) => ({
        id: r.id,
        accountId,
        amount: r.amount,
        type: r.type,
        subtype: r.subtype ?? null,
        isPending: r.isPending ? (1 as const) : (0 as const),
        transactionDate: new Date(2026, 0, r.day).toISOString(),
        createdAt: now,
        updatedAt: now,
      })),
    )
    .run()
}

const at = (accountId: string, id: string, day: number) =>
  getBalanceAtTransaction({
    id,
    accountId,
    transactionDate: new Date(2026, 0, day),
  })

describe("getBalanceAtTransaction", () => {
  it("sums earlier confirmed rows and the target", async () => {
    seed("acc-basic", 0, [
      { id: "b-income", amount: 10_000, type: "income", day: 2 },
      { id: "b-expense", amount: 2_500, type: "expense", day: 3 },
    ])

    expect(await at("acc-basic", "b-expense", 3)).toBe(7_500)
  })

  it("includes the account's initial balance", async () => {
    seed("acc-initial", 5_000, [
      { id: "i-income", amount: 10_000, type: "income", day: 2 },
      { id: "i-expense", amount: 2_500, type: "expense", day: 3 },
    ])

    expect(await at("acc-initial", "i-income", 2)).toBe(15_000)
    expect(await at("acc-initial", "i-expense", 3)).toBe(12_500)
  })

  it("adds a refund target instead of subtracting it", async () => {
    seed("acc-refund", 0, [
      {
        id: "r-refund",
        amount: 2_500,
        type: "expense",
        subtype: "refund",
        day: 2,
      },
      { id: "r-income", amount: 1_000, type: "income", day: 3 },
    ])

    expect(await at("acc-refund", "r-refund", 2)).toBe(2_500)
  })

  it("does not apply a pending target to the balance", async () => {
    seed("acc-pending", 0, [
      { id: "p-income", amount: 10_000, type: "income", day: 2 },
      {
        id: "p-expense",
        amount: 2_500,
        type: "expense",
        day: 3,
        isPending: true,
      },
    ])

    expect(await at("acc-pending", "p-expense", 3)).toBe(10_000)
  })
})
