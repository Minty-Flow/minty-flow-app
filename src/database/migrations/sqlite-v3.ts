import type { SQLiteBindParams, SQLiteDatabase } from "expo-sqlite"

import { currencyRegistryService } from "~/services/currency-registry"
import { majorNumberToMinorUnits } from "~/utils/money"

export const SQLITE_V3_VERSION = 3

// MIGRATION RETIREMENT: keep this file and its runner registration until every
// supported release has already upgraded user_version to 3. Before deleting it,
// raise the app's minimum supported database version and retain the v3 schema
// definition (or replace it with a current-schema bootstrap) for fresh installs.

type RawRow = Record<string, string | number | null>

const TABLES = [
  "accounts",
  "budgets",
  "goals",
  "loans",
  "transactions",
] as const

const CREATE_TABLES_SQL = `
  CREATE TABLE accounts (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment', 'other')),
    balance INTEGER NOT NULL DEFAULT 0
      CHECK(typeof(balance) = 'integer' AND balance BETWEEN -9007199254740991 AND 9007199254740991),
    currency_code TEXT NOT NULL,
    icon TEXT,
    color_scheme_name TEXT,
    is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
    exclude_from_balance INTEGER NOT NULL DEFAULT 0 CHECK (exclude_from_balance IN (0, 1)),
    is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
    sort_order REAL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE budgets (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL
      CHECK(typeof(amount) = 'integer' AND amount BETWEEN -9007199254740991 AND 9007199254740991),
    currency_code TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    alert_threshold REAL CHECK (alert_threshold IS NULL OR (alert_threshold >= 0 AND alert_threshold <= 100)),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    icon TEXT,
    color_scheme_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE goals (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    target_amount INTEGER NOT NULL
      CHECK(typeof(target_amount) = 'integer' AND target_amount BETWEEN -9007199254740991 AND 9007199254740991),
    currency_code TEXT NOT NULL,
    target_date TEXT,
    icon TEXT,
    color_scheme_name TEXT,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('savings', 'expense')),
    is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE loans (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    principal_amount INTEGER NOT NULL
      CHECK(typeof(principal_amount) = 'integer' AND principal_amount BETWEEN -9007199254740991 AND 9007199254740991),
    loan_type TEXT NOT NULL CHECK (loan_type IN ('LENT', 'BORROWED')),
    due_date TEXT,
    account_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    icon TEXT,
    color_scheme_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE TABLE transactions (
    id TEXT PRIMARY KEY NOT NULL,
    account_id TEXT NOT NULL,
    category_id TEXT,
    amount INTEGER NOT NULL
      CHECK(typeof(amount) = 'integer' AND amount BETWEEN -9007199254740991 AND 9007199254740991),
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
    transaction_date TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_deleted INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
    deleted_at TEXT,
    is_pending INTEGER NOT NULL DEFAULT 0 CHECK (is_pending IN (0, 1)),
    requires_manual_confirmation INTEGER NOT NULL DEFAULT 0 CHECK (requires_manual_confirmation IN (0, 1)),
    account_balance_before INTEGER NOT NULL DEFAULT 0
      CHECK(typeof(account_balance_before) = 'integer' AND account_balance_before BETWEEN -9007199254740991 AND 9007199254740991),
    subtype TEXT CHECK (subtype IS NULL OR subtype IN ('recurring', 'one-time', 'refund', 'loan_borrowed', 'loan_repayment', 'loan_lent', 'loan_received')),
    extra TEXT,
    has_attachments INTEGER NOT NULL DEFAULT 0 CHECK (has_attachments IN (0, 1)),
    recurring_id TEXT,
    location TEXT,
    goal_id TEXT,
    budget_id TEXT,
    loan_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE SET NULL,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE SET NULL,
    FOREIGN KEY (recurring_id) REFERENCES recurring_transactions(id) ON DELETE SET NULL
  );
`

const CREATE_INDEXES_SQL = `
  CREATE UNIQUE INDEX idx_accounts_only_one_primary ON accounts(is_primary) WHERE is_primary = 1;
  CREATE INDEX idx_loan_account ON loans(account_id);
  CREATE INDEX idx_loan_category ON loans(category_id);
  CREATE INDEX idx_tx_date ON transactions(transaction_date);
  CREATE INDEX idx_tx_account ON transactions(account_id);
  CREATE INDEX idx_tx_category ON transactions(category_id);
  CREATE INDEX idx_tx_is_deleted ON transactions(is_deleted);
  CREATE INDEX idx_tx_is_pending ON transactions(is_pending);
  CREATE INDEX idx_tx_type ON transactions(type);
  CREATE INDEX idx_tx_goal ON transactions(goal_id);
  CREATE INDEX idx_tx_budget ON transactions(budget_id);
  CREATE INDEX idx_tx_loan ON transactions(loan_id);
  CREATE INDEX idx_tx_loan_deleted ON transactions(loan_id, is_deleted);
  CREATE INDEX idx_tx_recurring ON transactions(recurring_id);
  CREATE INDEX idx_tx_date_created ON transactions(transaction_date ASC, created_at ASC);
`

