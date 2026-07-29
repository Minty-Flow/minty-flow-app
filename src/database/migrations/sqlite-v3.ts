import type { SQLiteDatabase } from "expo-sqlite"

export const SQLITE_V3_VERSION = 3

export const SQLITE_V3_SQL = `
  CREATE TABLE categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    icon TEXT,
    color_scheme_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

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

  CREATE TABLE tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('generic', 'location', 'contact')),
    color_scheme_name TEXT,
    icon TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE transaction_tags (
    transaction_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (transaction_id, tag_id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE transfers (
    id TEXT PRIMARY KEY NOT NULL,
    from_transaction_id TEXT NOT NULL UNIQUE,
    to_transaction_id TEXT NOT NULL UNIQUE,
    from_account_id TEXT NOT NULL,
    to_account_id TEXT NOT NULL,
    conversion_rate REAL NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (from_transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (to_transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
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

  CREATE TABLE goal_accounts (
    goal_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (goal_id, account_id),
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT
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

  CREATE TABLE recurring_transactions (
    id TEXT PRIMARY KEY NOT NULL,
    json_transaction_template TEXT NOT NULL,
    transfer_to_account_id TEXT,
    range TEXT NOT NULL,
    rules TEXT NOT NULL,
    last_generated_transaction_date TEXT,
    disabled INTEGER NOT NULL DEFAULT 0 CHECK (disabled IN (0, 1)),
    created_at TEXT NOT NULL,
    FOREIGN KEY (transfer_to_account_id) REFERENCES accounts(id) ON DELETE SET NULL
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

  CREATE TABLE budget_accounts (
    budget_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (budget_id, account_id),
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT
  );

  CREATE TABLE budget_categories (
    budget_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (budget_id, category_id),
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX idx_accounts_only_one_primary ON accounts(is_primary) WHERE is_primary = 1;
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
  CREATE INDEX idx_ttag_tx ON transaction_tags(transaction_id);
  CREATE INDEX idx_ttag_tag ON transaction_tags(tag_id);
  CREATE INDEX idx_transfer_from_tx ON transfers(from_transaction_id);
  CREATE INDEX idx_transfer_to_tx ON transfers(to_transaction_id);
  CREATE INDEX idx_ga_goal ON goal_accounts(goal_id);
  CREATE INDEX idx_ga_account ON goal_accounts(account_id);
  CREATE INDEX idx_loan_account ON loans(account_id);
  CREATE INDEX idx_loan_category ON loans(category_id);
  CREATE INDEX idx_ba_budget ON budget_accounts(budget_id);
  CREATE INDEX idx_ba_account ON budget_accounts(account_id);
  CREATE INDEX idx_bc_budget ON budget_categories(budget_id);
  CREATE INDEX idx_bc_category ON budget_categories(category_id);
`

const REQUIRED_TABLES = [
  "categories",
  "accounts",
  "transactions",
  "tags",
  "transaction_tags",
  "transfers",
  "goals",
  "goal_accounts",
  "loans",
  "recurring_transactions",
  "budgets",
  "budget_accounts",
  "budget_categories",
] as const

function tableExists(db: SQLiteDatabase, name: string): boolean {
  return (
    db.getFirstSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      [name],
    ) !== null
  )
}

export function bootstrapSqliteV3(db: SQLiteDatabase): void {
  db.execSync(
    `BEGIN IMMEDIATE; ${SQLITE_V3_SQL} PRAGMA user_version = ${SQLITE_V3_VERSION}; COMMIT;`,
  )
}

export function assertSqliteV3State(db: SQLiteDatabase): void {
  for (const table of REQUIRED_TABLES) {
    if (!tableExists(db, table)) {
      throw new Error(`Schema v3: missing table ${table}`)
    }
  }
}
