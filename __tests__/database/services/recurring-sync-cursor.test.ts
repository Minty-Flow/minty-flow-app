import { asc, eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  recurringTransactions,
  transactions,
  transfers,
} from "~/database/drizzle/schema"
import { synchronizeAllRecurringTransactions } from "~/database/services/recurring-transaction-service"
import { buildRRuleString } from "~/utils/recurrence"

const now = "2026-01-01T00:00:00.000Z"
const START = new Date(2026, 0, 1, 9, 0, 0)

function seedAccount(id: string, balance = 1_000_000) {
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

/** A daily rule starting 1 Jan 09:00, optionally a transfer rule. */
function addRule(
  id: string,
  accountId: string,
  transferTo?: string,
  start = START,
) {
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id,
      jsonTransactionTemplate: JSON.stringify({
        amount: 1_000,
        type: transferTo ? "transfer" : "expense",
        accountId,
        categoryId: null,
        title: "Daily",
        kind: "repetitive",
      }),
      transferToAccountId: transferTo ?? null,
      range: JSON.stringify({
        from: start.getTime(),
        to: new Date(2099, 11, 31).getTime(),
      }),
      rules: JSON.stringify([
        buildRRuleString({ interval: 1, unit: "day", startDate: start }),
      ]),
      createdAt: now,
    })
    .run()
}

const instances = (ruleId: string) =>
  drizzleDb
    .select({
      id: transactions.id,
      date: transactions.transactionDate,
      isPending: transactions.isPending,
    })
    .from(transactions)
    .where(eq(transactions.recurringId, ruleId))
    .orderBy(asc(transactions.transactionDate))
    .all()

const cursorOf = (ruleId: string) =>
  drizzleDb
    .select()
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, ruleId))
    .get()?.lastGeneratedTransactionDate

const setCursor = (ruleId: string, iso: string | null) =>
  drizzleDb
    .update(recurringTransactions)
    .set({ lastGeneratedTransactionDate: iso })
    .where(eq(recurringTransactions.id, ruleId))
    .run()

const at = (day: number, hour = 9) => new Date(2026, 0, day, hour)

/** Dates of the instances as local "day" numbers in January. */
const days = (ruleId: string) =>
  instances(ruleId).map((r) => new Date(r.date).getDate())

