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
import {
  accounts,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import {
  AccountHasLoansError,
  destroyAccount,
} from "~/database/services/account-service"
import { createLoanWithOpeningEntry } from "~/database/services/loan-service"

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

addAccount("acc-with-loans")
addAccount("acc-plain")
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

const accountExists = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get() != null

describe("destroyAccount", () => {
  it("refuses an account that has loans and changes nothing", async () => {
    for (const name of ["Sam", "Lee"]) {
      await createLoanWithOpeningEntry(
        {
          name,
          principalAmount: 1_000,
          loanType: "lent",
          accountId: "acc-with-loans",
          categoryId: "cat-1",
        },
        { title: `Lent to ${name}`, transactionDate: new Date(2026, 0, 5) },
      )
    }

    const error = await destroyAccount("acc-with-loans").catch((e) => e)

    expect(error).toBeInstanceOf(AccountHasLoansError)
    expect((error as AccountHasLoansError).loanNames.sort()).toEqual([
      "Lee",
      "Sam",
    ])
    expect(accountExists("acc-with-loans")).toBe(true)
    expect(drizzleDb.select().from(loans).all()).toHaveLength(2)
    expect(drizzleDb.select().from(transactions).all()).toHaveLength(2)
  })

  it("still destroys an account without loans", async () => {
    await destroyAccount("acc-plain")

    expect(accountExists("acc-plain")).toBe(false)
  })
})
