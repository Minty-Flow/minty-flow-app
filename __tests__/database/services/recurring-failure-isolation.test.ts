import { asc, eq } from "drizzle-orm"
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
  isPermanentRuleError,
  synchronizeAllRecurringTransactions,
} from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

const now = "2026-01-01T00:00:00.000Z"
const start = Math.floor(Date.now() / 1000) * 1000 - 60_000

function addRule(id: string, title: string, accountId: string) {
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id,
      jsonTransactionTemplate: JSON.stringify({
        amount: 1_000,
        type: "expense",
        accountId,
        categoryId: null,
        title,
        kind: "subscription",
      }),
      range: JSON.stringify({ from: start, to: 4_102_444_800_000 }),
      rules: JSON.stringify([
        buildRRuleString({
          interval: 1,
          unit: "month",
          startDate: new Date(start),
        }),
      ]),
      createdAt: now,
    })
    .run()
}

describe("synchronizeAllRecurringTransactions", () => {
  it("turns off a rule that cannot generate and keeps the others syncing", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc-ok",
        name: "Checking",
        type: "checking",
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    // Inserted first, so it runs first and fails before the healthy rule.
    addRule("rule-bad", "Gym", "acc-gone")
    addRule("rule-good", "Netflix", "acc-ok")

    const stopped = await synchronizeAllRecurringTransactions()

    expect(stopped).toEqual([{ ruleId: "rule-bad", title: "Gym" }])
    const disabled = (id: string) =>
      drizzleDb
        .select({ disabled: recurringTransactions.disabled })
        .from(recurringTransactions)
        .where(eq(recurringTransactions.id, id))
        .get()?.disabled
    expect(disabled("rule-bad")).toBe(1)
    expect(disabled("rule-good")).toBe(0)

    const titles = drizzleDb
      .select({ title: transactions.title })
      .from(transactions)
      .orderBy(asc(transactions.transactionDate))
      .all()
      .map((r) => r.title)
    expect(titles).toEqual(["Netflix", "Netflix"])
  })

  it("does not report the stopped rule on the next sync", async () => {
    expect(await synchronizeAllRecurringTransactions()).toEqual([])
  })
})

describe("isPermanentRuleError", () => {
  it("treats a broken reference or missing destination as permanent", () => {
    expect(isPermanentRuleError("FOREIGN KEY constraint failed")).toBe(true)
    expect(isPermanentRuleError("CHECK constraint failed: x")).toBe(true)
    expect(
      isPermanentRuleError("Recurring transfer missing transferToAccountId"),
    ).toBe(true)
  })

  it("leaves a busy database to retry", () => {
    expect(isPermanentRuleError("SQLITE_BUSY: database is locked")).toBe(false)
  })
})
