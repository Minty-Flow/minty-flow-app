import { eq, or, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  transactions,
  transactionTags,
  transfers,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type {
  CreateTransferParams,
  EditTransferFields,
} from "~/schemas/transactions.schema"
import type { TransactionType } from "~/types/transactions"
import {
  assertMinorUnits,
  convertMinorUnits,
  toMajorUnits,
} from "~/utils/money"

// ── Helpers ──────────────────────────────────────────────────────────────────

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

const txSelection = {
  id: transactions.id,
  account_id: transactions.accountId,
  category_id: transactions.categoryId,
  amount: transactions.amount,
  type: transactions.type,
  transaction_date: transactions.transactionDate,
  title: transactions.title,
  description: transactions.description,
  is_deleted: transactions.isDeleted,
  deleted_at: transactions.deletedAt,
  is_pending: transactions.isPending,
  requires_manual_confirmation: transactions.requiresManualConfirmation,
  account_balance_before: transactions.accountBalanceBefore,
  subtype: transactions.subtype,
  extra: transactions.extra,
  has_attachments: transactions.hasAttachments,
  recurring_id: transactions.recurringId,
  location: transactions.location,
  goal_id: transactions.goalId,
  budget_id: transactions.budgetId,
  loan_id: transactions.loanId,
  created_at: transactions.createdAt,
  updated_at: transactions.updatedAt,
}

function toDateMs(v: number | Date | undefined, fallback: number): number {
  if (v === undefined) return fallback
  return typeof v === "number" ? v : v.getTime()
}

/** Find the partner transaction id for a transfer leg via the transfers table. */
function getPartnerTxId(
  txId: string,
  db: Db,
): { partnerId: string; isDebit: boolean } | null {
  const row = db
    .select({
      fromTransactionId: transfers.fromTransactionId,
      toTransactionId: transfers.toTransactionId,
    })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, txId),
        eq(transfers.toTransactionId, txId),
      ),
    )
    .get()
  if (!row) return null
  if (row.fromTransactionId === txId) {
    return { partnerId: row.toTransactionId, isDebit: true }
  }
  return { partnerId: row.fromTransactionId, isDebit: false }
}

/** Fetch a transfer row keyed by either leg id. */
function getTransferRow(
  txId: string,
  db: Db,
): {
  id: string
  fromTransactionId: string
  toTransactionId: string
  fromAccountId: string
  toAccountId: string
  conversionRate: number
} | null {
  return (
    db
      .select()
      .from(transfers)
      .where(
        or(
          eq(transfers.fromTransactionId, txId),
          eq(transfers.toTransactionId, txId),
        ),
      )
      .get() ?? null
  )
}

function getTransferLegs(txId: string, db: Db): RowTransaction[] {
  const tx = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, txId))
    .get()
  if (!tx) return []

  const legs: RowTransaction[] = [tx]
  const partner = getPartnerTxId(txId, db)
  if (!partner) return legs

  const paired = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, partner.partnerId))
    .get()
  if (paired) legs.push(paired)
  return legs
}

async function getConversionRate(txId: string): Promise<number | null> {
  const row = drizzleDb
    .select({ conversionRate: transfers.conversionRate })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, txId),
        eq(transfers.toTransactionId, txId),
      ),
    )
    .get()
  if (row) return row.conversionRate
  return null
}

// ── Internal: delete both legs within an already-open transaction context ────

/**
 * Soft-delete both legs of a transfer within an existing transaction context.
 * Called by transaction-service.deleteTransaction when it detects a transfer.
 */
