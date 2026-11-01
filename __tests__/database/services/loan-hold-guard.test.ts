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
import { accounts, categories, transactions } from "~/database/drizzle/schema"
import { confirmTransaction } from "~/database/services/ledger-service"
import { createLoanWithOpeningEntry } from "~/database/services/loan-service"

const now = "2026-01-01T00:00:00.000Z"

drizzleDb
  .insert(accounts)
  .values({
    id: "acc-hold",
    name: "Checking",
    type: "checking",
    balance: 10_000,
    currencyCode: "USD",
    createdAt: now,
    updatedAt: now,
  })
  .run()
drizzleDb
  .insert(categories)
  .values({
    id: "cat-hold",
    name: "Loans",
    type: "expense",
    createdAt: now,
    updatedAt: now,
  })
  .run()

const rowOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

describe("putting a loan opening entry on hold", () => {
  it("is refused and leaves the row confirmed", async () => {
    const { transactionId } = await createLoanWithOpeningEntry(
      {
        name: "Sam",
        principalAmount: 2_000,
        loanType: "lent",
        accountId: "acc-hold",
        categoryId: "cat-hold",
      },
      { title: "Lent to Sam", transactionDate: new Date(2026, 0, 5) },
    )
    const before = rowOf(transactionId)

    await expect(
      confirmTransaction(transactionId, {
        updateTransactionDate: false,
        confirm: false,
      }),
    ).rejects.toThrow(/loan-linked/)

    const after = rowOf(transactionId)
    expect(after?.isPending).toBe(before?.isPending)
    expect(after?.kind).toBe(before?.kind)
  })
})
