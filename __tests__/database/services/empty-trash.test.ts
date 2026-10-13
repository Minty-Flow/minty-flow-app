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
import {
  autoPurgeTrash,
  createTransaction,
  createTransfer,
  deleteTransaction,
  destroyAllDeletedTransactions,
} from "~/database/services/ledger-service"
import { logger } from "~/utils/logger"

const now = "2026-01-01T00:00:00.000Z"

for (const id of ["acc-a", "acc-b"]) {
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

/** A confirmed expense and a transfer, both moved to the trash. */
async function trashAnExpenseAndATransfer() {
  const expenseId = await createTransaction({
    amount: 1_000,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId: "acc-a",
    title: "Coffee",
    tags: [],
    isPending: false,
    kind: "default",
  } as Parameters<typeof createTransaction>[0])
  await createTransfer({
    fromAccountId: "acc-a",
    toAccountId: "acc-b",
    amount: 2_000,
    transactionDate: new Date(2026, 0, 6),
  })
  const debit = drizzleDb
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.type, "transfer"))
    .all()
  await deleteTransaction(expenseId)
  for (const row of debit) await deleteTransaction(row.id)
}

const remaining = () => drizzleDb.select().from(transactions).all().length
const links = () => drizzleDb.select().from(transfers).all().length

describe("emptying the trash with a transfer in it", () => {
  it("destroys both legs and everything else in one batch", async () => {
    await trashAnExpenseAndATransfer()
    expect(remaining()).toBe(3)

    await destroyAllDeletedTransactions()

    expect(remaining()).toBe(0)
    expect(links()).toBe(0)
  })
})

describe("auto-purging the trash with a transfer in it", () => {
  it("purges in one batch without logging an error", async () => {
    await trashAnExpenseAndATransfer()
    drizzleDb
      .update(transactions)
      .set({ deletedAt: "2020-01-01T00:00:00.000Z" })
      .run()
    const errors = vi.spyOn(logger, "error").mockImplementation(() => {})

    await autoPurgeTrash("30 days")

    expect(remaining()).toBe(0)
    expect(errors).not.toHaveBeenCalled()
  })
})