export function deleteTransferById(txId: string, db: Db): void {
  const now = new Date().toISOString()

  const tx = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, txId))
    .get()
  if (!tx) return

  const partner = getPartnerTxId(txId, db)

  const legs: RowTransaction[] = [tx]
  if (partner) {
    const paired = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.id, partner.partnerId))
      .get()
    if (paired) legs.push(paired)
  }

  for (const leg of legs) {
    if (!leg.is_deleted && !leg.is_pending) {
      db.update(accounts)
        .set({
          balance: sql`${accounts.balance} - ${leg.amount}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
    }
    db.update(transactions)
      .set({ isDeleted: 1, deletedAt: now, updatedAt: now })
      .where(eq(transactions.id, leg.id))
      .run()
  }
}

export function restoreTransferById(txId: string, db: Db): void {
  const now = new Date().toISOString()
  const legs = getTransferLegs(txId, db)

  for (const leg of legs) {
    if (!leg.is_deleted) continue

    if (!leg.is_pending) {
      const delta = getBalanceDelta(
        leg.amount,
        leg.type as TransactionType,
        leg.subtype,
      )
      const acc = db
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, leg.account_id))
        .get()
      const balanceBefore = acc?.balance ?? 0
      db.update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
      db.update(transactions)
        .set({
          isDeleted: 0,
          deletedAt: null,
          accountBalanceBefore: balanceBefore,
          updatedAt: now,
        })
        .where(eq(transactions.id, leg.id))
        .run()
    } else {
      db.update(transactions)
        .set({ isDeleted: 0, deletedAt: null, updatedAt: now })
        .where(eq(transactions.id, leg.id))
        .run()
    }
  }
}

export function destroyTransferById(txId: string, db: Db): void {
  const now = new Date().toISOString()
  const legs = getTransferLegs(txId, db)

  for (const leg of legs) {
    if (!leg.is_deleted && !leg.is_pending) {
      const delta = getBalanceDelta(
        leg.amount,
        leg.type as TransactionType,
        leg.subtype,
      )
      db.update(accounts)
        .set({
          balance: sql`${accounts.balance} - ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
    }
  }

  for (const leg of legs) {
    db.delete(transactionTags)
      .where(eq(transactionTags.transactionId, leg.id))
      .run()
    db.delete(transactions).where(eq(transactions.id, leg.id)).run()
  }
  db.delete(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, txId),
        eq(transfers.toTransactionId, txId),
      ),
    )
    .run()
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
  assertMinorUnits(params.amount)
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

  await runInTransaction("transfer.create", (db) => {
    const fromAcc = db
      .select({
        balance: accounts.balance,
        currencyCode: accounts.currencyCode,
      })
      .from(accounts)
      .where(eq(accounts.id, params.fromAccountId))
      .get()
    const toAcc = db
      .select({
        balance: accounts.balance,
        currencyCode: accounts.currencyCode,
      })
      .from(accounts)
      .where(eq(accounts.id, params.toAccountId))
      .get()

    if (!fromAcc || !toAcc) throw new Error("One or both accounts not found.")

    const isCrossCurrency = fromAcc.currencyCode !== toAcc.currencyCode
    const creditAmount =
      isCrossCurrency &&
      params.conversionRate != null &&
      params.conversionRate > 0
        ? convertMinorUnits(
            params.amount,
            fromAcc.currencyCode,
            toAcc.currencyCode,
            params.conversionRate,
          )
        : params.amount

    const debitBalanceBefore = fromAcc.balance
    const creditBalanceBefore = toAcc.balance

    // Debit leg: money leaves fromAccount (negative amount)
    db.insert(transactions)
      .values({
        id: debitId,
        accountId: params.fromAccountId,
        categoryId: null,
        amount: -params.amount,
        type: "transfer",
        transactionDate: dateIso,
        title,
        description: params.notes ?? null,
        isDeleted: 0,
        deletedAt: null,
        isPending: isPending ? 1 : 0,
        requiresManualConfirmation: 0,
        accountBalanceBefore: isPending ? 0 : debitBalanceBefore,
        subtype: recurringOptions?.subtype ?? null,
        extra: extraJson,
        hasAttachments: 0,
        recurringId: recurringOptions?.recurringId ?? null,
        location: null,
        goalId: null,
        budgetId: null,
        loanId: null,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    db.insert(transactions)
      .values({
        id: creditId,
        accountId: params.toAccountId,
        categoryId: null,
        amount: creditAmount,
        type: "transfer",
        transactionDate: dateIso,
        title,
        description: params.notes ?? null,
        isDeleted: 0,
        deletedAt: null,
        isPending: isPending ? 1 : 0,
        requiresManualConfirmation: 0,
        accountBalanceBefore: isPending ? 0 : creditBalanceBefore,
        subtype: recurringOptions?.subtype ?? null,
        extra: extraJson,
        hasAttachments: 0,
        recurringId: recurringOptions?.recurringId ?? null,
        location: null,
        goalId: null,
        budgetId: null,
        loanId: null,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    if (!isPending) {
      db.update(accounts)
        .set({
          balance: sql`${accounts.balance} - ${params.amount}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, params.fromAccountId))
        .run()
      db.update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${creditAmount}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, params.toAccountId))
        .run()
    }

    const transferRowId = generateId()
    db.insert(transfers)
      .values({
        id: transferRowId,
        fromTransactionId: debitId,
        toTransactionId: creditId,
        fromAccountId: params.fromAccountId,
        toAccountId: params.toAccountId,
        conversionRate: params.conversionRate ?? 1,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  })
}

// ── Edit ─────────────────────────────────────────────────────────────────────

export async function editTransfer(
  txId: string,
  fields: EditTransferFields,
): Promise<void> {
  if (fields.amount !== undefined) assertMinorUnits(fields.amount)
  const now = new Date().toISOString()

  await runInTransaction("transfer.edit", (db) => {
    const tx = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.id, txId))
      .get()
    if (!tx) throw new Error("Transfer transaction not found.")

    const partnerInfo = getPartnerTxId(txId, db)
    if (!partnerInfo) throw new Error("Paired transfer leg not found.")

    const paired = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.id, partnerInfo.partnerId))
      .get()
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
    const newFromAccount = db
      .select({ currencyCode: accounts.currencyCode })
      .from(accounts)
      .where(eq(accounts.id, newFromAccountId))
      .get()
    const newToAccount = db
      .select({ currencyCode: accounts.currencyCode })
      .from(accounts)
      .where(eq(accounts.id, newToAccountId))
      .get()
    const oldFromAccount = db
      .select({ currencyCode: accounts.currencyCode })
      .from(accounts)
      .where(eq(accounts.id, debitRow.account_id))
      .get()
    const oldToAccount = db
      .select({ currencyCode: accounts.currencyCode })
      .from(accounts)
      .where(eq(accounts.id, creditRow.account_id))
      .get()
    if (!newFromAccount || !newToAccount || !oldFromAccount || !oldToAccount) {
      throw new Error("One or both accounts not found.")
    }
    const oldImpliedRate =
      oldDebitAmount > 0
        ? toMajorUnits(oldCreditAmount, oldToAccount.currencyCode) /
          toMajorUnits(oldDebitAmount, oldFromAccount.currencyCode)
        : 1
    const newConversionRate = fields.conversionRate ?? oldImpliedRate
    const newCreditAmount =
      newConversionRate > 0
        ? convertMinorUnits(
            newDebitAmount,
            newFromAccount.currencyCode,
            newToAccount.currencyCode,
            newConversionRate,
          )
        : newDebitAmount

    const fromChanged = newFromAccountId !== debitRow.account_id
    const toChanged = newToAccountId !== creditRow.account_id

    // accountBalanceBefore recalculation
    const currentFromBalance =
      db
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(
          eq(accounts.id, fromChanged ? newFromAccountId : debitRow.account_id),
        )
        .get()?.balance ?? 0
    const fromBalanceBefore = fromChanged
      ? currentFromBalance
      : currentFromBalance + oldDebitAmount
    const toBalanceBefore = toChanged
      ? (db
          .select({ balance: accounts.balance })
          .from(accounts)
          .where(eq(accounts.id, newToAccountId))
          .get()?.balance ?? 0)
      : (db
          .select({ balance: accounts.balance })
          .from(accounts)
          .where(eq(accounts.id, creditRow.account_id))
          .get()?.balance ?? 0) - oldCreditAmount

    db.update(transactions)
      .set({
        amount: -newDebitAmount,
        transactionDate: newDateIso,
        accountId: newFromAccountId,
        accountBalanceBefore: fromBalanceBefore,
        ...(fields.title !== undefined ? { title: fields.title ?? null } : {}),
        ...(fields.notes !== undefined
          ? { description: fields.notes ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(transactions.id, debitRow.id))
      .run()

    db.update(transactions)
      .set({
        amount: newCreditAmount,
        transactionDate: newDateIso,
        accountId: newToAccountId,
        accountBalanceBefore: toBalanceBefore,
        ...(fields.title !== undefined ? { title: fields.title ?? null } : {}),
        ...(fields.notes !== undefined
          ? { description: fields.notes ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(transactions.id, creditRow.id))
      .run()

    // Balance reconciliation (only if not pending)
    if (!debitRow.is_pending) {
      if (fromChanged) {
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${oldDebitAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, debitRow.account_id))
          .run()
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${newDebitAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newFromAccountId))
          .run()
      } else {
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${oldDebitAmount - newDebitAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newFromAccountId))
          .run()
      }
    }

    if (!creditRow.is_pending) {
      if (toChanged) {
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${oldCreditAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, creditRow.account_id))
          .run()
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${newCreditAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newToAccountId))
          .run()
      } else {
        db.update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${newCreditAmount - oldCreditAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newToAccountId))
          .run()
      }
    }

    const transfersRow = getTransferRow(debitRow.id, db)
    if (transfersRow) {
      db.update(transfers)
        .set({
          conversionRate: newConversionRate > 0 ? newConversionRate : 1,
          fromAccountId: newFromAccountId,
          toAccountId: newToAccountId,
          updatedAt: now,
        })
        .where(eq(transfers.id, transfersRow.id))
        .run()
    } else {
      db.insert(transfers)
        .values({
          id: generateId(),
          fromTransactionId: debitRow.id,
          toTransactionId: creditRow.id,
          fromAccountId: newFromAccountId,
          toAccountId: newToAccountId,
          conversionRate: newConversionRate > 0 ? newConversionRate : 1,
          createdAt: now,
          updatedAt: now,
        })
        .run()
    }
  })
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteTransfer(txId: string): Promise<void> {
  await runInTransaction("transfer.delete", (db) => {
    const tx = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.id, txId))
      .get()
    if (!tx) throw new Error("Transfer transaction not found.")

    deleteTransferById(txId, db)
  })
}

export async function getConversionRateForTransaction(tx: {
  id: string
}): Promise<number | null> {
  return getConversionRate(tx.id)
}
