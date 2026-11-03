import { describe, expect, it, vi } from "vitest"

vi.mock("drizzle-orm/expo-sqlite", () => ({ useLiveQuery: vi.fn() }))
vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { getTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { accounts, transactions } from "~/database/drizzle/schema"

const stamp = "2026-01-01T00:00:00.000Z"

describe("deleted-only transaction list", () => {
  it("is bounded by the deletion date, not the transaction date", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc-trash",
        name: "Checking",
        type: "checking",
        balance: 0,
        currencyCode: "USD",
        createdAt: stamp,
        updatedAt: stamp,
      })
      .run()
    const row = (id: string, transactionDate: string, deletedAt: string) => ({
      id,
      accountId: "acc-trash",
      amount: -100,
      type: "expense" as const,
      transactionDate,
      isDeleted: 1 as const,
      deletedAt,
      createdAt: stamp,
      updatedAt: stamp,
    })
    drizzleDb
      .insert(transactions)
      .values([
        // dated three months back, deleted this month
        row(
          "old-dated",
          "2026-07-05T10:00:00.000Z",
          "2026-10-20T10:00:00.000Z",
        ),
        // dated this month, deleted this month
        row(
          "new-dated",
          "2026-10-02T10:00:00.000Z",
          "2026-10-21T10:00:00.000Z",
        ),
        // deleted in an earlier month
        row("earlier", "2026-10-03T10:00:00.000Z", "2026-09-10T10:00:00.000Z"),
      ])
      .run()

    const items = await getTransactions({
      from: "2026-10-01T00:00:00.000Z",
      to: "2026-10-31T23:59:59.999Z",
      deletedOnly: true,
    })

    expect(items.map((t) => t.id).sort()).toEqual(["new-dated", "old-dated"])
  })
})
