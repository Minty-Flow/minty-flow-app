import { count, eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions, transfers } from "~/database/drizzle/schema"
import { destroyAccount } from "~/database/services/account-service"

const now = "2026-01-01T00:00:00.000Z"
// One more than the number of ids that, bound twice, still fits one statement.
const TRANSFERS = 16_384
const CHUNK = 500

function addAccount(id: string, balance: number) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

function row(id: string, accountId: string, amount: number) {
  return {
    id,
    accountId,
    amount,
    type: "transfer",
    transactionDate: now,
    createdAt: now,
    updatedAt: now,
  } as const
}

const balanceOf = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()?.balance

describe("destroying an account with a very large history", () => {
  it("deletes it and reverses only the live, confirmed partner legs", async () => {
    addAccount("big", 0)
    addAccount("out", 100_000)
    addAccount("in", 100_000)
    const indexes = Array.from({ length: TRANSFERS }, (_, i) => i)
    for (let start = 0; start < TRANSFERS; start += CHUNK) {
      const chunk = indexes.slice(start, start + CHUNK)
      drizzleDb
        .insert(transactions)
        .values(
          chunk.flatMap((i) => {
            // Even transfers leave `big` for `out`, odd ones arrive from `in`.
            const partner = i % 2 === 0 ? "out" : "in"
            const sign = i % 2 === 0 ? 1 : -1
            return [
              row(`own-${i}`, "big", -sign),
              {
                ...row(`partner-${i}`, partner, sign),
                // Neither of these two counts towards the partner's balance.
                isPending: i === 0 ? (1 as const) : (0 as const),
                isDeleted: i === 2 ? (1 as const) : (0 as const),
              },
            ]
          }),
        )
        .run()
      drizzleDb
        .insert(transfers)
        .values(
          chunk.map((i) => {
            const leaves = i % 2 === 0
            return {
              id: `transfer-${i}`,
              fromTransactionId: leaves ? `own-${i}` : `partner-${i}`,
              toTransactionId: leaves ? `partner-${i}` : `own-${i}`,
              fromAccountId: leaves ? "big" : "in",
              toAccountId: leaves ? "out" : "big",
              createdAt: now,
              updatedAt: now,
            }
          }),
        )
        .run()
    }

    await destroyAccount("big")

    expect(balanceOf("big")).toBeUndefined()
    expect(balanceOf("out")).toBe(100_000 - (TRANSFERS / 2 - 2))
    expect(balanceOf("in")).toBe(100_000 + TRANSFERS / 2)
    expect(drizzleDb.select({ n: count() }).from(transfers).get()?.n).toBe(0)
    expect(
      drizzleDb
        .select({ n: count() })
        .from(transactions)
        .where(eq(transactions.isDeleted, 1))
        .get()?.n,
    ).toBe(TRANSFERS)
  }, 60_000)
})
