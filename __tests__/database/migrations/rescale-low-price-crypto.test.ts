import { createTestDb } from "@tests/helpers/create-test-db"
import { sql } from "drizzle-orm"
import { describe, expect, it } from "vitest"

import { upgradeBackupData } from "~/database/backup/upgrade-backup-data"

import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const DRIZZLE = fileURLToPath(new URL("../../../drizzle", import.meta.url))
const MIGRATION = readdirSync(DRIZZLE).find((f) =>
  f.startsWith("0007_rescale_low_price_crypto"),
)
const now = "2026-01-01T00:00:00.000Z"

/** 1,500,000.5 PEPE at the old 8 digits, and what it becomes at 2. */
const OLD = 150_000_050_000_000
const NEW = 150_000_050

describe("migration 0007", () => {
  it("rescales PEPE/SHIB amounts to 2 digits and leaves other currencies alone", async () => {
    // Every migration has run (0007 on an empty database). Seed rows at the
    // old 8-digit scale and run 0007's statements again to see what it does.
    const db = await createTestDb()
    const run = (statement: string) => db.run(sql.raw(statement))
    run(
      `INSERT INTO categories (id, name, type, created_at, updated_at) VALUES ('c', 'c', 'expense', '${now}', '${now}')`,
    )
    for (const [id, code, balance] of [
      ["pepe", "PEPE", OLD],
      ["btc", "BTC", OLD],
    ] as const) {
      run(
        `INSERT INTO accounts (id, name, type, balance, currency_code, created_at, updated_at) VALUES ('${id}', '${id}', 'other', ${balance}, '${code}', '${now}', '${now}')`,
      )
      run(
        `INSERT INTO transactions (id, account_id, amount, type, kind, transaction_date, account_balance_before, created_at, updated_at) VALUES ('t-${id}', '${id}', ${OLD}, 'expense', 'default', '${now}', ${OLD}, '${now}', '${now}')`,
      )
      run(
        `INSERT INTO transaction_items (id, transaction_id, name, unit_price) VALUES ('i-${id}', 't-${id}', 'x', ${OLD})`,
      )
      run(
        `INSERT INTO budgets (id, name, amount, currency_code, period, start_date, created_at, updated_at) VALUES ('b-${id}', 'b', ${OLD}, '${code}', 'monthly', '${now}', '${now}', '${now}')`,
      )
      run(
        `INSERT INTO goals (id, name, target_amount, currency_code, goal_type, created_at, updated_at) VALUES ('g-${id}', 'g', ${OLD}, '${code}', 'savings', '${now}', '${now}')`,
      )
      run(
        `INSERT INTO loans (id, name, principal_amount, loan_type, account_id, category_id, created_at, updated_at) VALUES ('l-${id}', 'l', ${OLD}, 'lent', '${id}', 'c', '${now}', '${now}')`,
      )
      run(
        `INSERT INTO recurring_transactions (id, json_transaction_template, range, rules, created_at) VALUES ('r-${id}', '{"accountId":"${id}","amount":${OLD}}', '{}', '[]', '${now}')`,
      )
    }

    const file = readFileSync(`${DRIZZLE}/${MIGRATION}`, "utf8")
    for (const statement of file.split("--> statement-breakpoint"))
      run(statement)

    const one = (query: string) =>
      Object.values(db.get<Record<string, number>>(sql.raw(query)) ?? {})
    for (const [id, expected] of [
      ["pepe", NEW],
      ["btc", OLD],
    ] as const) {
      expect(one(`SELECT balance FROM accounts WHERE id = '${id}'`)).toEqual([
        expected,
      ])
      expect(
        one(
          `SELECT amount, account_balance_before FROM transactions WHERE id = 't-${id}'`,
        ),
      ).toEqual([expected, expected])
      expect(
        one(`SELECT unit_price FROM transaction_items WHERE id = 'i-${id}'`),
      ).toEqual([expected])
      expect(one(`SELECT amount FROM budgets WHERE id = 'b-${id}'`)).toEqual([
        expected,
      ])
      expect(
        one(`SELECT target_amount FROM goals WHERE id = 'g-${id}'`),
      ).toEqual([expected])
      expect(
        one(`SELECT principal_amount FROM loans WHERE id = 'l-${id}'`),
      ).toEqual([expected])
      expect(
        one(
          `SELECT json_extract(json_transaction_template, '$.amount') FROM recurring_transactions WHERE id = 'r-${id}'`,
        ),
      ).toEqual([expected])
    }
  })
})

describe("upgradeBackupData", () => {
  const v7Data = () => ({
    accounts: [
      { id: "pepe", currency_code: "PEPE", balance: OLD },
      { id: "btc", currency_code: "BTC", balance: OLD },
    ],
    transactions: [
      {
        id: "t1",
        account_id: "pepe",
        amount: -OLD,
        account_balance_before: OLD,
      },
      { id: "t2", account_id: "btc", amount: OLD, account_balance_before: OLD },
    ],
    transaction_items: [{ transaction_id: "t1", unit_price: OLD }],
    budgets: [{ currency_code: "SHIB", amount: OLD }],
    goals: [{ currency_code: "PEPE", target_amount: OLD }],
    loans: [{ account_id: "pepe", principal_amount: OLD }],
    recurring_transactions: [
      {
        json_transaction_template: JSON.stringify({
          accountId: "pepe",
          amount: OLD,
        }),
      },
    ],
  })

  it("rescales PEPE/SHIB rows of a pre-v8 backup like migration 0007", () => {
    const data: Record<string, unknown> = v7Data()
    upgradeBackupData(7, data)
    expect(data).toMatchObject({
      accounts: [{ balance: NEW }, { balance: OLD }],
      transactions: [
        { amount: -NEW, account_balance_before: NEW },
        { amount: OLD, account_balance_before: OLD },
      ],
      transaction_items: [{ unit_price: NEW }],
      budgets: [{ amount: NEW }],
      goals: [{ target_amount: NEW }],
      loans: [{ principal_amount: NEW }],
    })
    const rule = (
      data.recurring_transactions as { json_transaction_template: string }[]
    )[0]
    expect(JSON.parse(rule.json_transaction_template).amount).toBe(NEW)
  })

  it("rounds half away from zero, like SQLite ROUND in the migration", async () => {
    const data: Record<string, unknown> = {
      accounts: [{ id: "p", currency_code: "PEPE", balance: 1_500_000 }],
      transactions: [{ id: "t", account_id: "p", amount: -1_500_000 }],
    }
    upgradeBackupData(7, data)
    expect(data).toMatchObject({
      accounts: [{ balance: 2 }],
      transactions: [{ amount: -2 }],
    })

    const db = await createTestDb()
    expect(
      db.get(
        sql.raw(
          "SELECT CAST(ROUND(1500000 / 1000000.0) AS INTEGER) AS up, CAST(ROUND(-1500000 / 1000000.0) AS INTEGER) AS down",
        ),
      ),
    ).toEqual({ up: 2, down: -2 })
  })

  it("leaves a v8 backup alone and gives a pre-v7 one an empty items table", () => {
    const current: Record<string, unknown> = v7Data()
    upgradeBackupData(8, current)
    expect(current).toEqual(v7Data())

    const v6: Record<string, unknown> = { accounts: [] }
    upgradeBackupData(6, v6)
    expect(v6.transaction_items).toEqual([])
  })
})