function tableExists(db: SQLiteDatabase, name: string): boolean {
  return (
    db.getFirstSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      [name],
    ) !== null
  )
}

export function assertSqliteV3State(db: SQLiteDatabase): void {
  for (const table of TABLES) {
    if (!tableExists(db, table) || tableExists(db, `${table}_v2`)) {
      throw new Error(`Migration v3: unexpected table state for ${table}`)
    }
  }
}

function requireLegacyMoney(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Migration v3: invalid ${label}`)
  }
  return value
}

function preflightLegacyMoney(
  value: unknown,
  currency: string,
  label: string,
): void {
  majorNumberToMinorUnits(requireLegacyMoney(value, label), currency)
}

function insertRow(db: SQLiteDatabase, table: string, row: RawRow): void {
  const columns = Object.keys(row)
  const placeholders = columns.map(() => "?").join(", ")
  db.runSync(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
    Object.values(row) as SQLiteBindParams,
  )
}

function assertKnownCurrency(code: unknown, label: string): string {
  if (
    typeof code !== "string" ||
    !currencyRegistryService.isCurrencyCodeValid(code)
  ) {
    throw new Error(`Migration v3: unknown currency for ${label}: ${code}`)
  }
  currencyRegistryService.getCurrencyMinorUnits(code)
  return code
}

function verifyCounts(
  db: SQLiteDatabase,
  expected: Record<string, number>,
): void {
  for (const table of TABLES) {
    const count =
      db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) AS count FROM ${table}`,
      )?.count ?? -1
    if (count !== expected[table]) {
      throw new Error(
        `Migration v3: ${table} row count mismatch (${count}/${expected[table]})`,
      )
    }
  }
}

