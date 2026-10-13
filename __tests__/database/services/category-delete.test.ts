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
  budgetCategories,
  budgets,
  categories,
  loans,
  transactions,
} from "~/database/drizzle/schema"
import {
  CategoryHasLoansError,
  deleteCategoryById,
  getLoansUsingCategory,
} from "~/database/services/category-service"
import {
  createTransaction,
  deleteTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 100_000,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

function seedCategory(id: string) {
  drizzleDb
    .insert(categories)
    .values({ id, name: id, type: "expense", createdAt: now, updatedAt: now })
    .run()
}

function seedLoan(id: string, accountId: string, categoryId: string) {
  drizzleDb
    .insert(loans)
    .values({
      id,
      name: id,
      principalAmount: 50_000,
      loanType: "lent",
      accountId,
      categoryId,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const expense = (accountId: string, categoryId: string) =>
  ({
    amount: 1_000,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    categoryId,
    title: "x",
    tags: [],
    isPending: false,
    kind: "default",
  }) as Parameters<typeof createTransaction>[0]

const categoryExists = (id: string) =>
  drizzleDb.select().from(categories).where(eq(categories.id, id)).get() !==
  undefined

const categoryOf = (transactionId: string) =>
  drizzleDb
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .get()?.categoryId

describe("deleting a category that transactions use", () => {
  it("deletes it and leaves the transactions without a category", async () => {
    seedAccount("acc-use")
    seedCategory("cat-use")
    const live = await createTransaction(expense("acc-use", "cat-use"))
    const trashed = await createTransaction(expense("acc-use", "cat-use"))
    await deleteTransaction(trashed)

    await deleteCategoryById("cat-use")

    expect(categoryExists("cat-use")).toBe(false)
    expect(categoryOf(live)).toBeNull()
    expect(categoryOf(trashed)).toBeNull()
  })
})

describe("deleting a category that a budget tags its transactions with", () => {
  const budgetOf = (transactionId: string) =>
    drizzleDb
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId))
      .get()?.budgetId

  it("clears the budget of the transactions that lose their category only", async () => {
    seedAccount("acc-tag")
    seedCategory("cat-gone")
    seedCategory("cat-stays")
    drizzleDb
      .insert(budgets)
      .values({
        id: "budget-tag",
        name: "budget-tag",
        amount: 10_000,
        currencyCode: "USD",
        period: "monthly",
        startDate: now,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    const losing = await createTransaction({
      ...expense("acc-tag", "cat-gone"),
      budgetId: "budget-tag",
    })
    const keeping = await createTransaction({
      ...expense("acc-tag", "cat-stays"),
      budgetId: "budget-tag",
    })

    await deleteCategoryById("cat-gone")

    expect(categoryOf(losing)).toBeNull()
    expect(budgetOf(losing)).toBeNull()
    expect(categoryOf(keeping)).toBe("cat-stays")
    expect(budgetOf(keeping)).toBe("budget-tag")
  })
})

describe("deleting a category that a loan uses", () => {
  it("is refused, naming the loans, and changes nothing", async () => {
    seedAccount("acc-loan")
    seedCategory("cat-loan")
    seedLoan("loan-b", "acc-loan", "cat-loan")
    seedLoan("loan-a", "acc-loan", "cat-loan")
    const spent = await createTransaction(expense("acc-loan", "cat-loan"))
    drizzleDb
      .insert(budgets)
      .values({
        id: "budget-loan",
        name: "budget-loan",
        amount: 10_000,
        currencyCode: "USD",
        period: "monthly",
        startDate: now,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(budgetCategories)
      .values({
        budgetId: "budget-loan",
        categoryId: "cat-loan",
        createdAt: now,
      })
      .run()

    const failure = await deleteCategoryById("cat-loan").catch((e) => e)

    expect(failure).toBeInstanceOf(CategoryHasLoansError)
    expect((failure as CategoryHasLoansError).loanNames).toEqual([
      "loan-a",
      "loan-b",
    ])
    expect(categoryExists("cat-loan")).toBe(true)
    expect(categoryOf(spent)).toBe("cat-loan")
    expect(
      drizzleDb
        .select()
        .from(budgets)
        .where(eq(budgets.id, "budget-loan"))
        .get()?.isActive,
    ).toBe(1)
  })

  it("lists the loan names before the delete is tried", async () => {
    seedAccount("acc-names")
    seedCategory("cat-names")
    seedCategory("cat-other")
    seedLoan("loan-z", "acc-names", "cat-names")
    seedLoan("loan-y", "acc-names", "cat-names")
    seedLoan("loan-x", "acc-names", "cat-other")

    expect(await getLoansUsingCategory("cat-names")).toEqual([
      "loan-y",
      "loan-z",
    ])
    expect(await getLoansUsingCategory("cat-unused")).toEqual([])
  })
})
