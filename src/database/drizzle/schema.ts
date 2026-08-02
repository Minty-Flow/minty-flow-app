import { sql } from "drizzle-orm"
import {
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

const safeIntegerCheck = (column: { name: string }) =>
  sql.raw(
    `typeof(${column.name}) = 'integer' AND ${column.name} BETWEEN -9007199254740991 AND 9007199254740991`,
  )

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    icon: text("icon"),
    colorSchemeName: text("color_scheme_name"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check("categories_type_check", sql`${table.type} IN ('expense', 'income')`),
  ],
)

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    balance: integer("balance").notNull().default(0),
    currencyCode: text("currency_code").notNull(),
    icon: text("icon"),
    colorSchemeName: text("color_scheme_name"),
    isPrimary: integer("is_primary").notNull().default(0).$type<0 | 1>(),
    excludeFromBalance: integer("exclude_from_balance")
      .notNull()
      .default(0)
      .$type<0 | 1>(),
    isArchived: integer("is_archived").notNull().default(0).$type<0 | 1>(),
    sortOrder: real("sort_order"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "accounts_type_check",
      sql`${table.type} IN ('checking', 'savings', 'credit', 'investment', 'other')`,
    ),
    check("accounts_balance_check", safeIntegerCheck(table.balance)),
    check("accounts_is_primary_check", sql`${table.isPrimary} IN (0, 1)`),
    check(
      "accounts_exclude_from_balance_check",
      sql`${table.excludeFromBalance} IN (0, 1)`,
    ),
    check("accounts_is_archived_check", sql`${table.isArchived} IN (0, 1)`),
    uniqueIndex("idx_accounts_only_one_primary")
      .on(table.isPrimary)
      .where(sql`${table.isPrimary} = 1`),
  ],
)

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey().notNull(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    amount: integer("amount").notNull(),
    type: text("type").notNull(),
    transactionDate: text("transaction_date").notNull(),
    title: text("title"),
    description: text("description"),
    isDeleted: integer("is_deleted").notNull().default(0).$type<0 | 1>(),
    deletedAt: text("deleted_at"),
    isPending: integer("is_pending").notNull().default(0).$type<0 | 1>(),
    requiresManualConfirmation: integer("requires_manual_confirmation")
      .notNull()
      .default(0)
      .$type<0 | 1>(),
    accountBalanceBefore: integer("account_balance_before")
      .notNull()
      .default(0),
    subtype: text("subtype"),
    extra: text("extra"),
    hasAttachments: integer("has_attachments")
      .notNull()
      .default(0)
      .$type<0 | 1>(),
    recurringId: text("recurring_id").references(
      () => recurringTransactions.id,
      {
        onDelete: "set null",
      },
    ),
    location: text("location"),
    goalId: text("goal_id").references(() => goals.id, {
      onDelete: "set null",
    }),
    budgetId: text("budget_id").references(() => budgets.id, {
      onDelete: "set null",
    }),
    loanId: text("loan_id").references(() => loans.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "transactions_type_check",
      sql`${table.type} IN ('expense', 'income', 'transfer')`,
    ),
    check("transactions_amount_check", safeIntegerCheck(table.amount)),
    check("transactions_is_deleted_check", sql`${table.isDeleted} IN (0, 1)`),
    check("transactions_is_pending_check", sql`${table.isPending} IN (0, 1)`),
    check(
      "transactions_requires_manual_confirmation_check",
      sql`${table.requiresManualConfirmation} IN (0, 1)`,
    ),
    check(
      "transactions_account_balance_before_check",
      safeIntegerCheck(table.accountBalanceBefore),
    ),
    check(
      "transactions_subtype_check",
      sql`${table.subtype} IS NULL OR ${table.subtype} IN ('recurring', 'one-time', 'refund', 'loan_borrowed', 'loan_repayment', 'loan_lent', 'loan_received')`,
    ),
    check(
      "transactions_has_attachments_check",
      sql`${table.hasAttachments} IN (0, 1)`,
    ),
    index("idx_tx_date").on(table.transactionDate),
    index("idx_tx_account").on(table.accountId),
    index("idx_tx_category").on(table.categoryId),
    index("idx_tx_is_deleted").on(table.isDeleted),
    index("idx_tx_is_pending").on(table.isPending),
    index("idx_tx_type").on(table.type),
    index("idx_tx_goal").on(table.goalId),
    index("idx_tx_budget").on(table.budgetId),
    index("idx_tx_loan").on(table.loanId),
    index("idx_tx_loan_deleted").on(table.loanId, table.isDeleted),
    index("idx_tx_recurring").on(table.recurringId),
    index("idx_tx_date_created").on(table.transactionDate, table.createdAt),
  ],
)

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    colorSchemeName: text("color_scheme_name"),
    icon: text("icon"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "tags_type_check",
      sql`${table.type} IN ('generic', 'location', 'contact')`,
    ),
  ],
)

