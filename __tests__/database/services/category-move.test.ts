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
  recurringTransactions,
  transactions,
} from "~/database/drizzle/schema"
import {
  CategoryMoveTargetError,
  deleteCategoryById,
  getCategoryDeleteImpact,
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

function seedCategory(id: string, type: "expense" | "income" = "expense") {
  drizzleDb
    .insert(categories)
    .values({ id, name: id, type, createdAt: now, updatedAt: now })
    .run()
}

function seedBudget(id: string, categoryIds: string[], isActive: 0 | 1 = 1) {
  drizzleDb
    .insert(budgets)
    .values({
      id,
      name: id,
      amount: 10_000,
      currencyCode: "USD",
      period: "monthly",
      startDate: now,
      isActive,
      createdAt: now,
      updatedAt: now,
    })
    .run()
  for (const categoryId of categoryIds) {
    drizzleDb
      .insert(budgetCategories)
      .values({ budgetId: id, categoryId, createdAt: now })
      .run()
  }
}

function seedRule(id: string, categoryId: string) {
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id,
      jsonTransactionTemplate: JSON.stringify({ categoryId, accountId: "x" }),
      range: JSON.stringify({ from: 0, to: 4_102_444_800_000 }),
      rules: JSON.stringify(["FREQ=MONTHLY"]),
      createdAt: now,
    })
    .run()
}

const expense = (
  accountId: string,
  categoryId: string,
  budgetId?: string,
): Parameters<typeof createTransaction>[0] =>
  ({
    amount: 1_000,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    categoryId,
    budgetId,
    title: "x",
    tags: [],
    isPending: false,
    kind: "default",
  }) as Parameters<typeof createTransaction>[0]

const txRow = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

const linked = (budgetId: string) =>
  drizzleDb
    .select()
    .from(budgetCategories)
    .where(eq(budgetCategories.budgetId, budgetId))
    .all()
    .map((row) => row.categoryId)
    .sort()

const budgetActive = (id: string) =>
  drizzleDb.select().from(budgets).where(eq(budgets.id, id)).get()?.isActive

const templateCategory = (id: string) => {
  const row = drizzleDb
    .select()
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, id))
    .get()
  return JSON.parse(row?.jsonTransactionTemplate ?? "{}").categoryId
}

describe("deleting a category and moving its transactions", () => {
  it("moves live and trashed transactions to the target", async () => {
    seedAccount("acc-mv")
    seedCategory("mv-from")
    seedCategory("mv-to")
    const live = await createTransaction(expense("acc-mv", "mv-from"))
    const trashed = await createTransaction(expense("acc-mv", "mv-from"))
    await deleteTransaction(trashed)

    await deleteCategoryById("mv-from", { moveToCategoryId: "mv-to" })

    expect(txRow(live)?.categoryId).toBe("mv-to")
    expect(txRow(trashed)?.categoryId).toBe("mv-to")
    expect(
      drizzleDb
        .select()
        .from(categories)
        .where(eq(categories.id, "mv-from"))
        .get(),
    ).toBeUndefined()
  })

  it("moves recurring rules to the target", async () => {
    seedCategory("rr-from")
    seedCategory("rr-to")
    seedRule("rule-mv", "rr-from")

    await deleteCategoryById("rr-from", { moveToCategoryId: "rr-to" })

    expect(templateCategory("rule-mv")).toBe("rr-to")
  })

  it("refuses a target of the other type and changes nothing", async () => {
    seedAccount("acc-ty")
    seedCategory("ty-from")
    seedCategory("ty-income", "income")
    const id = await createTransaction(expense("acc-ty", "ty-from"))

    await expect(
      deleteCategoryById("ty-from", { moveToCategoryId: "ty-income" }),
    ).rejects.toMatchObject({ reason: "type-mismatch" })
    await expect(
      deleteCategoryById("ty-from", { moveToCategoryId: "ty-income" }),
    ).rejects.toBeInstanceOf(CategoryMoveTargetError)

    expect(txRow(id)?.categoryId).toBe("ty-from")
  })

  it("refuses itself and a missing target", async () => {
    seedCategory("bad-from")

    await expect(
      deleteCategoryById("bad-from", { moveToCategoryId: "bad-from" }),
    ).rejects.toMatchObject({ reason: "same-category" })
    await expect(
      deleteCategoryById("bad-from", { moveToCategoryId: "nope" }),
    ).rejects.toMatchObject({ reason: "not-found" })
  })

  it("hands a budget's only category to the target and keeps it on", async () => {
    seedAccount("acc-bo")
    seedCategory("bo-from")
    seedCategory("bo-to")
    seedBudget("budget-only", ["bo-from"])
    const id = await createTransaction(
      expense("acc-bo", "bo-from", "budget-only"),
    )

    await deleteCategoryById("bo-from", { moveToCategoryId: "bo-to" })

    expect(linked("budget-only")).toEqual(["bo-to"])
    expect(budgetActive("budget-only")).toBe(1)
    expect(txRow(id)).toMatchObject({
      categoryId: "bo-to",
      budgetId: "budget-only",
    })
  })

  it("drops the category from a multi-category budget and untags moved transactions", async () => {
    seedAccount("acc-bm")
    seedCategory("bm-from")
    seedCategory("bm-other")
    seedCategory("bm-to")
    seedBudget("budget-multi", ["bm-from", "bm-other"])
    const id = await createTransaction(
      expense("acc-bm", "bm-from", "budget-multi"),
    )

    await deleteCategoryById("bm-from", { moveToCategoryId: "bm-to" })

    expect(linked("budget-multi")).toEqual(["bm-other"])
    expect(budgetActive("budget-multi")).toBe(1)
    expect(txRow(id)).toMatchObject({ categoryId: "bm-to", budgetId: null })
  })

  it("keeps the budget on transactions when it already has the target", async () => {
    seedAccount("acc-bt")
    seedCategory("bt-from")
    seedCategory("bt-to")
    seedBudget("budget-both", ["bt-from", "bt-to"])
    const id = await createTransaction(
      expense("acc-bt", "bt-from", "budget-both"),
    )

    await deleteCategoryById("bt-from", { moveToCategoryId: "bt-to" })

    expect(linked("budget-both")).toEqual(["bt-to"])
    expect(txRow(id)).toMatchObject({
      categoryId: "bt-to",
      budgetId: "budget-both",
    })
  })
})

describe("category delete impact", () => {
  it("counts the transactions and recurring rules that would move", async () => {
    seedAccount("acc-im")
    seedCategory("im-cat")
    await createTransaction(expense("acc-im", "im-cat"))
    const trashed = await createTransaction(expense("acc-im", "im-cat"))
    await deleteTransaction(trashed)
    seedRule("rule-im-1", "im-cat")
    seedRule("rule-im-2", "im-cat")

    expect(await getCategoryDeleteImpact("im-cat")).toEqual({
      transactionCount: 2,
      recurringRuleCount: 2,
    })
  })
})
