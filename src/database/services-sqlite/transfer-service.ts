import { emit } from "~/database/events"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import type {
  CreateTransferParams,
  EditTransferFields,
} from "~/schemas/transactions.schema"

// ── Helpers ──────────────────────────────────────────────────────────────────

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

function toDateMs(v: number | Date | undefined, fallback: number): number {
  if (v === undefined) return fallback
  return typeof v === "number" ? v : v.getTime()
}

/** Find the partner transaction id for a transfer leg via the transfers table. */
async function getPartnerTxId(
  txId: string,
  db: Db,
): Promise<{ partnerId: string; isDebit: boolean } | null> {
  const row = await db.getFirstAsync<{
    from_transaction_id: string
    to_transaction_id: string
  }>(
    `SELECT from_transaction_id, to_transaction_id FROM transfers
     WHERE from_transaction_id = ? OR to_transaction_id = ?`,
    [txId, txId],
  )
  if (!row) return null
  if (row.from_transaction_id === txId) {
    return { partnerId: row.to_transaction_id, isDebit: true }
  }
  return { partnerId: row.from_transaction_id, isDebit: false }
}

/** Fetch a transfer row keyed by either leg id. */
async function getTransferRow(
  txId: string,
  db: Db,
): Promise<{
  id: string
  from_transaction_id: string
  to_transaction_id: string
  from_account_id: string
  to_account_id: string
  conversion_rate: number
} | null> {
  return db.getFirstAsync<{
    id: string
    from_transaction_id: string
    to_transaction_id: string
    from_account_id: string
    to_account_id: string
    conversion_rate: number
  }>(
    `SELECT * FROM transfers
     WHERE from_transaction_id = ? OR to_transaction_id = ?`,
    [txId, txId],
  )
}

async function getConversionRate(txId: string): Promise<number | null> {
  const sql = await import("~/database/sql")
  const row = await sql.queryOne<{ conversion_rate: number }>(
    `SELECT conversion_rate FROM transfers
     WHERE from_transaction_id = ? OR to_transaction_id = ?`,
    [txId, txId],
  )
  if (row) return row.conversion_rate
  return null
}

// ── Internal: delete both legs within an already-open transaction context ────

/**
 * Soft-delete both legs of a transfer within an existing transaction context.
 * Called by transaction-service.deleteTransaction when it detects a transfer.
 */
