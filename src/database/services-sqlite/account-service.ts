import { endOfMonth, startOfMonth } from "date-fns"

import { emit } from "~/database/events"
import { query } from "~/database/sql"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import type {
  AddAccountsFormSchema,
  UpdateAccountsFormSchema,
} from "~/schemas/accounts.schema"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

// ── Create ───────────────────────────────────────────────────────────────────

export async function createAccount(
  data: AddAccountsFormSchema,
): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  const result = await runInTransaction("account.create", async (db) => {
    const last = await db.getFirstAsync<{ max_order: number | null }>(
      `SELECT MAX(sort_order) AS max_order FROM accounts`,
    )
    const sortOrder = last?.max_order != null ? last.max_order + 1 : 0

    await db.runAsync(
      `INSERT INTO accounts (
        id, name, type, balance, currency_code, icon, color_scheme_name,
        is_primary, exclude_from_balance, is_archived, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [
        id,
        data.name,
        data.type,
        data.balance,
        data.currencyCode,
        data.icon ?? null,
        data.colorSchemeName ?? null,
        data.isPrimary ? 1 : 0,
        data.excludeFromBalance ? 1 : 0,
        sortOrder,
        now,
        now,
      ],
    )

    if (data.isPrimary) {
      await db.runAsync(
        `UPDATE accounts SET is_primary = 0, updated_at = ? WHERE id != ?`,
        [now, id],
      )
    }

    return id
  })

  emit("accounts:dirty", { ids: [result] })
  return result
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateAccount(
  id: string,
  updates: Partial<UpdateAccountsFormSchema>,
): Promise<void> {
  const now = new Date().toISOString()

  const balanceAdjustment = await runInTransaction<{
    amount: number
    type: TransactionType
  } | null>("account.update", async (db) => {
    const existing = await db.getFirstAsync<{
      balance: number
      name: string
      type: string
      currency_code: string
    }>(`SELECT balance, name, type, currency_code FROM accounts WHERE id = ?`, [
      id,
    ])
    if (!existing) throw new Error(`Account ${id} not found`)

    if (updates.isPrimary === true) {
      await db.runAsync(
        `UPDATE accounts SET is_primary = 0, updated_at = ? WHERE id != ?`,
        [now, id],
      )
    }

    await db.runAsync(
      `UPDATE accounts SET
        name = COALESCE(?, name),
        type = COALESCE(?, type),
        currency_code = COALESCE(?, currency_code),
        icon = CASE WHEN ? THEN ? ELSE icon END,
        color_scheme_name = CASE WHEN ? THEN ? ELSE color_scheme_name END,
        is_primary = COALESCE(?, is_primary),
        exclude_from_balance = COALESCE(?, exclude_from_balance),
        updated_at = ?
      WHERE id = ?`,
      [
        updates.name ?? null,
        updates.type ?? null,
        updates.currencyCode ?? null,
        updates.icon !== undefined ? 1 : 0,
        updates.icon ?? null,
        updates.colorSchemeName !== undefined ? 1 : 0,
        updates.colorSchemeName ?? null,
        updates.isPrimary !== undefined ? (updates.isPrimary ? 1 : 0) : null,
        updates.excludeFromBalance !== undefined
          ? updates.excludeFromBalance
            ? 1
            : 0
          : null,
        now,
        id,
      ],
    )

    // Return balance adjustment info for after commit (avoid nested tx event timing)
    if (
      updates.balance !== undefined &&
      typeof updates.balance === "number" &&
      updates.balance !== existing.balance
    ) {
      const delta = updates.balance - existing.balance
      return {
        amount: Math.abs(delta),
        type:
          delta > 0 ? TransactionTypeEnum.INCOME : TransactionTypeEnum.EXPENSE,
      }
    }
    return null
  })

  // Balance adjustment via compensating transaction (runs after outer tx commits)
  if (balanceAdjustment) {
    const { createTransaction } = await import("./transaction-service")
    await createTransaction({
      amount: balanceAdjustment.amount,
      type: balanceAdjustment.type,
      transactionDate: new Date(),
      accountId: id,
      categoryId: null,
      title: "Balance adjustment",
      description: null,
      isPending: false,
      tags: [],
    })
  }

  emit("accounts:dirty", { ids: [id] })
}

// ── Archive / Unarchive ───────────────────────────────────────────────────────

export async function archiveAccount(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.archive", async (db) => {
    await db.runAsync(
      `UPDATE accounts SET is_archived = 1, updated_at = ? WHERE id = ?`,
      [now, id],
    )
  })
  emit("accounts:dirty", { ids: [id] })
}

export async function unarchiveAccount(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.unarchive", async (db) => {
    await db.runAsync(
      `UPDATE accounts SET is_archived = 0, updated_at = ? WHERE id = ?`,
      [now, id],
    )
  })
  emit("accounts:dirty", { ids: [id] })
}

// ── Destroy (cascading) ───────────────────────────────────────────────────────

export async function destroyAccount(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("account.destroy", async (db) => {
    // 1. Fetch all transactions for this account (including deleted)
    const txs = await db.getAllAsync<RowTransaction>(
      `SELECT * FROM transactions WHERE account_id = ?`,
      [id],
    )

    // 2. Collect transfer partner tx IDs
    const allTxIds = txs.map((t) => t.id)
    const txPlaceholders = allTxIds.map(() => "?").join(",")
    const transferTxRows = await db.getAllAsync<{
      from_transaction_id: string
      to_transaction_id: string
    }>(
      `SELECT from_transaction_id, to_transaction_id FROM transfers
       WHERE from_transaction_id IN (${txPlaceholders}) OR to_transaction_id IN (${txPlaceholders})`,
      [...allTxIds, ...allTxIds],
    )
    const transferTxIdSet = new Set<string>()
    for (const row of transferTxRows) {
      transferTxIdSet.add(row.from_transaction_id)
      transferTxIdSet.add(row.to_transaction_id)
    }
    const transferTxIds = txs
      .filter((t) => transferTxIdSet.has(t.id))
      .map((t) => t.id)

    if (transferTxIds.length > 0) {
      const placeholders = transferTxIds.map(() => "?").join(",")
      const transferRows = await db.getAllAsync<{
        from_transaction_id: string
        to_transaction_id: string
      }>(
        `SELECT from_transaction_id, to_transaction_id FROM transfers
         WHERE from_transaction_id IN (${placeholders}) OR to_transaction_id IN (${placeholders})`,
        [...transferTxIds, ...transferTxIds],
      )

      const txIdSet = new Set(transferTxIds)
      const partnerTxIds = [
        ...new Set(
          transferRows.flatMap((row) => {
            const parts: string[] = []
            if (txIdSet.has(row.from_transaction_id))
              parts.push(row.to_transaction_id)
            if (txIdSet.has(row.to_transaction_id))
              parts.push(row.from_transaction_id)
            return parts
          }),
        ),
      ]

      if (partnerTxIds.length > 0) {
        const partnerPlaceholders = partnerTxIds.map(() => "?").join(",")
        const partnerTxs = await db.getAllAsync<RowTransaction>(
          `SELECT * FROM transactions WHERE id IN (${partnerPlaceholders})`,
          partnerTxIds,
        )

        // Accumulate balance delta per partner account
        const partnerAccountDeltas = new Map<string, number>()
        for (const tx of partnerTxs) {
          if (!tx.is_deleted && !tx.is_pending) {
            const delta = tx.amount // transfer amount is pre-signed
            partnerAccountDeltas.set(
              tx.account_id,
              (partnerAccountDeltas.get(tx.account_id) ?? 0) + delta,
            )
          }
        }

        // Reverse partner account balances
        for (const [accId, totalDelta] of partnerAccountDeltas) {
          await db.runAsync(
            `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
            [totalDelta, now, accId],
          )
        }

        // Soft-delete partner transactions
        for (const tx of partnerTxs) {
          if (!tx.is_deleted) {
            await db.runAsync(
              `UPDATE transactions SET is_deleted = 1, deleted_at = ?, updated_at = ? WHERE id = ?`,
              [now, now, tx.id],
            )
          }
        }

        // Delete transfers join rows
        const allTxIds = [...transferTxIds, ...partnerTxIds]
        const allPlaceholders = allTxIds.map(() => "?").join(",")
        await db.runAsync(
          `DELETE FROM transfers
           WHERE from_transaction_id IN (${allPlaceholders}) OR to_transaction_id IN (${allPlaceholders})`,
          [...allTxIds, ...allTxIds],
        )
      }
    }

    // 3. Delete transaction_tags and all transactions for this account
    if (txs.length > 0) {
      const allTxIds = txs.map((t) => t.id)
      const placeholders = allTxIds.map(() => "?").join(",")
      await db.runAsync(
        `DELETE FROM transaction_tags WHERE transaction_id IN (${placeholders})`,
        allTxIds,
      )
      await db.runAsync(`DELETE FROM transactions WHERE account_id = ?`, [id])
    }

    // 5. Clean up budget and goal join rows before FK constraint blocks account delete
    await db.runAsync(`DELETE FROM budget_accounts WHERE account_id = ?`, [id])
    await db.runAsync(`DELETE FROM goal_accounts WHERE account_id = ?`, [id])

    // 6. Delete the account
    await db.runAsync(`DELETE FROM accounts WHERE id = ?`, [id])
  })

  emit("accounts:dirty", {})
  emit("transactions:dirty", {})
  emit("categories:dirty", undefined)
  emit("tags:dirty", undefined)
  emit("budgets:dirty", undefined)
  emit("goals:dirty", undefined)
  emit("loans:dirty", undefined)
}

// ── Reorder ───────────────────────────────────────────────────────────────────

export async function updateAccountsOrder(
  entries: Array<{ id: string }>,
): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.reorder", async (db) => {
    for (let i = 0; i < entries.length; i++) {
      await db.runAsync(
        `UPDATE accounts SET sort_order = ?, updated_at = ? WHERE id = ?`,
        [i, now, entries[i].id],
      )
    }
  })
  emit("accounts:dirty", {
    ids: entries.map((e) => e.id),
  })
}

// ── Read helpers ──────────────────────────────────────────────────────────────

export async function getAccountTransactionCount(
  accountId: string,
): Promise<number> {
  const rows = await query<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM transactions WHERE account_id = ? AND is_deleted = 0`,
    [accountId],
  )
  return rows[0]?.cnt ?? 0
}

export function getMonthRange(
  year: number,
  month: number,
): { fromDate: number; toDate: number } {
  const d = new Date(year, month, 1)
  return {
    fromDate: startOfMonth(d).getTime(),
    toDate: endOfMonth(d).getTime(),
  }
}
