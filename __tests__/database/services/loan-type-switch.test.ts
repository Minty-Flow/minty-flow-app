import { eq, sql } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import {
  createLoanWithOpeningEntry,
  updateLoanById,
} from "~/database/services/loan-service"

const now = "2026-01-01T00:00:00.000Z"

drizzleDb
  .insert(accounts)
  .values({
    id: "acc-1",
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
    id: "cat-1",
    name: "Loans",
    type: "expense",
    createdAt: now,
    updatedAt: now,
  })
  .run()

async function createLent() {
  return createLoanWithOpeningEntry(
    {
      name: "Sam",
      principalAmount: 2_000,
      loanType: "lent",
      accountId: "acc-1",
      categoryId: "cat-1",
    },
    { title: "Lent to Sam", transactionDate: new Date(2026, 0, 5) },
  )
}

const rowOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

const balance = () =>
  drizzleDb
    .select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, "acc-1"))
    .get()?.balance

describe("updateLoanById type switch", () => {
  it("moves the opening entry's type and kind together", async () => {
    const { loanId, transactionId } = await createLent()
    const before = balance() ?? 0

    await updateLoanById(loanId, { loanType: "borrowed" })

    expect(rowOf(transactionId)).toMatchObject({
      type: "income",
      kind: "borrowed",
    })
    // Lent (-2000) becomes borrowed (+2000): the account moves by 4000.
    expect(balance()).toBe(before + 4_000)
  })

  it("refuses a type change once a repayment exists", async () => {
    const { loanId, transactionId } = await createLent()
    drizzleDb
      .insert(transactions)
      .values({
        id: "repayment-1",
        accountId: "acc-1",
        amount: 500,
        type: "income",
        kind: "lent",
        loanId,
        transactionDate: new Date(2026, 0, 6).toISOString(),
        createdAt: now,
        updatedAt: now,
      })
      .run()

    await expect(
      updateLoanById(loanId, { loanType: "borrowed" }),
    ).rejects.toThrow("repayments")

    expect(rowOf(transactionId)).toMatchObject({
      type: "expense",
      kind: "lent",
    })
    expect(
      drizzleDb
        .select({ loanType: loans.loanType })
        .from(loans)
        .where(eq(loans.id, loanId))
        .get()?.loanType,
    ).toBe("lent")
  })

  it("still edits a loan with repayments when the type is unchanged", async () => {
    const { loanId } = await createLent()
    drizzleDb
      .insert(transactions)
      .values({
        id: "repayment-2",
        accountId: "acc-1",
        amount: 500,
        type: "income",
        kind: "lent",
        loanId,
        transactionDate: new Date(2026, 0, 6).toISOString(),
        createdAt: now,
        updatedAt: now,
      })
      .run()

    await updateLoanById(loanId, { loanType: "lent", name: "Sam (car)" })

    expect(
      drizzleDb
        .select({ name: loans.name })
        .from(loans)
        .where(eq(loans.id, loanId))
        .get()?.name,
    ).toBe("Sam (car)")
  })
})

describe("align loan row kind migration", () => {
  it("fixes rows whose kind disagrees with their loan", async () => {
    const { loanId, transactionId } = await createLent()
    // The state the old switch left: a borrowed loan with a 'lent' opening entry.
    drizzleDb
      .update(loans)
      .set({ loanType: "borrowed" })
      .where(eq(loans.id, loanId))
      .run()
    drizzleDb
      .update(transactions)
      .set({ type: "income" })
      .where(eq(transactions.id, transactionId))
      .run()
    const healthy = await createLent()

    const migration = readFileSync(
      fileURLToPath(
        new URL(
          "../../../drizzle/0005_align_loan_row_kind.sql",
          import.meta.url,
        ),
      ),
      "utf8",
    )
    drizzleDb.run(sql.raw(migration))

    expect(rowOf(transactionId)).toMatchObject({
      type: "income",
      kind: "borrowed",
    })
    expect(rowOf(healthy.transactionId)).toMatchObject({
      type: "expense",
      kind: "lent",
    })
  })
})
