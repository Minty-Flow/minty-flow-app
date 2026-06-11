import { startOfDay, subDays } from "date-fns"

import { getDb } from "~/database/db"
import { emit } from "~/database/events"
import {
  hydrateTransactions,
  type TransactionWithRelations,
} from "~/database/mappers/hydrateTransactions"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type {
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type { TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"

function hasAttachmentsFromExtra(
  extra: Record<string, string> | null,
): boolean {
  if (!extra?.attachments) return false
  try {
    const parsed = JSON.parse(extra.attachments) as unknown
    if (Array.isArray(parsed)) return parsed.length > 0
    if (typeof parsed === "object" && parsed !== null)
      return Object.keys(parsed).length > 0
    return false
  } catch {
    return extra.attachments.length > 0
  }
}

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

async function requireTx(db: Db, id: string): Promise<RowTransaction> {
  const row = await db.getFirstAsync<RowTransaction>(
    `SELECT * FROM transactions WHERE id = ?`,
    [id],
  )
  if (!row) throw new Error(`Transaction ${id} not found`)
  return row
}

async function getTagIdsForTx(db: Db, txId: string): Promise<string[]> {
  const rows = await db.getAllAsync<{ tag_id: string }>(
    `SELECT tag_id FROM transaction_tags WHERE transaction_id = ?`,
    [txId],
  )
  return rows.map((r) => r.tag_id)
}

// ── Create ───────────────────────────────────────────────────────────────────

export async function createTransaction(
  data: TransactionFormValues,
): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()
  const extra = data.extra ?? null
  const extraJson = extra ? JSON.stringify(extra) : null
  const hasAttachments = hasAttachmentsFromExtra(extra) ? 1 : 0

  const { id: txId, accountId } = await runInTransaction(
    "transaction.create",
    async (db) => {
      const balanceBefore = data.isPending
        ? 0
        : ((
            await db.getFirstAsync<{ balance: number }>(
              `SELECT balance FROM accounts WHERE id = ?`,
              [data.accountId],
            )
          )?.balance ?? 0)

      await db.runAsync(
        `INSERT INTO transactions (
          id, account_id, category_id, amount, type, transaction_date,
          title, description, is_deleted, deleted_at, is_pending,
          requires_manual_confirmation,
          account_balance_before, subtype, extra, has_attachments,
          recurring_id, location, goal_id, budget_id, loan_id,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?
        )`,
        [
          id,
          data.accountId,
          data.categoryId ?? null,
          data.amount,
          data.type,
          data.transactionDate.toISOString(),
          data.title ?? null,
          data.description ?? null,
          data.isPending ? 1 : 0,
          data.requiresManualConfirmation ? 1 : 0,
          balanceBefore,
          data.subtype ?? null,
          extraJson,
          hasAttachments,
          data.recurringId ?? null,
          data.location ?? null,
          data.goalId ?? null,
          data.budgetId ?? null,
          data.loanId ?? null,
          now,
          now,
        ],
      )

      if (!data.isPending) {
        const delta = getBalanceDelta(data.amount, data.type, data.subtype)
        if (delta !== 0) {
          await db.runAsync(
            `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
            [delta, now, data.accountId],
          )
        }
      }

      if (data.tags?.length) {
        for (const tagId of data.tags) {
          await db.runAsync(
            `INSERT OR IGNORE INTO transaction_tags (transaction_id, tag_id) VALUES (?, ?)`,
            [id, tagId],
          )
        }
      }

      return { id, accountId: data.accountId }
    },
  )

  // Broadcast (no ids): a new row may enter any cached filter.
  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: [accountId] })
  if (data.categoryId) emit("categories:dirty", undefined)
  if (data.tags?.length) emit("tags:dirty", undefined)

  return txId
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateTransaction(
  id: string,
  data: Partial<TransactionFormValues>,
): Promise<void> {
  const now = new Date().toISOString()
  let categoryChanged = false
  let tagsChanged = false
  let affectedAccountIds: string[] = []

  await runInTransaction("transaction.update", async (db) => {
    const tx = await requireTx(db, id)

    const oldPending = !!tx.is_pending
    const oldAmount = tx.amount
    const oldType = tx.type
    const oldSubtype = tx.subtype
    const oldAccountId = tx.account_id
    const oldCategoryId = tx.category_id

    const newPending =
      data.isPending !== undefined ? data.isPending : oldPending
    const newAmount = data.amount !== undefined ? data.amount : oldAmount
    const newType = data.type !== undefined ? data.type : oldType
    const newSubtype =
      data.subtype !== undefined ? (data.subtype ?? null) : oldSubtype
    const newAccountId =
      data.accountId !== undefined ? data.accountId : oldAccountId
    const newCategoryId =
      data.categoryId !== undefined ? data.categoryId : oldCategoryId

    // -- Balance reconciliation --
    const oldDelta = !oldPending
      ? getBalanceDelta(oldAmount, oldType as TransactionType, oldSubtype)
      : 0
    const newDelta = !newPending
      ? getBalanceDelta(newAmount, newType as TransactionType, newSubtype)
      : 0

    if (newAccountId === oldAccountId) {
      const diff = newDelta - oldDelta
      if (diff !== 0) {
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [diff, now, oldAccountId],
        )
      }
    } else {
      if (oldDelta !== 0) {
        await db.runAsync(
          `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
          [oldDelta, now, oldAccountId],
        )
      }
      if (newDelta !== 0) {
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [newDelta, now, newAccountId],
        )
      }
    }

    affectedAccountIds =
      newAccountId !== oldAccountId
        ? [oldAccountId, newAccountId]
        : [oldAccountId]

    // -- account_balance_before reconciliation --
    let newBalanceBefore = tx.account_balance_before
    if (newPending) {
      newBalanceBefore = 0
    } else if (oldPending && !newPending) {
      // Confirming: snapshot current balance of target account (before new delta applied).
      // Use the value BEFORE we applied the delta above, so read it now (post-update).
      // Actually we need pre-update balance. Re-read account for snapshot.
      const targetAccountId =
        newAccountId !== oldAccountId ? newAccountId : oldAccountId
      const acc = await db.getFirstAsync<{ balance: number }>(
        `SELECT balance FROM accounts WHERE id = ?`,
        [targetAccountId],
      )
      newBalanceBefore = (acc?.balance ?? 0) - newDelta
    } else if (!oldPending && newAccountId !== oldAccountId) {
      // Account changed while confirmed: snapshot new account's pre-transfer balance.
      const acc = await db.getFirstAsync<{ balance: number }>(
        `SELECT balance FROM accounts WHERE id = ?`,
        [newAccountId],
      )
      newBalanceBefore = (acc?.balance ?? 0) - newDelta
    }

    categoryChanged =
      data.categoryId !== undefined && newCategoryId !== oldCategoryId

    // -- Tag sync --
    if (data.tags !== undefined) {
      tagsChanged = true
      const existingTagIds = await getTagIdsForTx(db, id)
      const existingSet = new Set(existingTagIds)
      const newSet = new Set(data.tags)

      for (const tagId of existingTagIds) {
        if (!newSet.has(tagId)) {
          await db.runAsync(
            `DELETE FROM transaction_tags WHERE transaction_id = ? AND tag_id = ?`,
            [id, tagId],
          )
        }
      }
      for (const tagId of data.tags) {
        if (!existingSet.has(tagId)) {
          await db.runAsync(
            `INSERT OR IGNORE INTO transaction_tags (transaction_id, tag_id) VALUES (?, ?)`,
            [id, tagId],
          )
        }
      }
    }

    // -- Transaction row update --
    const extra = data.extra !== undefined ? (data.extra ?? null) : null
    const extraJson =
      data.extra !== undefined ? (extra ? JSON.stringify(extra) : null) : null

    await db.runAsync(
      `UPDATE transactions SET
        amount = COALESCE(?, amount),
        type = COALESCE(?, type),
        transaction_date = COALESCE(?, transaction_date),
        title = CASE WHEN ? THEN ? ELSE title END,
        description = CASE WHEN ? THEN ? ELSE description END,
        is_pending = COALESCE(?, is_pending),
        requires_manual_confirmation = CASE WHEN ? THEN ? ELSE requires_manual_confirmation END,
        category_id = CASE WHEN ? THEN ? ELSE category_id END,
        account_id = COALESCE(?, account_id),
        account_balance_before = ?,
        extra = CASE WHEN ? THEN ? ELSE extra END,
        has_attachments = CASE WHEN ? THEN ? ELSE has_attachments END,
        subtype = CASE WHEN ? THEN ? ELSE subtype END,
        location = CASE WHEN ? THEN ? ELSE location END,
        recurring_id = CASE WHEN ? THEN ? ELSE recurring_id END,
        goal_id = CASE WHEN ? THEN ? ELSE goal_id END,
        budget_id = CASE WHEN ? THEN ? ELSE budget_id END,
        loan_id = CASE WHEN ? THEN ? ELSE loan_id END,
        updated_at = ?
      WHERE id = ?`,
      [
        data.amount ?? null,
        data.type ?? null,
        data.transactionDate ? data.transactionDate.toISOString() : null,
        data.title !== undefined ? 1 : 0,
        data.title ?? null,
        data.description !== undefined ? 1 : 0,
        data.description ?? null,
        data.isPending !== undefined ? (data.isPending ? 1 : 0) : null,
        data.requiresManualConfirmation !== undefined ? 1 : 0,
        data.requiresManualConfirmation ? 1 : 0,
        data.categoryId !== undefined ? 1 : 0,
        newCategoryId,
        data.accountId ?? null,
        newBalanceBefore,
        data.extra !== undefined ? 1 : 0,
        extraJson ?? null,
        data.extra !== undefined ? 1 : 0,
        data.extra !== undefined
          ? hasAttachmentsFromExtra(data.extra ?? null)
            ? 1
            : 0
          : null,
        data.subtype !== undefined ? 1 : 0,
        data.subtype ?? null,
        data.location !== undefined ? 1 : 0,
        data.location ?? null,
        data.recurringId !== undefined ? 1 : 0,
        data.recurringId ?? null,
        data.goalId !== undefined ? 1 : 0,
        data.goalId ?? null,
        data.budgetId !== undefined ? 1 : 0,
        data.budgetId ?? null,
        data.loanId !== undefined ? 1 : 0,
        data.loanId ?? null,
        now,
        id,
      ],
    )
  })

  // Broadcast: updates can change accountId/categoryId/date/isPending — any of
  // which is a filter field. Without broadcasting, caches that should now
  // include this row would miss it.
  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: affectedAccountIds })
  if (categoryChanged) emit("categories:dirty", undefined)
  if (tagsChanged) emit("tags:dirty", undefined)
}

