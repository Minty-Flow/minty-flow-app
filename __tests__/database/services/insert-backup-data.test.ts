import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import type { MintyFlowBackup } from "~/database/backup/backup-format"
import { insertBackupData } from "~/database/backup/backup-import-plan"
import { drizzleDb } from "~/database/drizzle/db"
import { accounts, loans, transactions } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"

const ms = Date.parse("2026-01-02T03:04:05.000Z")
const stamps = { created_at: ms, updated_at: "2026-01-02" }

const empty = {
  categories: [],
  tags: [],
  accounts: [],
  recurring_transactions: [],
  budgets: [],
  goals: [],
  loans: [],
  transactions: [],
  transfers: [],
  transaction_tags: [],
  transaction_items: [],
  budget_accounts: [],
  budget_categories: [],
  goal_accounts: [],
} satisfies MintyFlowBackup["data"]

const account = {
  id: "a",
  name: "Cash",
  type: "checking",
  balance: 0,
  currency_code: "USD",
  is_primary: false,
  exclude_from_balance: 0,
  is_archived: 0,
  unknown_column: "dropped",
  ...stamps,
}
const row = (id: string, more: Record<string, unknown> = {}) => ({
  id,
  account_id: "a",
  amount: 5,
  type: "expense",
  transaction_date: ms,
  is_deleted: 0,
  is_pending: false,
  requires_manual_confirmation: 0,
  account_balance_before: 0,
  ...stamps,
  ...more,
})

const insert = (data: MintyFlowBackup["data"]) =>
  runInTransaction("test.insert", (db) => insertBackupData(db, data))

describe("inserting backup data", () => {
  it("rolls every table back when one row fails", async () => {
    await expect(
      insert({
        ...empty,
        accounts: [account],
        transactions: [row("t"), row("t")],
      }),
    ).rejects.toThrow()
    expect(drizzleDb.select().from(accounts).all()).toEqual([])
    expect(drizzleDb.select().from(transactions).all()).toEqual([])
  })

  it("normalizes and derives the values of each row", async () => {
    await insert({
      ...empty,
      accounts: [account],
      categories: [{ id: "c", name: "c", type: "expense", ...stamps }],
      loans: [
        {
          id: "l",
          name: "l",
          principal_amount: 5,
          loan_type: "LENT",
          account_id: "a",
          category_id: "c",
          ...stamps,
        },
      ],
      transactions: [
        row("plain", { extra: JSON.stringify({ attachments: "[{}]" }) }),
        row("loan", { loan_id: "l" }),
      ],
    })

    expect(drizzleDb.select().from(loans).get()).toMatchObject({
      loanType: "lent",
      term: "long_term",
    })
    expect(drizzleDb.select().from(accounts).get()).toMatchObject({
      isPrimary: 0,
      createdAt: "2026-01-02T03:04:05.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      icon: null,
    })
    expect(
      drizzleDb.select().from(transactions).orderBy(transactions.id).all(),
    ).toMatchObject([
      { id: "loan", kind: "lent", hasAttachments: 0, isPending: 0 },
      {
        id: "plain",
        kind: "default",
        hasAttachments: 1,
        transactionDate: "2026-01-02T03:04:05.000Z",
      },
    ])
  })
})
