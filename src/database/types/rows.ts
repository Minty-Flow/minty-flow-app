/**
 * Raw SQLite row shapes — no domain logic, no camelCase.
 *
 * These interfaces mirror the exact column names and types returned by
 * `expo-sqlite` queries. SQLite booleans are stored as `0 | 1` integers;
 * dates are UTC ISO-8601 strings. Mappers in `~/database/mappers/` convert
 * these to typed domain objects consumed by the rest of the app.
 *
 * **Do not add computed or derived properties here.** This module is the
 * boundary between raw storage and the domain layer.
 */

/**
 * Raw row from the `transactions` table.
 *
 * Key invariants:
 * - `amount` is an integer in minor currency units (e.g. cents);
 *   sign is derived from `type`.
 * - Transfer rows have `amount` pre-signed by the writer
 *   (debit row negative, credit row positive) — see {@link getBalanceDelta}.
 * - Transfer legs are identified via the `transfers` join table
 *   (no longer stored as columns on the transaction row).
 * - `extra` is a JSON string storing attachment metadata when
 *   `has_attachments = 1`.
 * - `account_balance_before` is the account balance at the moment the
 *   transaction was written; used by balance-history queries.
 */
export interface RowTransaction {
  id: string
  account_id: string
  category_id: string | null
  amount: number
  type: string
  transaction_date: string // UTC ISO
  title: string | null
  description: string | null
  is_deleted: number // 0 | 1
  deleted_at: string | null
  is_pending: number // 0 | 1
  requires_manual_confirmation: number // 0 | 1 (DEFAULT 0)
  account_balance_before: number
  subtype: string | null
  kind: string
  extra: string | null // JSON
  has_attachments: number // 0 | 1
  recurring_id: string | null
  location: string | null
  goal_id: string | null
  budget_id: string | null
  loan_id: string | null
  created_at: string // UTC ISO
  updated_at: string // UTC ISO
}

/**
 * Raw row from the `accounts` table.
 *
 * `balance` is an integer in minor currency units (e.g. cents), kept in sync
 * by the transaction services — it is the running sum of all non-deleted,
 * non-pending transactions on the account.
 * `sort_order` drives the display order on the accounts screen; lower values
 * appear first.
 */
export interface RowAccount {
  id: string
  name: string
  type: string
  balance: number
  currency_code: string
  icon: string | null
  color_scheme_name: string | null
  is_primary: number // 0 | 1
  exclude_from_balance: number // 0 | 1
  is_archived: number // 0 | 1
  sort_order: number | null
  created_at: string // UTC ISO
  updated_at: string // UTC ISO
}

export interface RowCategory {
  id: string
  name: string
  type: string
  icon: string | null
  color_scheme_name: string | null
  created_at: string // UTC ISO
  updated_at: string // UTC ISO
}

/**
 * Raw row from the `transaction_tags` join table.
 *
 * This is a pure many-to-many junction — no extra columns beyond the two FKs.
 */
export interface RowTransactionTag {
  transaction_id: string
  tag_id: string
}

/** Raw row from the `transaction_items` table. `unit_price` is minor units. */
export interface RowTransactionItem {
  id: string
  transaction_id: string
  name: string
  unit_price: number
  quantity: number
  sort_order: number
}