describe("a rule whose cursor is behind an instance that exists", () => {
  it("catches the cursor up and keeps generating", async () => {
    seedAccount("lag-1")
    addRule("lag-1", "lag-1")
    await synchronizeAllRecurringTransactions(at(4, 12))
    expect(days("lag-1")).toEqual([1, 2, 3, 4, 5])

    // The interrupted write: instance 5 exists, the cursor stayed on 4.
    setCursor("lag-1", at(4).toISOString())
    await synchronizeAllRecurringTransactions(at(8, 12))

    expect(days("lag-1")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(cursorOf("lag-1")).toBe(at(9).toISOString())
  })

  it("recovers a rule that is several steps behind", async () => {
    seedAccount("lag-2")
    addRule("lag-2", "lag-2")
    await synchronizeAllRecurringTransactions(at(4, 12))
    setCursor("lag-2", at(1).toISOString())

    await synchronizeAllRecurringTransactions(at(8, 12))

    expect(days("lag-2")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it("never creates a duplicate while catching up", async () => {
    seedAccount("lag-3")
    addRule("lag-3", "lag-3")
    await synchronizeAllRecurringTransactions(at(4, 12))
    setCursor("lag-3", null)

    await synchronizeAllRecurringTransactions(at(6, 12))

    const dates = instances("lag-3").map((r) => r.date)
    expect(new Set(dates).size).toBe(dates.length)
    expect(days("lag-3")).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it("keeps the one-ahead policy: one pending instance after the anchor", async () => {
    seedAccount("lag-4")
    addRule("lag-4", "lag-4")
    await synchronizeAllRecurringTransactions(at(4, 12))
    setCursor("lag-4", at(3).toISOString())
    await synchronizeAllRecurringTransactions(at(7, 12))

    const rows = instances("lag-4")
    const ahead = rows.filter((r) => new Date(r.date) > at(7, 12))
    expect(ahead).toHaveLength(1)
    expect(ahead[0]?.isPending).toBe(1)
  })
})

describe("repeated syncs", () => {
  it("create nothing new for the same anchor", async () => {
    seedAccount("again")
    addRule("again", "again")
    await synchronizeAllRecurringTransactions(at(4, 12))
    const first = instances("again").length
    await synchronizeAllRecurringTransactions(at(4, 12))
    await synchronizeAllRecurringTransactions(at(4, 12))
    expect(instances("again")).toHaveLength(first)
  })
})

describe("an instance and the cursor are written together", () => {
  const blockCursorWrites = () =>
    drizzleDb.run(
      sql.raw(`CREATE TRIGGER block_cursor
        BEFORE UPDATE OF last_generated_transaction_date ON recurring_transactions
        BEGIN SELECT RAISE(ABORT, 'cursor write blocked'); END`),
    )
  const allowCursorWrites = () =>
    drizzleDb.run(sql.raw("DROP TRIGGER IF EXISTS block_cursor"))

  it("leaves no instance behind when the cursor write fails", async () => {
    seedAccount("atomic-1")
    addRule("atomic-1", "atomic-1")
    blockCursorWrites()
    try {
      await synchronizeAllRecurringTransactions(at(4, 12))
      expect(instances("atomic-1")).toHaveLength(0)
      expect(cursorOf("atomic-1")).toBeNull()
    } finally {
      allowCursorWrites()
    }

    await synchronizeAllRecurringTransactions(at(4, 12))
    expect(days("atomic-1")).toEqual([1, 2, 3, 4, 5])
  })

  it("applies the balance only once the instance is kept", async () => {
    seedAccount("atomic-2", 100_000)
    addRule("atomic-2", "atomic-2")
    blockCursorWrites()
    try {
      await synchronizeAllRecurringTransactions(at(4, 12))
    } finally {
      allowCursorWrites()
    }
    const blocked = drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.id, "atomic-2"))
      .get()?.balance
    expect(blocked).toBe(100_000)

    await synchronizeAllRecurringTransactions(at(4, 12))
    const after = drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.id, "atomic-2"))
      .get()?.balance
    // Four past instances are confirmed; the fifth is pending.
    expect(after).toBe(100_000 - 4 * 1_000)
  })

  it("does the same for a transfer rule", async () => {
    seedAccount("atomic-from")
    seedAccount("atomic-to")
    addRule("atomic-3", "atomic-from", "atomic-to")
    blockCursorWrites()
    try {
      await synchronizeAllRecurringTransactions(at(4, 12))
      expect(instances("atomic-3")).toHaveLength(0)
      expect(drizzleDb.select().from(transfers).all()).toHaveLength(0)
    } finally {
      allowCursorWrites()
    }

    await synchronizeAllRecurringTransactions(at(4, 12))
    // Two legs per occurrence, one link per occurrence.
    expect(instances("atomic-3")).toHaveLength(10)
    expect(drizzleDb.select().from(transfers).all()).toHaveLength(5)
  })
})

describe("a transfer rule whose cursor is behind", () => {
  it("catches up and keeps generating both legs", async () => {
    seedAccount("tl-from")
    seedAccount("tl-to")
    addRule("lag-t", "tl-from", "tl-to")
    await synchronizeAllRecurringTransactions(at(4, 12))
    setCursor("lag-t", at(4).toISOString())

    await synchronizeAllRecurringTransactions(at(8, 12))

    expect(instances("lag-t")).toHaveLength(18)
    expect(
      drizzleDb.select().from(transfers).all().length,
    ).toBeGreaterThanOrEqual(9)
  })
})

describe("catching up after a long absence", () => {
  it("stops at the safety limit and finishes on the next sync", async () => {
    seedAccount("long")
    const start = new Date(2025, 0, 1, 9, 0, 0)
    addRule("long", "long", undefined, start)
    const anchor = new Date(2026, 1, 5, 12)

    await synchronizeAllRecurringTransactions(anchor)
    expect(instances("long")).toHaveLength(365)

    await synchronizeAllRecurringTransactions(anchor)
    const rows = instances("long")
    expect(rows.length).toBeGreaterThan(365)
    expect(new Set(rows.map((r) => r.date)).size).toBe(rows.length)
    expect(rows.filter((r) => new Date(r.date) > anchor)).toHaveLength(1)
  }, 60_000)
})
