import { appSchema, tableSchema } from "@nozbe/watermelondb"

/**
 * Database schema definition for WatermelonDB.
 *
 * This schema defines all tables and their columns for the application.
 * Each table represents a collection of models that can be queried and manipulated.
 */
export const schema = appSchema({
  version: 1,
  tables: [
    // Categories table - stores transaction categories
    tableSchema({
      name: "categories",
      columns: [
        { name: "name", type: "string" },
        { name: "type", type: "string" }, // "expense" | "income" | "transfer"
        { name: "icon", type: "string", isOptional: true },
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "transaction_count", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Accounts table - stores user accounts
    tableSchema({
      name: "accounts",
      columns: [
        { name: "name", type: "string" },
        { name: "type", type: "string" }, // e.g., "checking" "savings", "credit"
        { name: "balance", type: "number" },
        { name: "currency_code", type: "string" },
        { name: "icon", type: "string", isOptional: true },
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "is_primary", type: "boolean" },
        { name: "exclude_from_balance", type: "boolean" },
        { name: "is_archived", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "sort_order", type: "number", isOptional: true },
      ],
    }),

    // Transactions table - stores financial transactions
    tableSchema({
      name: "transactions",
      columns: [
        { name: "transaction_date", type: "number", isIndexed: true },
        { name: "is_deleted", type: "boolean" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "title", type: "string", isOptional: true },
        { name: "description", type: "string", isOptional: true },
        { name: "amount", type: "number" },
        { name: "is_pending", type: "boolean", isIndexed: true },
        {
          name: "requires_manual_confirmation",
          type: "boolean",
          isOptional: true,
        },
        // Currency comes from account (account_id); type explains meaning.
        { name: "type", type: "string", isIndexed: true }, // "expense" | "income" | "transfer"
        { name: "is_transfer", type: "boolean" }, // true on BOTH debit and credit rows of a transfer
        {
          name: "transfer_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        }, // shared UUID linking the two halves
        { name: "related_account_id", type: "string", isOptional: true }, // the other account in the transfer
        { name: "account_balance_before", type: "number" }, // balance of account_id BEFORE this tx was applied (snapshot)
        { name: "subtype", type: "string", isOptional: true }, // "recurring" | "one-time" | "subscription" etc.
        { name: "extra", type: "string", isOptional: true }, // JSON for custom metadata
        { name: "has_attachments", type: "boolean", isIndexed: true }, // derived from extra.attachments, kept in sync on write
        // REMOVE extra_tags - use transaction_tags join table instead

        { name: "category_id", type: "string", isIndexed: true },
        { name: "account_id", type: "string", isIndexed: true },
        {
          name: "recurring_id",
          type: "string",
          isIndexed: true,
          isOptional: true,
        },
        { name: "location", type: "string", isOptional: true },
        {
          name: "goal_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        {
          name: "budget_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        {
          name: "loan_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Tags table - stores tags for categorizing transactions
    tableSchema({
      name: "tags",
      columns: [
        { name: "name", type: "string" },
        { name: "type", type: "string" }, // "generic" | "location" | "contact"
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "icon", type: "string", isOptional: true },
        { name: "transaction_count", type: "number" }, // Track how many times tag is used
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Join table for Transactions and Tags
    tableSchema({
      name: "transaction_tags",
      columns: [
        { name: "transaction_id", type: "string", isIndexed: true },
        { name: "tag_id", type: "string", isIndexed: true },
      ],
    }),

    // Transfers table — first-class transfer metadata (replaces conversionRate in transaction.extra)
    tableSchema({
      name: "transfers",
      columns: [
        { name: "from_transaction_id", type: "string", isIndexed: true },
        { name: "to_transaction_id", type: "string", isIndexed: true },
        { name: "from_account_id", type: "string", isIndexed: true },
        { name: "to_account_id", type: "string", isIndexed: true },
        { name: "conversion_rate", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Goals table - stores financial goals
    tableSchema({
      name: "goals",
      columns: [
        { name: "name", type: "string" },
        { name: "description", type: "string", isOptional: true },
        { name: "target_amount", type: "number" },
        { name: "currency_code", type: "string" },
        { name: "target_date", type: "number", isOptional: true },
        { name: "icon", type: "string", isOptional: true },
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "goal_type", type: "string" }, // "savings" | "expense"
        { name: "is_archived", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Loans table - stores borrowed and lent money
    tableSchema({
      name: "loans",
      columns: [
        { name: "name", type: "string" },
        { name: "description", type: "string", isOptional: true },
        { name: "principal_amount", type: "number" },
        { name: "loan_type", type: "string" }, // "borrowed" | "lent"
        { name: "due_date", type: "number", isOptional: true },
        { name: "account_id", type: "string", isIndexed: true },
        { name: "category_id", type: "string", isIndexed: true },
        { name: "icon", type: "string", isOptional: true },
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Recurring transactions (templates that generate Transaction instances)
    tableSchema({
      name: "recurring_transactions",
      columns: [
        { name: "json_transaction_template", type: "string" },
        { name: "transfer_to_account_id", type: "string", isOptional: true },
        { name: "range", type: "string" }, // JSON or encoded time range { from, to }
        { name: "rules", type: "string" }, // JSON array of RRULE strings
        { name: "created_at", type: "number" },
        {
          name: "last_generated_transaction_date",
          type: "number",
          isOptional: true,
        },
        { name: "disabled", type: "boolean" },
      ],
    }),

    // Budgets table - stores budget limits
    tableSchema({
      name: "budgets",
      columns: [
        { name: "name", type: "string" },
        { name: "amount", type: "number" },
        { name: "currency_code", type: "string" },
        { name: "period", type: "string" }, // "daily" | "weekly" | "monthly" | "yearly" | "custom"
        { name: "start_date", type: "number" },
        { name: "end_date", type: "number", isOptional: true },
        { name: "alert_threshold", type: "number", isOptional: true }, // Percentage (e.g., 80 for 80%)
        { name: "is_active", type: "boolean" },
        { name: "icon", type: "string", isOptional: true },
        { name: "color_scheme_name", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // Join table for Budgets and Accounts
    tableSchema({
      name: "budget_accounts",
      columns: [
        { name: "budget_id", type: "string", isIndexed: true },
        { name: "account_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),

    // Join table for Budgets and categories
    tableSchema({
      name: "budget_categories",
      columns: [
        { name: "budget_id", type: "string", isIndexed: true },
        { name: "category_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),

    // Join table for Goals and Accounts
    tableSchema({
      name: "goal_accounts",
      columns: [
        { name: "goal_id", type: "string", isIndexed: true },
        { name: "account_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
      ],
    }),
  ],
})
