import type { SQLiteBindParams } from "expo-sqlite"

import { getDb } from "./db"

/**
 * Execute a `SELECT` (or any statement that returns rows) and return all
 * matching rows typed as `T`.
 *
 * Prefer this over calling `getDb().getAllAsync` directly so that read helpers
 * always route through the singleton and are easy to intercept in tests.
 *
 * @param sql - Parameterised SQL statement.
 * @param params - Bind parameters (positional `?` placeholders).
 * @returns An array of rows; empty array when no rows match.
 *
 * @example
 * ```ts
 * const rows = await query<RowAccount>(
 *   "SELECT * FROM accounts WHERE is_archived = 0 ORDER BY sort_order ASC",
 * )
 * ```
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: SQLiteBindParams = [],
): Promise<T[]> {
  const db = getDb()
  return db.getAllAsync<T>(sql, params)
}

/**
 * Execute a statement and return the **first** matching row typed as `T`,
 * or `null` if no rows match.
 *
 * Use for look-ups by primary key or any query where at most one result is
 * expected.
 *
 * @param sql - Parameterised SQL statement.
 * @param params - Bind parameters (positional `?` placeholders).
 * @returns The first row, or `null`.
 *
 * @example
 * ```ts
 * const row = await queryOne<RowAccount>(
 *   "SELECT * FROM accounts WHERE id = ?",
 *   [accountId],
 * )
 * ```
 */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: SQLiteBindParams = [],
): Promise<T | null> {
  const db = getDb()
  return db.getFirstAsync<T>(sql, params)
}

/**
 * Execute a write statement (`INSERT`, `UPDATE`, `DELETE`) outside of a
 * managed transaction.
 *
 * **Prefer {@link runInTransaction}** for all writes — it serialises through
 * the write queue and wraps the work in an atomic transaction. Use `exec` only
 * for one-off writes where atomicity and serialisation are guaranteed by the
 * surrounding context (e.g. inside a `runInTransaction` callback).
 *
 * @param sql - Parameterised SQL statement.
 * @param params - Bind parameters (positional `?` placeholders).
 *
 * @example
 * ```ts
 * await exec("UPDATE accounts SET sort_order = ? WHERE id = ?", [order, id])
 * ```
 */
export async function exec(
  sql: string,
  params: SQLiteBindParams = [],
): Promise<void> {
  const db = getDb()
  await db.runAsync(sql, params)
}
