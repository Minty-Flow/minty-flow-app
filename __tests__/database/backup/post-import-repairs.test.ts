import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { repairImportedData } from "~/database/backup/backup-import-plan"
import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  categories,
  loans,
  recurringTransactions,
  transactions,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"

const now = "2026-01-01T00:00:00.000Z"

describe("repairImportedData", () => {
  it("aligns a loan row's kind, clears a dead template category, disables a rule with no account", async () => {
    drizzleDb
      .insert(accounts)
      .values({
        id: "acc",
        name: "acc",
        type: "checking",
        balance: 0,
        currencyCode: "USD",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(categories)
      .values({
        id: "cat",
        name: "c",
        type: "expense",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(loans)
      .values({
        id: "loan",
        name: "l",
        accountId: "acc",
        categoryId: "cat",
        principalAmount: 100,
        loanType: "borrowed",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    drizzleDb
      .insert(transactions)
      .values({
        id: "tx",
        accountId: "acc",
        loanId: "loan",
        amount: 100,
        type: "income",
        kind: "lent",
        transactionDate: now,
        createdAt: now,
        updatedAt: now,
      })
      .run()
    const template = (accountId: string) =>
      JSON.stringify({ accountId, categoryId: "gone", type: "expense" })
    for (const [id, accountId] of [
      ["rule-ok", "acc"],
      ["rule-no-account", "missing"],
    ] as const) {
      drizzleDb
        .insert(recurringTransactions)
        .values({
          id,
          jsonTransactionTemplate: template(accountId),
          range: JSON.stringify({ from: 0, to: 1 }),
          rules: JSON.stringify([]),
          createdAt: now,
        })
        .run()
    }

    await runInTransaction("test.repair", (db) => repairImportedData(db))

    const kind = drizzleDb
      .select()
      .from(transactions)
      .where(eq(transactions.id, "tx"))
      .get()?.kind
    expect(kind).toBe("borrowed")
    const ok = drizzleDb
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.id, "rule-ok"))
      .get()
    expect(
      JSON.parse(ok?.jsonTransactionTemplate ?? "{}").categoryId,
    ).toBeNull()
    expect(ok?.disabled).toBe(0)
    const dead = drizzleDb
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.id, "rule-no-account"))
      .get()
    expect(dead?.disabled).toBe(1)
  })
})