export async function deleteTransferById(txId: string, db: Db): Promise<void> {
  const now = new Date().toISOString()

  const tx = await db.getFirstAsync<RowTransaction>(
    `SELECT * FROM transactions WHERE id = ?`,
    [txId],
  )
  if (!tx) return

  const partner = await getPartnerTxId(txId, db)

  const legs: RowTransaction[] = [tx]
  if (partner) {
    const paired = await db.getFirstAsync<RowTransaction>(
      `SELECT * FROM transactions WHERE id = ? AND is_deleted = 0`,
      [partner.partnerId],
    )
    if (paired) legs.push(paired)
  }

  for (const leg of legs) {
    if (!leg.is_deleted && !leg.is_pending) {
      await db.runAsync(
        `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
        [leg.amount, now, leg.account_id],
      )
    }
    await db.runAsync(
      `UPDATE transactions SET is_deleted = 1, deleted_at = ?, updated_at = ? WHERE id = ?`,
      [now, now, leg.id],
    )
  }
}

// ── Create ───────────────────────────────────────────────────────────────────

export async function createTransfer(
  params: CreateTransferParams,
  recurringOptions?: {
    recurringId: string
    isPending: boolean
    subtype?: string | null
    extra?: Record<string, string> | null
  },
): Promise<void> {
  if (params.fromAccountId === params.toAccountId) {
    throw new Error("Cannot transfer to the same account.")
  }
  if (params.amount <= 0) {
    throw new Error("Transfer amount must be positive.")
  }

  const debitId = generateId()
  const creditId = generateId()
  const now = new Date().toISOString()
  const dateMs = toDateMs(
    params.transactionDate as number | Date | undefined,
    Date.now(),
  )
  const dateIso = new Date(dateMs).toISOString()
  const isPending = recurringOptions?.isPending ?? false
  const title = params.title ?? "Transfer"
  const extraJson = recurringOptions?.extra
    ? JSON.stringify(recurringOptions.extra)
    : null

  const affected = await runInTransaction("transfer.create", async (db) => {
    const [fromAcc, toAcc] = await Promise.all([
      db.getFirstAsync<{ balance: number; currency_code: string }>(
        `SELECT balance, currency_code FROM accounts WHERE id = ?`,
        [params.fromAccountId],
      ),
      db.getFirstAsync<{ balance: number; currency_code: string }>(
        `SELECT balance, currency_code FROM accounts WHERE id = ?`,
        [params.toAccountId],
      ),
    ])

    if (!fromAcc || !toAcc) throw new Error("One or both accounts not found.")

    const isCrossCurrency = fromAcc.currency_code !== toAcc.currency_code
    const creditAmount =
      isCrossCurrency &&
      params.conversionRate != null &&
      params.conversionRate > 0
        ? params.amount * params.conversionRate
        : params.amount

    const debitBalanceBefore = fromAcc.balance
    const creditBalanceBefore = toAcc.balance

    // Debit leg: money leaves fromAccount (negative amount)
    await db.runAsync(
      `INSERT INTO transactions (
        id, account_id, category_id, amount, type, transaction_date,
        title, description, is_deleted, deleted_at, is_pending,
        requires_manual_confirmation,
        account_balance_before, subtype, extra, has_attachments,
        recurring_id, location, goal_id, budget_id, loan_id,
        created_at, updated_at
      ) VALUES (
        ?, ?, NULL, ?, 'transfer', ?,
        ?, ?, 0, NULL, ?,
        0,
        ?, ?, ?, 0,
        ?, NULL, NULL, NULL, NULL,
        ?, ?
      )`,
      [
        debitId,
        params.fromAccountId,
        -params.amount,
        dateIso,
        title,
        params.notes ?? null,
        isPending ? 1 : 0,
        isPending ? 0 : debitBalanceBefore,
        recurringOptions?.subtype ?? null,
        extraJson,
        recurringOptions?.recurringId ?? null,
        now,
        now,
      ],
    )

    // Credit leg: money enters toAccount (positive amount)
    await db.runAsync(
      `INSERT INTO transactions (
        id, account_id, category_id, amount, type, transaction_date,
        title, description, is_deleted, deleted_at, is_pending,
        requires_manual_confirmation,
        account_balance_before, subtype, extra, has_attachments,
        recurring_id, location, goal_id, budget_id, loan_id,
        created_at, updated_at
      ) VALUES (
        ?, ?, NULL, ?, 'transfer', ?,
        ?, ?, 0, NULL, ?,
        0,
        ?, ?, ?, 0,
        ?, NULL, NULL, NULL, NULL,
        ?, ?
      )`,
      [
        creditId,
        params.toAccountId,
        creditAmount,
        dateIso,
        title,
        params.notes ?? null,
        isPending ? 1 : 0,
        isPending ? 0 : creditBalanceBefore,
        recurringOptions?.subtype ?? null,
        extraJson,
        recurringOptions?.recurringId ?? null,
        now,
        now,
      ],
    )

    if (!isPending) {
      await db.runAsync(
        `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
        [params.amount, now, params.fromAccountId],
      )
      await db.runAsync(
        `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
        [creditAmount, now, params.toAccountId],
      )
    }

    // Always write a transfers metadata row (replaces old is_transfer/transfer_id columns)
    const transferRowId = generateId()
    await db.runAsync(
      `INSERT INTO transfers (id, from_transaction_id, to_transaction_id, from_account_id, to_account_id, conversion_rate, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transferRowId,
        debitId,
        creditId,
        params.fromAccountId,
        params.toAccountId,
        params.conversionRate ?? 1,
        now,
        now,
      ],
    )

    return {
      txIds: [debitId, creditId],
      accountIds: [params.fromAccountId, params.toAccountId],
    }
  })

  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: affected.accountIds })
  emit("transfers:dirty", undefined)
}

