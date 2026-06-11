export const SQLITE_V1_SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id                 TEXT PRIMARY KEY NOT NULL,
    name               TEXT NOT NULL,
    type               TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    icon               TEXT,
    color_scheme_name  TEXT,
    transaction_count  INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    created_at         TEXT NOT NULL,
    updated_at         TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id                   TEXT PRIMARY KEY NOT NULL,
    name                 TEXT NOT NULL,
    type                 TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment', 'other')),
    balance              REAL NOT NULL DEFAULT 0,
    currency_code        TEXT NOT NULL,
    icon                 TEXT,
    color_scheme_name    TEXT,
    is_primary           INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
    exclude_from_balance INTEGER NOT NULL DEFAULT 0 CHECK (exclude_from_balance IN (0, 1)),
    is_archived          INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
    sort_order           REAL,
    created_at           TEXT NOT NULL,
    updated_at           TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_only_one_primary
    ON accounts(is_primary) WHERE is_primary = 1;

  CREATE TABLE IF NOT EXISTS transactions (
    id                           TEXT PRIMARY KEY NOT NULL,
    account_id                   TEXT NOT NULL,
    category_id                  TEXT,
    amount                       REAL NOT NULL,
    type                         TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
    transaction_date             TEXT NOT NULL,
    title                        TEXT,
    description                  TEXT,
    is_deleted                   INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
    deleted_at                   TEXT,
    is_pending                   INTEGER NOT NULL DEFAULT 0 CHECK (is_pending IN (0, 1)),
    requires_manual_confirmation INTEGER NOT NULL DEFAULT 0 CHECK (requires_manual_confirmation IN (0, 1)),
    account_balance_before       REAL NOT NULL DEFAULT 0,
    subtype                      TEXT CHECK (subtype IS NULL OR subtype IN ('recurring', 'one-time', 'refund', 'loan_borrowed', 'loan_repayment', 'loan_lent', 'loan_received')),
    extra                        TEXT,
    has_attachments              INTEGER NOT NULL DEFAULT 0 CHECK (has_attachments IN (0, 1)),
    recurring_id                 TEXT,
    location                     TEXT,
    goal_id                      TEXT,
    budget_id                    TEXT,
    loan_id                      TEXT,
    created_at                   TEXT NOT NULL,
    updated_at                   TEXT NOT NULL,
    FOREIGN KEY (account_id)   REFERENCES accounts(id)               ON DELETE RESTRICT,
    FOREIGN KEY (category_id)  REFERENCES categories(id)             ON DELETE SET NULL,
    FOREIGN KEY (budget_id)    REFERENCES budgets(id)                ON DELETE SET NULL,
    FOREIGN KEY (goal_id)      REFERENCES goals(id)                  ON DELETE SET NULL,
    FOREIGN KEY (loan_id)      REFERENCES loans(id)                  ON DELETE SET NULL,
    FOREIGN KEY (recurring_id) REFERENCES recurring_transactions(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tx_date         ON transactions(transaction_date);
  CREATE INDEX IF NOT EXISTS idx_tx_account      ON transactions(account_id);
  CREATE INDEX IF NOT EXISTS idx_tx_category     ON transactions(category_id);
  CREATE INDEX IF NOT EXISTS idx_tx_is_deleted   ON transactions(is_deleted);
  CREATE INDEX IF NOT EXISTS idx_tx_is_pending   ON transactions(is_pending);
  CREATE INDEX IF NOT EXISTS idx_tx_type         ON transactions(type);
  CREATE INDEX IF NOT EXISTS idx_tx_goal         ON transactions(goal_id);
  CREATE INDEX IF NOT EXISTS idx_tx_budget       ON transactions(budget_id);
  CREATE INDEX IF NOT EXISTS idx_tx_loan         ON transactions(loan_id);
  CREATE INDEX IF NOT EXISTS idx_tx_loan_deleted ON transactions(loan_id, is_deleted);
  CREATE INDEX IF NOT EXISTS idx_tx_recurring    ON transactions(recurring_id);
  CREATE INDEX IF NOT EXISTS idx_tx_date_created ON transactions(transaction_date ASC, created_at ASC);

  CREATE TABLE IF NOT EXISTS tags (
    id                TEXT PRIMARY KEY NOT NULL,
    name              TEXT NOT NULL,
    type              TEXT NOT NULL CHECK (type IN ('generic', 'location', 'contact')),
    color_scheme_name TEXT,
    icon              TEXT,
    transaction_count INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transaction_tags (
    transaction_id TEXT NOT NULL,
    tag_id         TEXT NOT NULL,
    PRIMARY KEY (transaction_id, tag_id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)         REFERENCES tags(id)         ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_ttag_tx  ON transaction_tags(transaction_id);
  CREATE INDEX IF NOT EXISTS idx_ttag_tag ON transaction_tags(tag_id);

  CREATE TABLE IF NOT EXISTS transfers (
    id                  TEXT PRIMARY KEY NOT NULL,
    from_transaction_id TEXT NOT NULL UNIQUE,
    to_transaction_id   TEXT NOT NULL UNIQUE,
    from_account_id     TEXT NOT NULL,
    to_account_id       TEXT NOT NULL,
    conversion_rate     REAL NOT NULL DEFAULT 1,
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    FOREIGN KEY (from_transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (to_transaction_id)   REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (from_account_id)     REFERENCES accounts(id)     ON DELETE RESTRICT,
    FOREIGN KEY (to_account_id)       REFERENCES accounts(id)     ON DELETE RESTRICT
  );

  CREATE INDEX IF NOT EXISTS idx_transfer_from_tx ON transfers(from_transaction_id);
  CREATE INDEX IF NOT EXISTS idx_transfer_to_tx   ON transfers(to_transaction_id);

  CREATE TABLE IF NOT EXISTS goals (
    id                TEXT PRIMARY KEY NOT NULL,
    name              TEXT NOT NULL,
    description       TEXT,
    target_amount     REAL NOT NULL,
    currency_code     TEXT NOT NULL,
    target_date       TEXT,
    icon              TEXT,
    color_scheme_name TEXT,
    goal_type         TEXT NOT NULL CHECK (goal_type IN ('savings', 'expense')),
    is_archived       INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1)),
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS goal_accounts (
    goal_id    TEXT NOT NULL,
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (goal_id, account_id),
    FOREIGN KEY (goal_id)    REFERENCES goals(id)    ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT
  );

  CREATE INDEX IF NOT EXISTS idx_ga_goal    ON goal_accounts(goal_id);
  CREATE INDEX IF NOT EXISTS idx_ga_account ON goal_accounts(account_id);

  CREATE TABLE IF NOT EXISTS loans (
    id                TEXT PRIMARY KEY NOT NULL,
    name              TEXT NOT NULL,
    description       TEXT,
    principal_amount  REAL NOT NULL,
    loan_type         TEXT NOT NULL CHECK (loan_type IN ('LENT', 'BORROWED')),
    due_date          TEXT,
    account_id        TEXT NOT NULL,
    category_id       TEXT NOT NULL,
    icon              TEXT,
    color_scheme_name TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL,
    FOREIGN KEY (account_id)  REFERENCES accounts(id)   ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_loan_account  ON loans(account_id);
  CREATE INDEX IF NOT EXISTS idx_loan_category ON loans(category_id);

  CREATE TABLE IF NOT EXISTS recurring_transactions (
    id                              TEXT PRIMARY KEY NOT NULL,
    json_transaction_template       TEXT NOT NULL,
    transfer_to_account_id          TEXT,
    range                           TEXT NOT NULL,
    rules                           TEXT NOT NULL,
    last_generated_transaction_date TEXT,
    disabled                        INTEGER NOT NULL DEFAULT 0 CHECK (disabled IN (0, 1)),
    created_at                      TEXT NOT NULL,
    FOREIGN KEY (transfer_to_account_id) REFERENCES accounts(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id                TEXT PRIMARY KEY NOT NULL,
    name              TEXT NOT NULL,
    amount            REAL NOT NULL,
    currency_code     TEXT NOT NULL,
    period            TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
    start_date        TEXT NOT NULL,
    end_date          TEXT,
    alert_threshold   REAL CHECK (alert_threshold IS NULL OR (alert_threshold >= 0 AND alert_threshold <= 100)),
    is_active         INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    icon              TEXT,
    color_scheme_name TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budget_accounts (
    budget_id  TEXT NOT NULL,
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (budget_id, account_id),
    FOREIGN KEY (budget_id)  REFERENCES budgets(id)  ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT
  );

  CREATE INDEX IF NOT EXISTS idx_ba_budget  ON budget_accounts(budget_id);
  CREATE INDEX IF NOT EXISTS idx_ba_account ON budget_accounts(account_id);

  CREATE TABLE IF NOT EXISTS budget_categories (
    budget_id   TEXT NOT NULL,
    category_id TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    PRIMARY KEY (budget_id, category_id),
    FOREIGN KEY (budget_id)   REFERENCES budgets(id)    ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_bc_budget   ON budget_categories(budget_id);
  CREATE INDEX IF NOT EXISTS idx_bc_category ON budget_categories(category_id);
`

export const SQLITE_V1_VERSION = 1
