import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { getBalanceAtTransaction } from "~/database/services/balance-service"

const now = "2026-01-01T00:00:00.000Z"

describe("getBalanceAtTransaction", () => {
  it("sums earlier confirmed rows and the target", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc-1",
        name: "Checking",
        type: "checking",
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()

    drizzleDb
      .insert(transactions)
      .values([
        {
          id: "t-income",
          accountId: "acc-1",
          amount: 10_000,
          type: "income",
          transactionDate: "2026-01-02T00:00:00.000Z",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "t-expense",
          accountId: "acc-1",
          amount: 2_500,
          type: "expense",
          transactionDate: "2026-01-03T00:00:00.000Z",
          createdAt: now,
          updatedAt: now,
        },
      ])
      .run()

    const balance = await getBalanceAtTransaction({
      id: "t-expense",
      accountId: "acc-1",
      transactionDate: new Date("2026-01-03T00:00:00.000Z"),
      amount: 2_500,
      type: "expense",
    })

    expect(balance).toBe(7_500)
  })
})