export const transactionTags = sqliteTable(
  "transaction_tags",
  {
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.transactionId, table.tagId] }),
    index("idx_ttag_tx").on(table.transactionId),
    index("idx_ttag_tag").on(table.tagId),
  ],
)

export const transfers = sqliteTable(
  "transfers",
  {
    id: text("id").primaryKey().notNull(),
    fromTransactionId: text("from_transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    toTransactionId: text("to_transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    fromAccountId: text("from_account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    toAccountId: text("to_account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    conversionRate: real("conversion_rate").notNull().default(1),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    unique().on(table.fromTransactionId),
    unique().on(table.toTransactionId),
    index("idx_transfer_from_tx").on(table.fromTransactionId),
    index("idx_transfer_to_tx").on(table.toTransactionId),
  ],
)

export const goals = sqliteTable(
  "goals",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    targetAmount: integer("target_amount").notNull(),
    currencyCode: text("currency_code").notNull(),
    targetDate: text("target_date"),
    icon: text("icon"),
    colorSchemeName: text("color_scheme_name"),
    goalType: text("goal_type").notNull(),
    isArchived: integer("is_archived").notNull().default(0).$type<0 | 1>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check("goals_target_amount_check", safeIntegerCheck(table.targetAmount)),
    check(
      "goals_goal_type_check",
      sql`${table.goalType} IN ('savings', 'expense')`,
    ),
    check("goals_is_archived_check", sql`${table.isArchived} IN (0, 1)`),
  ],
)

export const goalAccounts = sqliteTable(
  "goal_accounts",
  {
    goalId: text("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.goalId, table.accountId] }),
    index("idx_ga_goal").on(table.goalId),
    index("idx_ga_account").on(table.accountId),
  ],
)

export const loans = sqliteTable(
  "loans",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    principalAmount: integer("principal_amount").notNull(),
    loanType: text("loan_type").notNull(),
    dueDate: text("due_date"),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "set null" }),
    icon: text("icon"),
    colorSchemeName: text("color_scheme_name"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "loans_principal_amount_check",
      safeIntegerCheck(table.principalAmount),
    ),
    check(
      "loans_loan_type_check",
      sql`${table.loanType} IN ('lent', 'borrowed')`,
    ),
    index("idx_loan_account").on(table.accountId),
    index("idx_loan_category").on(table.categoryId),
  ],
)

export const recurringTransactions = sqliteTable(
  "recurring_transactions",
  {
    id: text("id").primaryKey().notNull(),
    jsonTransactionTemplate: text("json_transaction_template").notNull(),
    transferToAccountId: text("transfer_to_account_id").references(
      () => accounts.id,
      { onDelete: "set null" },
    ),
    range: text("range").notNull(),
    rules: text("rules").notNull(),
    lastGeneratedTransactionDate: text("last_generated_transaction_date"),
    disabled: integer("disabled").notNull().default(0).$type<0 | 1>(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    check("recurring_disabled_check", sql`${table.disabled} IN (0, 1)`),
  ],
)

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    amount: integer("amount").notNull(),
    currencyCode: text("currency_code").notNull(),
    period: text("period").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
    alertThreshold: real("alert_threshold"),
    isActive: integer("is_active").notNull().default(1).$type<0 | 1>(),
    icon: text("icon"),
    colorSchemeName: text("color_scheme_name"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check("budgets_amount_check", safeIntegerCheck(table.amount)),
    check(
      "budgets_period_check",
      sql`${table.period} IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')`,
    ),
    check(
      "budgets_alert_threshold_check",
      sql`${table.alertThreshold} IS NULL OR (${table.alertThreshold} >= 0 AND ${table.alertThreshold} <= 100)`,
    ),
    check("budgets_is_active_check", sql`${table.isActive} IN (0, 1)`),
  ],
)

export const budgetAccounts = sqliteTable(
  "budget_accounts",
  {
    budgetId: text("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.budgetId, table.accountId] }),
    index("idx_ba_budget").on(table.budgetId),
    index("idx_ba_account").on(table.accountId),
  ],
)

export const budgetCategories = sqliteTable(
  "budget_categories",
  {
    budgetId: text("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.budgetId, table.categoryId] }),
    index("idx_bc_budget").on(table.budgetId),
    index("idx_bc_category").on(table.categoryId),
  ],
)