// ── Edit ─────────────────────────────────────────────────────────────────────

export async function editTransfer(
  txId: string,
  fields: EditTransferFields,
): Promise<void> {
  const now = new Date().toISOString()
  let affectedAccountIds: string[] = []

  await runInTransaction("transfer.edit", async (db) => {
    const tx = await db.getFirstAsync<RowTransaction>(
      `SELECT * FROM transactions WHERE id = ?`,
      [txId],
    )
    if (!tx) throw new Error("Transfer transaction not found.")

    const partnerInfo = await getPartnerTxId(txId, db)
    if (!partnerInfo) throw new Error("Paired transfer leg not found.")

    const paired = await db.getFirstAsync<RowTransaction>(
      `SELECT * FROM transactions WHERE id = ? AND is_deleted = 0`,
      [partnerInfo.partnerId],
    )
    if (!paired) throw new Error("Paired transfer leg not found.")

    // Identify debit (amount < 0) and credit (amount > 0) legs
    const debitRow = tx.amount < 0 ? tx : paired
    const creditRow = tx.amount > 0 ? tx : paired

    if (debitRow === creditRow) {
      throw new Error("Could not identify debit/credit legs.")
    }

    const newFromAccountId = fields.fromAccountId ?? debitRow.account_id
    const newToAccountId = fields.toAccountId ?? creditRow.account_id
    const newDateMs = toDateMs(
      fields.transactionDate as number | Date | undefined,
      new Date(debitRow.transaction_date).getTime(),
    )
    const newDateIso = new Date(newDateMs).toISOString()

    const oldDebitAmount = Math.abs(debitRow.amount)
    const oldCreditAmount = creditRow.amount
    const newDebitAmount = fields.amount ?? oldDebitAmount
    const oldImpliedRate =
      oldDebitAmount > 0 ? oldCreditAmount / oldDebitAmount : 1
    const newConversionRate = fields.conversionRate ?? oldImpliedRate
    const newCreditAmount =
      newConversionRate > 0
        ? newDebitAmount * newConversionRate
        : newDebitAmount

    const fromChanged = newFromAccountId !== debitRow.account_id
    const toChanged = newToAccountId !== creditRow.account_id

    // accountBalanceBefore recalculation
    const fromBalanceBefore = fromChanged
      ? ((
          await db.getFirstAsync<{ balance: number }>(
            `SELECT balance FROM accounts WHERE id = ?`,
            [newFromAccountId],
          )
        )?.balance ?? 0)
      : ((
          await db.getFirstAsync<{ balance: number }>(
            `SELECT balance FROM accounts WHERE id = ?`,
            [debitRow.account_id],
          )
        )?.balance ?? 0) + oldDebitAmount
    const toBalanceBefore = toChanged
      ? ((
          await db.getFirstAsync<{ balance: number }>(
            `SELECT balance FROM accounts WHERE id = ?`,
            [newToAccountId],
          )
        )?.balance ?? 0)
      : ((
          await db.getFirstAsync<{ balance: number }>(
            `SELECT balance FROM accounts WHERE id = ?`,
            [creditRow.account_id],
          )
        )?.balance ?? 0) - oldCreditAmount

    await db.runAsync(
      `UPDATE transactions SET
        amount = ?, transaction_date = ?, account_id = ?,
        account_balance_before = ?,
        title = CASE WHEN ? THEN ? ELSE title END,
        description = CASE WHEN ? THEN ? ELSE description END,
        updated_at = ?
       WHERE id = ?`,
      [
        -newDebitAmount,
        newDateIso,
        newFromAccountId,
        fromBalanceBefore,
        fields.title !== undefined ? 1 : 0,
        fields.title ?? null,
        fields.notes !== undefined ? 1 : 0,
        fields.notes ?? null,
        now,
        debitRow.id,
      ],
    )

    await db.runAsync(
      `UPDATE transactions SET
        amount = ?, transaction_date = ?, account_id = ?,
        account_balance_before = ?,
        title = CASE WHEN ? THEN ? ELSE title END,
        description = CASE WHEN ? THEN ? ELSE description END,
        updated_at = ?
       WHERE id = ?`,
      [
        newCreditAmount,
        newDateIso,
        newToAccountId,
        toBalanceBefore,
        fields.title !== undefined ? 1 : 0,
        fields.title ?? null,
        fields.notes !== undefined ? 1 : 0,
        fields.notes ?? null,
        now,
        creditRow.id,
      ],
    )

    // Balance reconciliation (only if not pending)
    if (!debitRow.is_pending) {
      if (fromChanged) {
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [oldDebitAmount, now, debitRow.account_id],
        )
        await db.runAsync(
          `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
          [newDebitAmount, now, newFromAccountId],
        )
      } else {
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [oldDebitAmount - newDebitAmount, now, newFromAccountId],
        )
      }
    }

    if (!creditRow.is_pending) {
      if (toChanged) {
        await db.runAsync(
          `UPDATE accounts SET balance = balance - ?, updated_at = ? WHERE id = ?`,
          [oldCreditAmount, now, creditRow.account_id],
        )
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [newCreditAmount, now, newToAccountId],
        )
      } else {
        await db.runAsync(
          `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
          [newCreditAmount - oldCreditAmount, now, newToAccountId],
        )
      }
    }

    // Sync transfers metadata row
    const transfersRow = await getTransferRow(debitRow.id, db)
    if (transfersRow) {
      await db.runAsync(
        `UPDATE transfers SET
          conversion_rate = ?, from_account_id = ?, to_account_id = ?, updated_at = ?
         WHERE id = ?`,
        [
          newConversionRate > 0 ? newConversionRate : 1,
          newFromAccountId,
          newToAccountId,
          now,
          transfersRow.id,
        ],
      )
    } else {
      await db.runAsync(
        `INSERT INTO transfers (id, from_transaction_id, to_transaction_id, from_account_id, to_account_id, conversion_rate, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          debitRow.id,
          creditRow.id,
          newFromAccountId,
          newToAccountId,
          newConversionRate > 0 ? newConversionRate : 1,
          now,
          now,
        ],
      )
    }

    affectedAccountIds = [
      ...new Set([
        debitRow.account_id,
        creditRow.account_id,
        newFromAccountId,
        newToAccountId,
      ]),
    ]
  })

  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: affectedAccountIds })
  emit("transfers:dirty", undefined)
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteTransfer(txId: string): Promise<void> {
  let affectedAccountIds: string[] = []
  let txIds: string[] = []

  await runInTransaction("transfer.delete", async (db) => {
    const tx = await db.getFirstAsync<RowTransaction>(
      `SELECT * FROM transactions WHERE id = ?`,
      [txId],
    )
    if (!tx) throw new Error("Transfer transaction not found.")

    // Capture partner BEFORE deletion
    const partnerInfo = await getPartnerTxId(txId, db)
    let partnerAccountId: string | undefined
    if (partnerInfo) {
      const partnerTx = await db.getFirstAsync<{ account_id: string }>(
        `SELECT account_id FROM transactions WHERE id = ?`,
        [partnerInfo.partnerId],
      )
      partnerAccountId = partnerTx?.account_id
    }

    await deleteTransferById(txId, db)

    const partnerId = partnerInfo?.partnerId
    affectedAccountIds = [
      ...new Set([tx.account_id, partnerAccountId].filter(Boolean) as string[]),
    ]
    txIds = [txId, partnerId].filter(Boolean) as string[]
  })

  emit("transactions:dirty", { ids: txIds })
  emit("accounts:dirty", { ids: affectedAccountIds })
  emit("transfers:dirty", undefined)
}

export async function getConversionRateForTransaction(tx: {
  id: string
}): Promise<number | null> {
  return getConversionRate(tx.id)
}
