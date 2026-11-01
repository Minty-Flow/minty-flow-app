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
  recurringTransactions,
  transactions,
} from "~/database/drizzle/schema"
import {
  deleteAllRecurringInstances,
  deleteFutureRecurringInstances,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seed(prefix: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id: `${prefix}-acc`,
      name: prefix,
      type: "checking",
      balance: 10_000,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id: `${prefix}-rule`,
      jsonTransactionTemplate: "{}",
      range: JSON.stringify({ from: 0, to: 1 }),
      rules: JSON.stringify([]),
      createdAt: now,
    })
    .run()
  const rows: { id: string; pending: 0 | 1; date: string }[] = [
    { id: `${prefix}-paid`, pending: 0, date: "2026-02-01T00:00:00.000Z" },
    { id: `${prefix}-open`, pending: 1, date: "2026-03-01T00:00:00.000Z" },
    { id: `${prefix}-next`, pending: 1, date: "2026-04-01T00:00:00.000Z" },
  ]
  for (const r of rows) {
    drizzleDb
      .insert(transactions)
      .values({
        id: r.id,
        accountId: `${prefix}-acc`,
        amount: 100,
        type: "expense",
        kind: "subscription",
        recurringId: `${prefix}-rule`,
        isPending: r.pending,
        transactionDate: r.date,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  }
}

const deleted = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()
    ?.isDeleted

describe("deleting recurring instances with keepPaid", () => {
  it("delete all spares paid rows but removes the explicitly deleted one", async () => {
    seed("all")
    await deleteAllRecurringInstances("all-rule", {
      keepPaid: true,
      alsoId: "all-paid",
    })
    expect(deleted("all-paid")).toBe(1)
    expect(deleted("all-open")).toBe(1)
    expect(deleted("all-next")).toBe(1)
  })

  it("delete all spares paid rows that were not picked", async () => {
    seed("keep")
    await deleteAllRecurringInstances("keep-rule", {
      keepPaid: true,
      alsoId: "keep-open",
    })
    expect(deleted("keep-paid")).toBe(0)
    expect(deleted("keep-open")).toBe(1)
    expect(deleted("keep-next")).toBe(1)
  })

  it("this-and-future only touches pending rows from the date on", async () => {
    seed("fut")
    await deleteFutureRecurringInstances("fut-rule", new Date(2026, 0, 1), {
      keepPaid: true,
      alsoId: "fut-open",
    })
    expect(deleted("fut-paid")).toBe(0)
    expect(deleted("fut-open")).toBe(1)
    expect(deleted("fut-next")).toBe(1)
  })

  it("still deletes paid rows without the option", async () => {
    seed("def")
    await deleteAllRecurringInstances("def-rule")
    expect(deleted("def-paid")).toBe(1)
  })
})
