import { asc } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { createRecurringRule } from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

const now = "2026-01-01T00:00:00.000Z"
const MINUTE_MS = 60_000
const DAY_MS = 24 * 60 * MINUTE_MS

/** Whole seconds: RRule drops milliseconds from DTSTART. */
const secondsAgo = (ms: number) => Math.floor((Date.now() - ms) / 1000) * 1000

drizzleDb
  .insert(accounts)
  .values({
    id: "acc-1",
    name: "Checking",
    type: "checking",
    currencyCode: "USD",
    createdAt: now,
    updatedAt: now,
  })
  .run()

async function createMonthlyRule(startMs: number) {
  const startDate = new Date(startMs)
  await createRecurringRule({
    amount: 1_000,
    type: "expense",
    accountId: "acc-1",
    categoryId: null,
    title: "Netflix",
    description: null,
    subtype: null,
    tags: [],
    kind: "subscription",
    range: { from: startMs, to: new Date(2099, 11, 31).getTime() },
    rules: [buildRRuleString({ interval: 1, unit: "month", startDate })],
  })
}

const generated = () =>
  drizzleDb
    .select({
      date: transactions.transactionDate,
      isPending: transactions.isPending,
    })
    .from(transactions)
    .orderBy(asc(transactions.transactionDate))
    .all()

describe("first recurring sync", () => {
  it("generates an instance on a start date that is already past", async () => {
    const start = secondsAgo(MINUTE_MS)

    await createMonthlyRule(start)

    const rows = generated()
    expect(rows).toHaveLength(2)
    expect(rows[0]).toEqual({
      date: new Date(start).toISOString(),
      isPending: 0,
    })
    expect(rows[1].isPending).toBe(1)
  })
})

describe("first recurring sync with a future start date", () => {
  it("generates the first instance on the start date, pending", async () => {
    drizzleDb.delete(transactions).run()
    const start = secondsAgo(-DAY_MS)

    await createMonthlyRule(start)

    expect(generated()).toEqual([
      { date: new Date(start).toISOString(), isPending: 1 },
    ])
  })
})