// ── Soft Delete ───────────────────────────────────────────────────────────────

export async function deleteTransaction(id: string): Promise<void> {
  const now = new Date().toISOString()
  let categoryChanged = false
  let tagsChanged = false
  let accountId: string | undefined
  let transferAffectedIds: string[] | undefined
  let partnerTxId: string | undefined

  await runInTransaction("transaction.delete", async (db) => {
    const tx = await requireTx(db, id)
    if (tx.is_deleted) return

    // Transfers: delegate to transfer service (both legs must be soft-deleted atomically)
    const transferPartner = await db.getFirstAsync<{ id: string }>(
      `SELECT id FROM transfers WHERE from_transaction_id = ? OR to_transaction_id = ?`,
      [id, id],
    )
    if (transferPartner) {
      // Capture partner info before deletion for proper event emission
      let partnerAccountId: string | undefined
      const partnerRow = await db.getFirstAsync<{
        from_transaction_id: string
        to_transaction_id: string
      }>(
        `SELECT from_transaction_id, to_transaction_id FROM transfers
         WHERE from_transaction_id = ? OR to_transaction_id = ?`,
        [id, id],
      )
      if (partnerRow) {
        partnerTxId =
          partnerRow.from_transaction_id === id
            ? partnerRow.to_transaction_id
            : partnerRow.from_transaction_id
        const partnerTx = await db.getFirstAsync<{ account_id: string }>(
          `SELECT account_id FROM transactions WHERE id = ?`,
          [partnerTxId],
        )
        partnerAccountId = partnerTx?.account_id
      }

      // Import inline to avoid circular dep — transfer service handles both legs
      const { deleteTransferById } = await import("./transfer-service")
      await deleteTransferById(tx.id, db)

      transferAffectedIds = [tx.account_id, partnerAccountId].filter(
        Boolean,
      ) as string[]
      return
    }

    accountId = tx.account_id

    if (!tx.is_pending) {
      const delta = getBalanceDelta(
        tx.amount,
        tx.type as TransactionType,
        tx.subtype,
      )
      await db.runAsync(
        `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
        [delta, now, tx.account_id],
      )
    }

    if (tx.category_id) {
      categoryChanged = true
    }

    const tagIds = await getTagIdsForTx(db, id)
    if (tagIds.length) {
      tagsChanged = true
    }

    await db.runAsync(
      `UPDATE transactions SET is_deleted = 1, deleted_at = ?, updated_at = ? WHERE id = ?`,
      [now, now, id],
    )
  })

  if (transferAffectedIds) {
    emit("accounts:dirty", { ids: transferAffectedIds })
    emit("transactions:dirty", {
      ids: [id, partnerTxId].filter(Boolean) as string[],
    })
    emit("transfers:dirty", undefined)
  } else {
    if (accountId) emit("accounts:dirty", { ids: [accountId] })
    emit("transactions:dirty", { ids: [id] })
  }
  if (categoryChanged) emit("categories:dirty", undefined)
  if (tagsChanged) emit("tags:dirty", undefined)
}

// ── Restore ───────────────────────────────────────────────────────────────────

export async function restoreTransaction(id: string): Promise<void> {
  const now = new Date().toISOString()
  let categoryChanged = false
  let tagsChanged = false
  let accountId: string | undefined

  await runInTransaction("transaction.restore", async (db) => {
    const tx = await requireTx(db, id)
    if (!tx.is_deleted) return

    accountId = tx.account_id

    await db.runAsync(
      `UPDATE transactions SET is_deleted = 0, deleted_at = NULL, updated_at = ? WHERE id = ?`,
      [now, id],
    )

    if (!tx.is_pending) {
      const delta = getBalanceDelta(
        tx.amount,
        tx.type as TransactionType,
        tx.subtype,
      )
      // Refresh balance_before snapshot then apply delta
      const acc = await db.getFirstAsync<{ balance: number }>(
        `SELECT balance FROM accounts WHERE id = ?`,
        [tx.account_id],
      )
      const balanceBefore = acc?.balance ?? 0
      await db.runAsync(
        `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
        [delta, now, tx.account_id],
      )
      await db.runAsync(
        `UPDATE transactions SET account_balance_before = ? WHERE id = ?`,
        [balanceBefore, id],
      )
    }

    if (tx.category_id) {
      categoryChanged = true
    }

    const tagIds = await getTagIdsForTx(db, id)
    if (tagIds.length) {
      tagsChanged = true
    }
  })

  if (accountId) emit("accounts:dirty", { ids: [accountId] })
  // Broadcast: restoring un-sets is_deleted, so the row may re-enter cached filters.
  emit("transactions:dirty", {})
  if (categoryChanged) emit("categories:dirty", undefined)
  if (tagsChanged) emit("tags:dirty", undefined)
}

