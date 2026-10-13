import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { TRASH_RETENTION_CHOICES } from "~/constants/trash-retention"
import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import {
  autoPurgeTrash,
  createTransaction,
  deleteTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

drizzleDb
  .insert(accounts)
  .values({
    id: "acc",
    name: "acc",
    type: "checking",
    balance: 1_000_000,
    currencyCode: "USD",
    createdAt: now,
    updatedAt: now,
  })
  .run()

const DAY = 86_400_000

/** A transaction that went to the trash `daysAgo` days ago. */
async function trashedDaysAgo(daysAgo: number): Promise<string> {
  const id = await createTransaction({
    amount: 100,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId: "acc",
    title: "x",
    tags: [],
    isPending: false,
    kind: "default",
  } as Parameters<typeof createTransaction>[0])
  await deleteTransaction(id)
  drizzleDb
    .update(transactions)
    .set({ deletedAt: new Date(Date.now() - daysAgo * DAY).toISOString() })
    .where(eq(transactions.id, id))
    .run()
  return id
}

const exists = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get() !==
  undefined

describe("autoPurgeTrash with every value the settings screen stores", () => {
  const withDays = TRASH_RETENTION_CHOICES.flatMap((c) =>
    c.days === null ? [] : [{ value: c.value as string, days: c.days }],
  )

  for (const { value, days } of withDays) {
    it(`purges a row older than ${value} and keeps a newer one`, async () => {
      const old = await trashedDaysAgo(days + 1)
      const recent = await trashedDaysAgo(days - 1)

      await autoPurgeTrash(value)

      expect(exists(old)).toBe(false)
      expect(exists(recent)).toBe(true)
    })
  }

  it("purges nothing for forever", async () => {
    const id = await trashedDaysAgo(5_000)
    await autoPurgeTrash("forever")
    expect(exists(id)).toBe(true)
  })

  it("purges nothing for a value it cannot read", async () => {
    const id = await trashedDaysAgo(5_000)
    for (const value of ["30days", "", "soon", "0 days"]) {
      await autoPurgeTrash(value)
    }
    expect(exists(id)).toBe(true)
  })

  it("never touches a transaction that is not in the trash", async () => {
    const id = await createTransaction({
      amount: 100,
      type: "expense",
      transactionDate: new Date(2020, 0, 5),
      accountId: "acc",
      title: "live",
      tags: [],
      isPending: false,
      kind: "default",
    } as Parameters<typeof createTransaction>[0])
    await autoPurgeTrash("1 day")
    expect(exists(id)).toBe(true)
  })
})
