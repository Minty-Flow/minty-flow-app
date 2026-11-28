import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})
vi.mock("~/database/drizzle/use-live-query", () => ({ useLiveQuery: vi.fn() }))
vi.mock("~/styles/theme/registry", () => ({ getThemeStrict: () => null }))

import { drizzleDb } from "~/database/drizzle/db"
import {
  createTransactionRowReuser,
  getTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import {
  accounts,
  categories,
  tags,
  transactionItems,
  transactions,
  transactionTags,
  transfers,
} from "~/database/drizzle/schema"

const now = "2026-01-01T00:00:00.000Z"
const stamps = { createdAt: now, updatedAt: now }

for (const id of ["a", "b"]) {
  drizzleDb
    .insert(accounts)
    .values({ id, name: id, type: "checking", currencyCode: "USD", ...stamps })
    .run()
}
drizzleDb
  .insert(categories)
  .values({ id: "food", name: "Food", type: "expense", ...stamps })
  .run()
drizzleDb
  .insert(tags)
  .values({ id: "tag", name: "tag", type: "generic", ...stamps })
  .run()

// "plain" and "tagged" sit on account a; "out"/"in" are a transfer from b to a.
for (const [id, accountId, categoryId] of [
  ["plain", "a", "food"],
  ["tagged", "a", null],
  ["out", "b", null],
  ["in", "a", null],
] as const) {
  drizzleDb
    .insert(transactions)
    .values({
      id,
      accountId,
      categoryId,
      type: "expense",
      amount: 1,
      transactionDate: now,
      ...stamps,
    })
    .run()
}
drizzleDb
  .insert(transfers)
  .values({
    id: "transfer",
    fromTransactionId: "out",
    toTransactionId: "in",
    fromAccountId: "b",
    toAccountId: "a",
    ...stamps,
  })
  .run()

const reuse = createTransactionRowReuser()
let before = reuse(await getTransactions({}))

/** Applies a write, refreshes, and names the rows that got a new object. */
async function changedBy(write: () => void): Promise<string[]> {
  write()
  const after = reuse(await getTransactions({}))
  const changed = after.filter((row) => !before.includes(row))
  before = after
  return changed.map((row) => row.id).sort()
}

describe("transaction row reuse", () => {
  it("keeps every row when nothing changed", async () => {
    expect(await changedBy(() => {})).toEqual([])
  })

  it("ignores an account balance change", async () => {
    expect(
      await changedBy(() =>
        drizzleDb
          .update(accounts)
          .set({ balance: 500, updatedAt: "2026-02-01T00:00:00.000Z" })
          .run(),
      ),
    ).toEqual([])
  })

  it("replaces only the edited transaction", async () => {
    expect(
      await changedBy(() =>
        drizzleDb
          .update(transactions)
          .set({ title: "Lunch" })
          .where(eq(transactions.id, "plain"))
          .run(),
      ),
    ).toEqual(["plain"])
  })

  it("replaces the rows that name a renamed account", async () => {
    expect(
      await changedBy(() =>
        drizzleDb
          .update(accounts)
          .set({ name: "Bank" })
          .where(eq(accounts.id, "b"))
          .run(),
      ),
    ).toEqual(["in", "out"])
  })

  it("replaces the rows of a renamed category", async () => {
    expect(
      await changedBy(() =>
        drizzleDb.update(categories).set({ name: "Meals" }).run(),
      ),
    ).toEqual(["plain"])
  })

  it("replaces a row whose tags or items change", async () => {
    expect(
      await changedBy(() => {
        drizzleDb
          .insert(transactionTags)
          .values({ transactionId: "tagged", tagId: "tag" })
          .run()
        drizzleDb
          .insert(transactionItems)
          .values({
            id: "item",
            transactionId: "plain",
            name: "milk",
            unitPrice: 1,
          })
          .run()
      }),
    ).toEqual(["plain", "tagged"])
  })

  it("replaces both legs when the transfer changes", async () => {
    expect(
      await changedBy(() =>
        drizzleDb.update(transfers).set({ conversionRate: 2 }).run(),
      ),
    ).toEqual(["in", "out"])
  })

  it("replaces every row when the day changes", async () => {
    const rows = await getTransactions({})
    const daily = createTransactionRowReuser()
    const monday = daily(rows, "monday")
    const again = daily(await getTransactions({}), "monday")
    expect(again.every((row) => monday.includes(row))).toBe(true)
    const tuesday = daily(await getTransactions({}), "tuesday")
    expect(tuesday.filter((row) => monday.includes(row))).toEqual([])
  })
})
