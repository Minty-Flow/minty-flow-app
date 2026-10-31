import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { createTransfer } from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

describe("createTransfer, pending", () => {
  for (const [id, balance] of [
    ["acc-from", 10_000],
    ["acc-to", 2_000],
  ] as const) {
    drizzleDb
      .insert(accounts)
      .values({
        id,
        name: id,
        type: "checking",
        balance,
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()
  }

  it("writes a pending pair without moving either balance", async () => {
    await createTransfer(
      {
        fromAccountId: "acc-from",
        toAccountId: "acc-to",
        amount: 1_000,
        transactionDate: new Date(2026, 2, 1, 10),
      },
      { isPending: true },
    )

    const legs = drizzleDb.select().from(transactions).all()
    expect(legs).toHaveLength(2)
    for (const leg of legs) {
      expect(leg.isPending).toBe(1)
      expect(leg.kind).toBe("upcoming")
      expect(leg.accountBalanceBefore).toBe(0)
    }
    expect(
      drizzleDb
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, "acc-from"))
        .get()?.balance,
    ).toBe(10_000)
  })
})