export function runSqliteV3Migration(db: SQLiteDatabase): void {
  assertSqliteV3State(db)
  const balanceColumn = db
    .getAllSync<{ name: string; type: string }>("PRAGMA table_info(accounts)")
    .find((column) => column.name === "balance")
  if (balanceColumn?.type.toUpperCase() === "INTEGER") {
    throw new Error("Migration v3: integer schema exists before version marker")
  }

  const accounts = db.getAllSync<RawRow>("SELECT * FROM accounts")
  const accountCurrencies = new Map<string, string>()
  for (const row of accounts) {
    const id = String(row.id)
    accountCurrencies.set(
      id,
      assertKnownCurrency(row.currency_code, `account ${id}`),
    )
    preflightLegacyMoney(
      row.balance,
      accountCurrencies.get(id) as string,
      `account ${id} balance`,
    )
  }

  const budgets = db.getAllSync<RawRow>("SELECT * FROM budgets")
  for (const row of budgets) {
    const currency = assertKnownCurrency(row.currency_code, `budget ${row.id}`)
    preflightLegacyMoney(row.amount, currency, `budget ${row.id} amount`)
  }

  const goals = db.getAllSync<RawRow>("SELECT * FROM goals")
  for (const row of goals) {
    const currency = assertKnownCurrency(row.currency_code, `goal ${row.id}`)
    preflightLegacyMoney(row.target_amount, currency, `goal ${row.id} target`)
  }

  const loans = db.getAllSync<RawRow>("SELECT * FROM loans")
  for (const row of loans) {
    if (!accountCurrencies.has(String(row.account_id))) {
      throw new Error(`Migration v3: loan ${row.id} has no valid account`)
    }
    preflightLegacyMoney(
      row.principal_amount,
      accountCurrencies.get(String(row.account_id)) as string,
      `loan ${row.id} principal`,
    )
  }

  const transactions = db.getAllSync<RawRow>("SELECT * FROM transactions")
  for (const row of transactions) {
    if (!accountCurrencies.has(String(row.account_id))) {
      throw new Error(
        `Migration v3: transaction ${row.id} has no valid account`,
      )
    }
    const currency = accountCurrencies.get(String(row.account_id)) as string
    preflightLegacyMoney(row.amount, currency, `transaction ${row.id} amount`)
    preflightLegacyMoney(
      row.account_balance_before,
      currency,
      `transaction ${row.id} balance snapshot`,
    )
  }

  const recurringRows = db.getAllSync<{
    id: string
    json_transaction_template: string
  }>("SELECT id, json_transaction_template FROM recurring_transactions")
  const recurringJson = new Map<string, string>()
  for (const row of recurringRows) {
    const template = JSON.parse(row.json_transaction_template) as {
      amount?: unknown
      accountId?: unknown
    }
    const accountId = String(template.accountId ?? "")
    const currency = accountCurrencies.get(accountId)
    if (!currency) {
      throw new Error(
        `Migration v3: recurring rule ${row.id} has no valid account`,
      )
    }
    template.amount = majorNumberToMinorUnits(
      requireLegacyMoney(template.amount, `recurring rule ${row.id} amount`),
      currency,
    )
    recurringJson.set(row.id, JSON.stringify(template))
  }

  const expected = {
    accounts: accounts.length,
    budgets: budgets.length,
    goals: goals.length,
    loans: loans.length,
    transactions: transactions.length,
  }

  db.execSync("PRAGMA foreign_keys=OFF; PRAGMA legacy_alter_table=ON;")
  try {
    db.execSync("BEGIN IMMEDIATE;")
    for (const table of TABLES) {
      db.execSync(`ALTER TABLE ${table} RENAME TO ${table}_v2;`)
    }
    db.execSync(CREATE_TABLES_SQL)

    for (const row of accounts) {
      const currency = accountCurrencies.get(String(row.id))
      if (!currency) throw new Error(`Migration v3: account ${row.id} missing`)
      insertRow(db, "accounts", {
        ...row,
        balance: majorNumberToMinorUnits(Number(row.balance), currency),
      })
    }
    for (const row of budgets) {
      const currency = String(row.currency_code)
      insertRow(db, "budgets", {
        ...row,
        amount: majorNumberToMinorUnits(Number(row.amount), currency),
      })
    }
    for (const row of goals) {
      const currency = String(row.currency_code)
      insertRow(db, "goals", {
        ...row,
        target_amount: majorNumberToMinorUnits(
          Number(row.target_amount),
          currency,
        ),
      })
    }
    for (const row of loans) {
      const currency = accountCurrencies.get(String(row.account_id))
      if (!currency) throw new Error(`Migration v3: loan ${row.id} missing`)
      insertRow(db, "loans", {
        ...row,
        principal_amount: majorNumberToMinorUnits(
          Number(row.principal_amount),
          currency,
        ),
      })
    }
    for (const row of transactions) {
      const currency = accountCurrencies.get(String(row.account_id))
      if (!currency) {
        throw new Error(`Migration v3: transaction ${row.id} missing`)
      }
      insertRow(db, "transactions", {
        ...row,
        amount: majorNumberToMinorUnits(Number(row.amount), currency),
        account_balance_before: majorNumberToMinorUnits(
          Number(row.account_balance_before),
          currency,
        ),
      })
    }
    for (const [id, json] of recurringJson) {
      db.runSync(
        "UPDATE recurring_transactions SET json_transaction_template = ? WHERE id = ?",
        [json, id],
      )
    }

    verifyCounts(db, expected)
    for (const table of [...TABLES].reverse()) {
      db.execSync(`DROP TABLE ${table}_v2;`)
    }
    db.execSync(CREATE_INDEXES_SQL)

    const invalidMoney = db.getFirstSync<{ invalid: number }>(`
      SELECT
        (SELECT COUNT(*) FROM accounts WHERE typeof(balance) != 'integer') +
        (SELECT COUNT(*) FROM budgets WHERE typeof(amount) != 'integer') +
        (SELECT COUNT(*) FROM goals WHERE typeof(target_amount) != 'integer') +
        (SELECT COUNT(*) FROM loans WHERE typeof(principal_amount) != 'integer') +
        (SELECT COUNT(*) FROM transactions
          WHERE typeof(amount) != 'integer'
             OR typeof(account_balance_before) != 'integer') AS invalid
    `)
    if ((invalidMoney?.invalid ?? 1) !== 0) {
      throw new Error("Migration v3: non-integer money remained")
    }

    const fkErrors = db.getAllSync("PRAGMA foreign_key_check")
    if (fkErrors.length > 0) {
      throw new Error("Migration v3: foreign-key check failed")
    }
    db.execSync(`PRAGMA user_version = ${SQLITE_V3_VERSION}; COMMIT;`)
  } catch (error) {
    try {
      db.execSync("ROLLBACK;")
    } catch {
      // No active transaction means SQLite already rolled it back.
    }
    throw error
  } finally {
    db.execSync("PRAGMA legacy_alter_table=OFF; PRAGMA foreign_keys=ON;")
  }
}
