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
  transfers,
} from "~/database/drizzle/schema"
import {
  createTransfer,
  deleteFutureRecurringInstances,
  detachFromRule,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string) {
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

const rowOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

describe("detachFromRule on a recurring transfer", () => {
  it("detaches both legs, so deleting the rest leaves the transfer alone", async () => {
    seedAccount("d-a")
    seedAccount("d-b")
    drizzleDb
      .insert(recurringTransactions)
      .values({
        id: "rule-t",
        jsonTransactionTemplate: "{}",
        range: JSON.stringify({ from: 0, to: 1 }),
        rules: JSON.stringify([]),
        createdAt: now,
      })
      .run()
    await createTransfer({
      fromAccountId: "d-a",
      toAccountId: "d-b",
      amount: 1_000,
      transactionDate: new Date(2026, 5, 5),
    })
    const link = drizzleDb
      .select()
      .from(transfers)
      .where(eq(transfers.fromAccountId, "d-a"))
      .get()
    const debitId = link?.fromTransactionId as string
    const creditId = link?.toTransactionId as string
    for (const id of [debitId, creditId]) {
      drizzleDb
        .update(transactions)
        .set({ recurringId: "rule-t" })
        .where(eq(transactions.id, id))
        .run()
    }

    await detachFromRule(creditId)

    expect(rowOf(debitId)?.recurringId).toBeNull()
    expect(rowOf(creditId)?.recurringId).toBeNull()

    await deleteFutureRecurringInstances("rule-t", new Date(2026, 0, 1))
    expect(rowOf(debitId)?.isDeleted).toBe(0)
    expect(rowOf(creditId)?.isDeleted).toBe(0)
  })

  it("still detaches a plain transaction", async () => {
    seedAccount("d-plain")
    drizzleDb
      .insert(transactions)
      .values({
        id: "plain-1",
        accountId: "d-plain",
        amount: 100,
        type: "expense",
        kind: "default",
        recurringId: "rule-t",
        transactionDate: now,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    await detachFromRule("plain-1")
    expect(rowOf("plain-1")?.recurringId).toBeNull()
  })
})

describe("detachFromRule on a plain instance", () => {
  it("clears the rule link from the column and from extra", async () => {
    seedAccount("d-extra")
    drizzleDb
      .insert(recurringTransactions)
      .values({
        id: "rule-p",
        jsonTransactionTemplate: "{}",
        range: JSON.stringify({ from: 0, to: 1 }),
        rules: JSON.stringify([]),
        createdAt: now,
      })
      .run()
    drizzleDb
      .insert(transactions)
      .values({
        id: "inst-1",
        accountId: "d-extra",
        amount: -500,
        type: "expense",
        transactionDate: now,
        recurringId: "rule-p",
        extra: JSON.stringify({
          recurringId: "rule-p",
          recurringInitialDate: "123",
          note: "keep",
        }),
        createdAt: now,
        updatedAt: now,
      })
      .run()

    await detachFromRule("inst-1")

    const row = rowOf("inst-1")
    expect(row?.recurringId).toBeNull()
    expect(JSON.parse(row?.extra ?? "{}")).toEqual({ note: "keep" })
  })
})