// ── Permanent Destroy ─────────────────────────────────────────────────────────

export async function destroyTransaction(id: string): Promise<void> {
  const now = new Date().toISOString()
  let categoryChanged = false
  let tagsChanged = false
  let accountId: string | undefined

  await runInTransaction("transaction.destroy", async (db) => {
    const tx = await requireTx(db, id)
    accountId = tx.account_id

    if (!tx.is_deleted) {
      if (!tx.is_pending) {
        const delta = getBalanceDelta(
          tx.amount,
          tx.type as TransactionType,
          tx.subtype,
        )
        await db.runAsync(
          `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
          [delta, now, tx.account_id],
        )
      }

      if (tx.category_id) {
        categoryChanged = true
      }

      const tagIds = await getTagIdsForTx(db, id)
      if (tagIds.length) {
        tagsChanged = true
      }
    }

    await db.runAsync(`DELETE FROM transaction_tags WHERE transaction_id = ?`, [
      id,
    ])

    if (tx.type === "transfer") {
      await db.runAsync(
        `DELETE FROM transfers WHERE from_transaction_id = ? OR to_transaction_id = ?`,
        [id, id],
      )
    }

    await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id])
  })

  if (accountId) emit("accounts:dirty", { ids: [accountId] })
  emit("transactions:dirty", { ids: [id] })
  if (categoryChanged) emit("categories:dirty", undefined)
  if (tagsChanged) emit("tags:dirty", undefined)
}

// ── Confirm / Hold ────────────────────────────────────────────────────────────

interface ConfirmOptions {
  updateTransactionDate: boolean
  confirm?: boolean
}

export async function confirmTransaction(
  id: string,
  options: ConfirmOptions,
): Promise<void> {
  const shouldConfirm = options.confirm !== false
  const now = new Date().toISOString()
  const affectedAccountIds: string[] = []

  await runInTransaction("transaction.confirm", async (db) => {
    const tx = await requireTx(db, id)

    if (shouldConfirm && !tx.is_pending) return
    if (!shouldConfirm && tx.is_pending) return

    // Collect both legs for transfers
    const legs: RowTransaction[] = [tx]
    const transferRow = await db.getFirstAsync<{
      from_transaction_id: string
      to_transaction_id: string
    }>(
      `SELECT from_transaction_id, to_transaction_id FROM transfers
       WHERE from_transaction_id = ? OR to_transaction_id = ?`,
      [id, id],
    )
    if (transferRow) {
      const partnerId =
        transferRow.from_transaction_id === id
          ? transferRow.to_transaction_id
          : transferRow.from_transaction_id
      const pair = await db.getFirstAsync<RowTransaction>(
        `SELECT * FROM transactions WHERE id = ? AND is_deleted = 0`,
        [partnerId],
      )
      if (pair) {
        if (shouldConfirm && pair.is_pending) legs.push(pair)
        if (!shouldConfirm && !pair.is_pending) legs.push(pair)
      }
    }

    const accountIds = [...new Set(legs.map((l) => l.account_id))]

    for (const leg of legs) {
      if (shouldConfirm) {
        const acc = await db.getFirstAsync<{ balance: number }>(
          `SELECT balance FROM accounts WHERE id = ?`,
          [leg.account_id],
        )
        const balanceBefore = acc?.balance ?? 0
        const delta = getBalanceDelta(
          leg.amount,
          leg.type as TransactionType,
          leg.subtype,
        )

        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [delta, now, leg.account_id],
        )
        await db.runAsync(
          `UPDATE transactions SET
            is_pending = 0,
            account_balance_before = ?,
            transaction_date = CASE WHEN ? THEN ? ELSE transaction_date END,
            updated_at = ?
          WHERE id = ?`,
          [
            balanceBefore,
            options.updateTransactionDate ? 1 : 0,
            now,
            now,
            leg.id,
          ],
        )
      } else {
        // Re-pending: reverse balance delta
        const delta = getBalanceDelta(
          leg.amount,
          leg.type as TransactionType,
          leg.subtype,
        )
        await db.runAsync(
          `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
          [delta, now, leg.account_id],
        )
        await db.runAsync(
          `UPDATE transactions SET is_pending = 1, account_balance_before = 0, updated_at = ? WHERE id = ?`,
          [now, leg.id],
        )
      }
    }

    affectedAccountIds.push(...accountIds)
  })

  // Broadcast: confirm/hold toggles is_pending, which is a filter field.
  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: affectedAccountIds })
}

