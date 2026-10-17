import { and, eq } from "drizzle-orm"
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
import { applyRecurringEditScope } from "~/database/services/recurring-transaction-service"
import type { RecurringEditPayload } from "~/schemas/transactions.schema"

const now = "2026-01-01T00:00:00.000Z"
const DAY_MS = 24 * 60 * 60 * 1000
const EDITED = new Date("2026-02-15T00:00:00.000Z")

type SeedOptions = {
  /** The edited (first) instance is already confirmed, the rest are pending. */
  confirmedFirst?: boolean
  /** `requires_manual_confirmation` stored on the future instances. */
  futureManual?: 0 | 1
}

function seedRule(ruleId: string, options: SeedOptions = {}) {
  drizzleDb
    .insert(recurringTransactions)
    .values({
      id: ruleId,
      jsonTransactionTemplate: JSON.stringify({
        amount: 1_000,
        type: "expense",
        accountId: "acc-1",
        categoryId: null,
        title: "Netflix",
        kind: "subscription",
      }),
      range: JSON.stringify({
        from: Date.parse("2026-01-15"),
        to: new Date(2099, 11, 31).getTime(),
      }),
      rules: JSON.stringify(["DTSTART:20260115T000000Z\nRRULE:FREQ=MONTHLY"]),
      createdAt: now,
    })
    .run()
  const dates = ["2026-02-15", "2026-03-15", "2026-04-15"]
  drizzleDb
    .insert(transactions)
    .values(
      dates.map((d, i) => ({
        id: `${ruleId}-t${i}`,
        accountId: "acc-1",
        amount: 1_000,
        type: "expense",
        kind: "subscription",
        isPending:
          options.confirmedFirst && i === 0 ? (0 as const) : (1 as const),
        requiresManualConfirmation:
          i === 0 ? (0 as const) : (options.futureManual ?? 0),
        recurringId: ruleId,
        transactionDate: `${d}T00:00:00.000Z`,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .run()
}

function editPayload(
  transactionDate: Date,
  overrides: Partial<RecurringEditPayload> = {},
): RecurringEditPayload {
  return {
    amount: 1_500,
    type: "expense",
    transactionDate,
    categoryId: null,
    accountId: "acc-1",
    title: "Netflix 4K",
    isPending: true,
    ...overrides,
  } as RecurringEditPayload
}

function rowsOf(ruleId: string) {
  return drizzleDb
    .select({
      isPending: transactions.isPending,
      manual: transactions.requiresManualConfirmation,
    })
    .from(transactions)
    .where(eq(transactions.recurringId, ruleId))
    .orderBy(transactions.transactionDate)
    .all()
}

function accountBalance() {
  return drizzleDb
    .select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, "acc-1"))
    .get()?.balance
}

function datesOf(ruleId: string) {
  return drizzleDb
    .select({ date: transactions.transactionDate })
    .from(transactions)
    .where(
      and(eq(transactions.recurringId, ruleId), eq(transactions.isDeleted, 0)),
    )
    .orderBy(transactions.transactionDate)
    .all()
    .map((r) => r.date)
}

describe("applyRecurringEditScope this_and_future", () => {
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

  it("keeps every future instance on its own date", async () => {
    seedRule("rule-keep")

    await applyRecurringEditScope({
      scope: "this_and_future",
      transactionId: "rule-keep-t0",
      transactionDate: EDITED,
      ruleId: "rule-keep",
      payload: editPayload(EDITED),
    })

    expect(datesOf("rule-keep")).toEqual([
      "2026-02-15T00:00:00.000Z",
      "2026-03-15T00:00:00.000Z",
      "2026-04-15T00:00:00.000Z",
    ])
  })

  it("shifts the edited instance and every future one by the same delta", async () => {
    seedRule("rule-shift")

    await applyRecurringEditScope({
      scope: "this_and_future",
      transactionId: "rule-shift-t0",
      transactionDate: EDITED,
      ruleId: "rule-shift",
      payload: editPayload(new Date(EDITED.getTime() + 2 * DAY_MS)),
    })

    expect(datesOf("rule-shift")).toEqual([
      "2026-02-17T00:00:00.000Z",
      "2026-03-17T00:00:00.000Z",
      "2026-04-17T00:00:00.000Z",
    ])
  })

  it("leaves future instances pending when a confirmed instance is edited", async () => {
    seedRule("rule-pending", { confirmedFirst: true })
    const before = accountBalance()

    await applyRecurringEditScope({
      scope: "this_and_future",
      transactionId: "rule-pending-t0",
      transactionDate: EDITED,
      ruleId: "rule-pending",
      payload: editPayload(EDITED, { isPending: false }),
    })

    expect(rowsOf("rule-pending").map((r) => r.isPending)).toEqual([0, 1, 1])
    // Only the edited instance's amount change (-1000 -> -1500) reaches the
    // balance; pending future instances do not.
    expect(accountBalance()).toBe((before ?? 0) - 500)
  })

  it("does not copy the manual-confirmation flag when it is unchanged", async () => {
    seedRule("rule-manual-same", { futureManual: 1 })

    await applyRecurringEditScope({
      scope: "this_and_future",
      transactionId: "rule-manual-same-t0",
      transactionDate: EDITED,
      ruleId: "rule-manual-same",
      payload: editPayload(EDITED, { requiresManualConfirmation: false }),
    })

    expect(rowsOf("rule-manual-same").map((r) => r.manual)).toEqual([0, 1, 1])
  })

  it("copies the manual-confirmation flag when the user changed it", async () => {
    seedRule("rule-manual-changed")

    await applyRecurringEditScope({
      scope: "this_and_future",
      transactionId: "rule-manual-changed-t0",
      transactionDate: EDITED,
      ruleId: "rule-manual-changed",
      payload: editPayload(EDITED, { requiresManualConfirmation: true }),
    })

    expect(rowsOf("rule-manual-changed").map((r) => r.manual)).toEqual([
      1, 1, 1,
    ])
  })
})
