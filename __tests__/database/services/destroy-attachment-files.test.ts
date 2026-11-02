import { eq } from "drizzle-orm"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

// The file layer: record which stored files get deleted.
const deleted = vi.hoisted(() => [] as string[])
vi.mock("~/utils/attachments", () => ({
  deleteAttachmentFile: (stored: string) => {
    deleted.push(stored)
  },
}))

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { destroyAccount } from "~/database/services/account-service"
import {
  createTransaction,
  createTransfer,
  deleteTransaction,
  destroyAllDeletedTransactions,
  destroyTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

for (const id of ["acc-a", "acc-b"]) {
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

/** The `extra` blob the form writes: attachments are a JSON string. */
function extraWith(...files: string[]) {
  return {
    attachments: JSON.stringify(
      files.map((uri) => ({
        uri,
        name: uri,
        size: 1,
        addedAt: now,
        ext: "jpg",
      })),
    ),
  }
}

async function expenseWithFiles(accountId: string, ...files: string[]) {
  return createTransaction({
    amount: 1_000,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    title: "Receipt",
    tags: [],
    isPending: false,
    kind: "default",
    extra: extraWith(...files),
  } as Parameters<typeof createTransaction>[0])
}

beforeEach(() => {
  deleted.length = 0
  drizzleDb.delete(transactions).run()
})

describe("destroying a transaction", () => {
  it("deletes its attachment files", async () => {
    const id = await expenseWithFiles("acc-a", "att_1.jpg", "att_2.jpg")
    await destroyTransaction(id)

    expect(deleted.sort()).toEqual(["att_1.jpg", "att_2.jpg"])
    expect(
      drizzleDb
        .select()
        .from(transactions)
        .where(eq(transactions.id, id))
        .all(),
    ).toHaveLength(0)
  })

  it("deletes nothing for a transaction without attachments", async () => {
    const id = await createTransaction({
      amount: 500,
      type: "expense",
      transactionDate: new Date(2026, 0, 5),
      accountId: "acc-a",
      tags: [],
      isPending: false,
      kind: "default",
    } as Parameters<typeof createTransaction>[0])
    await destroyTransaction(id)
    expect(deleted).toEqual([])
  })

  it("keeps the files when the destroy rolls back", async () => {
    await expect(destroyTransaction("missing-id")).rejects.toThrow()
    expect(deleted).toEqual([])
  })

  it("deletes the files of both legs of a transfer", async () => {
    await createTransfer({
      fromAccountId: "acc-a",
      toAccountId: "acc-b",
      amount: 2_000,
      transactionDate: new Date(2026, 0, 6),
    })
    const [first, second] = drizzleDb.select().from(transactions).all()
    for (const [leg, file] of [
      [first, "att_out.jpg"],
      [second, "att_in.jpg"],
    ] as const) {
      drizzleDb
        .update(transactions)
        .set({ extra: JSON.stringify(extraWith(file)) })
        .where(eq(transactions.id, leg.id))
        .run()
    }
    await destroyTransaction(first.id)
    expect(deleted.sort()).toEqual(["att_in.jpg", "att_out.jpg"])
  })
})

describe("emptying the trash", () => {
  it("deletes the files of every destroyed row", async () => {
    const a = await expenseWithFiles("acc-a", "att_a.jpg")
    const b = await expenseWithFiles("acc-a", "att_b.jpg")
    await deleteTransaction(a)
    await deleteTransaction(b)
    await destroyAllDeletedTransactions()
    expect(deleted.sort()).toEqual(["att_a.jpg", "att_b.jpg"])
  })
})

describe("destroying an account", () => {
  it("deletes the files of the transactions it takes with it", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc-gone",
        name: "gone",
        type: "checking",
        balance: 0,
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    await expenseWithFiles("acc-gone", "att_gone.jpg")
    await destroyAccount("acc-gone")
    expect(deleted).toEqual(["att_gone.jpg"])
  })
})