// ── Recurring scope helpers ───────────────────────────────────────────────────

export async function deleteAllRecurringInstances(
  ruleId: string,
): Promise<void> {
  const instances = await (
    await import("~/database/sql")
  ).query<RowTransaction>(
    `SELECT * FROM transactions WHERE recurring_id = ? AND is_deleted = 0`,
    [ruleId],
  )
  for (const tx of instances) {
    await deleteTransaction(tx.id)
  }
}

export async function deleteFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
): Promise<void> {
  const instances = await (
    await import("~/database/sql")
  ).query<RowTransaction>(
    `SELECT * FROM transactions
     WHERE recurring_id = ? AND transaction_date >= ? AND is_deleted = 0`,
    [ruleId, fromDate.toISOString()],
  )
  for (const tx of instances) {
    await deleteTransaction(tx.id)
  }
}

export async function detachFromRule(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("transaction.detach", async (db) => {
    await db.runAsync(
      `UPDATE transactions SET recurring_id = NULL, updated_at = ? WHERE id = ?`,
      [now, id],
    )
  })
  emit("transactions:dirty", { ids: [id] })
}

export async function updateFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
  payload: RecurringEditPayload,
): Promise<void> {
  const sql = await import("~/database/sql")
  const instances = await sql.query<RowTransaction>(
    `SELECT * FROM transactions
     WHERE recurring_id = ? AND transaction_date >= ? AND is_pending = 1 AND is_deleted = 0`,
    [ruleId, fromDate.toISOString()],
  )
  for (const tx of instances) {
    await updateTransaction(tx.id, {
      amount: payload.amount,
      type: payload.type,
      transactionDate: payload.transactionDate,
      categoryId: payload.categoryId,
      accountId: payload.accountId,
      title: payload.title,
      description: payload.description,
      isPending: payload.isPending,
      requiresManualConfirmation: payload.requiresManualConfirmation,
      tags: payload.tags,
      extra: payload.extra,
      subtype: payload.subtype,
    })
  }
}

