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
  createRecurringRule,
  synchronizeAllRecurringTransactions,
} from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

const now = "2026-01-01T00:00:00.000Z"
const start = Math.floor(Date.now() / 1000) * 1000 - 60_000

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

const rule = (title: string) => ({
  amount: 1_000,
  type: "expense",
  accountId: "acc-1",
  categoryId: null,
  title,
  description: null,
  subtype: null,
  tags: [],
  kind: "subscription" as const,
  range: { from: start, to: 4_102_444_800_000 },
  rules: [
    buildRRuleString({
      interval: 1,
      unit: "month",
      startDate: new Date(start),
    }),
  ],
})

const instancesOf = (title: string) =>
  drizzleDb
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.title, title))
    .all().length

describe("a rule created while a sync pass is running", () => {
  it("is synced by the time creation resolves", async () => {
    drizzleDb
      .insert(recurringTransactions)
      .values({
        id: "rule-first",
        jsonTransactionTemplate: JSON.stringify({
          amount: 1_000,
          type: "expense",
          accountId: "acc-1",
          categoryId: null,
          title: "First",
          kind: "subscription",
        }),
        range: JSON.stringify({ from: start, to: 4_102_444_800_000 }),
        rules: JSON.stringify(rule("First").rules),
        createdAt: now,
      })
      .run()

    // Starts a pass that has already loaded its rule list: only "First".
    const running = synchronizeAllRecurringTransactions()
    await createRecurringRule(rule("Second"))

    expect(instancesOf("Second")).toBe(2)
    await running
    expect(instancesOf("First")).toBe(2)
  })
})

describe("calls that arrive while a pass is running", () => {
  it("share one rerun", async () => {
    const running = synchronizeAllRecurringTransactions()
    const second = synchronizeAllRecurringTransactions()
    const third = synchronizeAllRecurringTransactions()

    expect(second).toBe(third)
    expect(second).not.toBe(running)
    await Promise.all([running, second, third])
  })

  it("start a fresh pass once the sync is idle", async () => {
    const first = synchronizeAllRecurringTransactions()
    await first
    const next = synchronizeAllRecurringTransactions()

    expect(next).not.toBe(first)
    await next
  })
})
