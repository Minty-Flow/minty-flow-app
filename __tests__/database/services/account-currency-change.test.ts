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
import { accounts, recurringTransactions } from "~/database/drizzle/schema"
import { updateAccount } from "~/database/services/account-service"

const now = "2026-01-01T00:00:00.000Z"

describe("changing an account's currency", () => {
  it("skips a recurring template it cannot read and rescales the rest", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "cc-1",
        name: "cc-1",
        type: "checking",
        balance: 10_000,
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(recurringTransactions)
      .values([
        {
          id: "rule-bad",
          jsonTransactionTemplate: "{not json",
          range: JSON.stringify({ from: 0, to: 1 }),
          rules: JSON.stringify([]),
          createdAt: now,
        },
        {
          id: "rule-ok",
          jsonTransactionTemplate: JSON.stringify({
            accountId: "cc-1",
            amount: 1_000,
          }),
          range: JSON.stringify({ from: 0, to: 1 }),
          rules: JSON.stringify([]),
          createdAt: now,
        },
      ])
      .run()

    await updateAccount("cc-1", { currencyCode: "JPY" })

    const row = (ruleId: string) =>
      drizzleDb
        .select({ t: recurringTransactions.jsonTransactionTemplate })
        .from(recurringTransactions)
        .where(eq(recurringTransactions.id, ruleId))
        .get()?.t
    expect(row("rule-bad")).toBe("{not json")
    expect(JSON.parse(row("rule-ok") ?? "{}").amount).toBe(10)
    expect(
      drizzleDb.select().from(accounts).where(eq(accounts.id, "cc-1")).get()
        ?.currencyCode,
    ).toBe("JPY")
  })
})