// ── Trash helpers ─────────────────────────────────────────────────────────────

export async function destroyAllDeletedTransactions(): Promise<void> {
  const sql = await import("~/database/sql")
  const deleted = await sql.query<RowTransaction>(
    `SELECT * FROM transactions WHERE is_deleted = 1`,
  )
  for (const tx of deleted) {
    await destroyTransaction(tx.id)
  }
}

export async function autoPurgeTrash(retentionValue: string): Promise<void> {
  if (retentionValue === "forever") return

  const match = /^(\d+)days$/.exec(retentionValue)
  if (!match) return
  const days = parseInt(match[1], 10)
  if (!Number.isFinite(days) || days <= 0) return

  const cutoff = startOfDay(subDays(new Date(), days)).toISOString()

  const sql = await import("~/database/sql")
  const toPurge = await sql.query<RowTransaction>(
    `SELECT * FROM transactions WHERE is_deleted = 1 AND deleted_at < ?`,
    [cutoff],
  )

  for (const tx of toPurge) {
    try {
      await destroyTransaction(tx.id)
    } catch (err) {
      logger.error("[autoPurgeTrash] failed to destroy transaction", {
        id: tx.id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

export async function getTransactionById(
  id: string,
): Promise<TransactionWithRelations | null> {
  const db = getDb()
  const row = await db.getFirstAsync<RowTransaction>(
    `SELECT * FROM transactions WHERE id = ?`,
    [id],
  )
  if (!row) return null
  const hydrated = await hydrateTransactions([row])
  return hydrated[0] ?? null
}

export async function getTagIdsForTransaction(txId: string): Promise<string[]> {
  const db = getDb()
  const rows = await db.getAllAsync<{ tag_id: string }>(
    `SELECT tag_id FROM transaction_tags WHERE transaction_id = ?`,
    [txId],
  )
  return rows.map((r) => r.tag_id)
}
