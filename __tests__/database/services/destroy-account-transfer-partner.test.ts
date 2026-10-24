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
import { accounts, transactions, transfers } from "~/database/drizzle/schema"
import { destroyAccount } from "~/database/services/account-service"
import {
  createTransfer,
  restoreTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function addAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 10_000,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const balanceOf = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()?.balance

describe("destroying an account that was one side of a transfer", () => {
  it("puts the other account back and refuses to restore the orphaned leg", async () => {
    addAccount("dp-a")
    addAccount("dp-b")
    await createTransfer({
      fromAccountId: "dp-a",
      toAccountId: "dp-b",
      amount: 1_000,
    })
    const link = drizzleDb
      .select()
      .from(transfers)
      .where(eq(transfers.fromAccountId, "dp-a"))
      .get()
    const creditId = link?.toTransactionId as string
    expect(balanceOf("dp-b")).toBe(11_000)

    await destroyAccount("dp-a")

    expect(balanceOf("dp-b")).toBe(10_000)
    await expect(restoreTransaction(creditId)).rejects.toThrow(/other leg/)
    expect(balanceOf("dp-b")).toBe(10_000)
    expect(
      drizzleDb
        .select({ isDeleted: transactions.isDeleted })
        .from(transactions)
        .where(eq(transactions.id, creditId))
        .get()?.isDeleted,
    ).toBe(1)
  })
})
