import { eq, sql } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

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
  categories,
  recurringTransactions,
  transactions,
} from "~/database/drizzle/schema"
import { destroyAccount } from "~/database/services/account-service"
import { deleteCategoryById } from "~/database/services/category-service"
import {
  createRecurringRule,
  synchronizeAllRecurringTransactions,
} from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

const now = "2026-01-01T00:00:00.000Z"
const DAY_MS = 24 * 60 * 60 * 1000

function addAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

function addRule(
  id: string,
  template: unknown,
  extra: { transferToAccountId?: string | null; disabled?: 0 | 1 } = {},
) {
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id,
      jsonTransactionTemplate:
        typeof template === "string" ? template : JSON.stringify(template),
      transferToAccountId: extra.transferToAccountId ?? null,
      range: JSON.stringify({ from: 0, to: 4_102_444_800_000 }),
      rules: JSON.stringify(["FREQ=MONTHLY"]),
      disabled: extra.disabled ?? 0,
      createdAt: now,
    })
    .run()
}

const ruleRow = (id: string) =>
  drizzleDb
    .select({
      template: recurringTransactions.jsonTransactionTemplate,
      disabled: recurringTransactions.disabled,
    })
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, id))
    .get()

const categoryOf = (id: string) =>
  JSON.parse(ruleRow(id)?.template ?? "{}").categoryId

describe("deleting a category", () => {
  it("clears it from recurring templates so the rule keeps generating", async () => {
    addAccount("acc-cat")
    drizzleDb
      .insert(categories)
      .values({
        id: "cat-1",
        name: "Streaming",
        type: "expense",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    const start = Math.floor(Date.now() / 1000) * 1000 - 60_000
    const ruleId = await createRecurringRule({
      amount: 1_000,
      type: "expense",
      accountId: "acc-cat",
      categoryId: "cat-1",
      title: "Netflix",
      description: null,
      subtype: null,
      tags: [],
      kind: "subscription",
      range: { from: start, to: 4_102_444_800_000 },
      rules: [
        buildRRuleString({
          interval: 1,
          unit: "month",
          startDate: new Date(start),
        }),
      ],
    })
    const before = drizzleDb.select().from(transactions).all().length

    await deleteCategoryById("cat-1")
    await synchronizeAllRecurringTransactions(
      new Date(Date.now() + 40 * DAY_MS),
    )

    expect(categoryOf(ruleId)).toBeNull()
    expect(drizzleDb.select().from(transactions).all().length).toBeGreaterThan(
      before,
    )
  })
})

describe("destroying an account", () => {
  it("disables rules that generate into or transfer to it", async () => {
    addAccount("acc-a")
    addAccount("acc-b")
    addAccount("acc-c")
    addRule("rule-into-a", { accountId: "acc-a", type: "expense" })
    addRule(
      "rule-b-to-a",
      { accountId: "acc-b", type: "transfer" },
      { transferToAccountId: "acc-a" },
    )
    addRule("rule-on-c", { accountId: "acc-c", type: "expense" })
    addRule("rule-bad-json", "not json")

    await destroyAccount("acc-a")

    expect(ruleRow("rule-into-a")?.disabled).toBe(1)
    expect(ruleRow("rule-b-to-a")?.disabled).toBe(1)
    expect(ruleRow("rule-on-c")?.disabled).toBe(0)
    expect(ruleRow("rule-bad-json")?.disabled).toBe(0)
  })
})

describe("repair migration", () => {
  it("fixes templates that already point at deleted rows", () => {
    addAccount("acc-ok")
    addRule("fix-ok", {
      accountId: "acc-ok",
      type: "expense",
      categoryId: null,
    })
    addRule("fix-dead-category", {
      accountId: "acc-ok",
      type: "expense",
      categoryId: "cat-gone",
    })
    addRule("fix-dead-account", { accountId: "acc-gone", type: "expense" })
    addRule(
      "fix-dead-destination",
      { accountId: "acc-ok", type: "transfer" },
      { transferToAccountId: null },
    )
    addRule("fix-bad-json", "not json")

    const migration = readFileSync(
      fileURLToPath(
        new URL(
          "../../../drizzle/0004_repair_recurring_template_refs.sql",
          import.meta.url,
        ),
      ),
      "utf8",
    )
    for (const statement of migration.split("--> statement-breakpoint")) {
      drizzleDb.run(sql.raw(statement))
    }

    expect(ruleRow("fix-ok")?.disabled).toBe(0)
    expect(categoryOf("fix-dead-category")).toBeNull()
    expect(ruleRow("fix-dead-category")?.disabled).toBe(0)
    expect(ruleRow("fix-dead-account")?.disabled).toBe(1)
    expect(ruleRow("fix-dead-destination")?.disabled).toBe(1)
    expect(ruleRow("fix-bad-json")?.disabled).toBe(0)
  })
})
