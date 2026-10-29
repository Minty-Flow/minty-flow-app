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
  budgetAccounts,
  budgets,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import {
  AccountHasLoansError,
  destroyAccount,
} from "~/database/services/account-service"
import { createTransaction } from "~/database/services/ledger-service"
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
addAccount("acc-loan-owner")
addAccount("acc-repay")
addAccount("acc-budget-only")
addAccount("acc-budget-kept")
addAccount("acc-budget-shared")
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

  it("refuses an account holding a repayment for another account's loan", async () => {
    const { loanId } = await createLoanWithOpeningEntry(
      {
        name: "Repaid elsewhere",
        principalAmount: 1_000,
        loanType: "lent",
        accountId: "acc-loan-owner",
        categoryId: "cat-1",
      },
      { title: "Lent", transactionDate: new Date(2026, 0, 5) },
    )
    await createTransaction({
      amount: 100,
      type: "expense",
      transactionDate: new Date(2026, 0, 6),
      accountId: "acc-repay",
      title: "Repayment",
      tags: [],
      isPending: false,
      kind: "default",
      loanId,
    } as Parameters<typeof createTransaction>[0])

    const error = await destroyAccount("acc-repay").catch((e) => e)

    expect(error).toBeInstanceOf(AccountHasLoansError)
    expect(accountExists("acc-repay")).toBe(true)
  })

  it("switches off a budget left with no account", async () => {
    drizzleDb
      .insert(budgets)
      .values({
        id: "bud-alone",
        name: "Alone",
        amount: 10_000,
        currencyCode: "USD",
        period: "monthly",
        startDate: now,
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(budgetAccounts)
      .values({
        budgetId: "bud-alone",
        accountId: "acc-budget-only",
        createdAt: now,
      })
      .run()

    await destroyAccount("acc-budget-only")

    const budget = drizzleDb
      .select()
      .from(budgets)
      .where(eq(budgets.id, "bud-alone"))
      .get()
    expect(budget?.isActive).toBe(0)
  })

  it("keeps a budget that still has another account", async () => {
    drizzleDb
      .insert(budgets)
      .values({
        id: "bud-shared",
        name: "Shared",
        amount: 10_000,
        currencyCode: "USD",
        period: "monthly",
        startDate: now,
        isActive: 1,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(budgetAccounts)
      .values([
        {
          budgetId: "bud-shared",
          accountId: "acc-budget-kept",
          createdAt: now,
        },
        {
          budgetId: "bud-shared",
          accountId: "acc-budget-shared",
          createdAt: now,
        },
      ])
      .run()

    await destroyAccount("acc-budget-shared")

    const budget = drizzleDb
      .select()
      .from(budgets)
      .where(eq(budgets.id, "bud-shared"))
      .get()
    expect(budget?.isActive).toBe(1)
  })

  it("still destroys an account without loans", async () => {
    await destroyAccount("acc-plain")

    expect(accountExists("acc-plain")).toBe(false)
  })
})
