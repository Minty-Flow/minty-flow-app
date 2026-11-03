import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { onWriteCommitted } from "~/database/commit-events"
import { drizzleDb } from "~/database/drizzle/db"
import { accounts } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"

const now = "2026-01-01T00:00:00.000Z"

drizzleDb
  .insert(accounts)
  .values({
    id: "nested-acc",
    name: "Checking",
    type: "checking",
    balance: 0,
    currencyCode: "USD",
    createdAt: now,
    updatedAt: now,
  })
  .run()

const balanceOf = () =>
  drizzleDb
    .select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, "nested-acc"))
    .get()?.balance

describe("nested runInTransaction", () => {
  it("joins the open transaction instead of dropping its write", async () => {
    let inner: Promise<unknown> | null = null

    await runInTransaction("outer", (db) => {
      db.update(accounts)
        .set({ balance: 1 })
        .where(eq(accounts.id, "nested-acc"))
        .run()
      inner = runInTransaction("inner", (innerDb) => {
        innerDb
          .update(accounts)
          .set({ balance: 2 })
          .where(eq(accounts.id, "nested-acc"))
          .run()
      })
    })
    await inner

    expect(balanceOf()).toBe(2)
  })

  it("reports only the outermost commit", async () => {
    const seen: string[] = []
    const off = onWriteCommitted((name) => seen.push(name))
    let inner: Promise<unknown> | null = null

    await runInTransaction("outer.name", () => {
      inner = runInTransaction("inner.name", () => undefined)
    })
    await inner
    off()

    expect(seen).toEqual(["outer.name"])
  })
})
