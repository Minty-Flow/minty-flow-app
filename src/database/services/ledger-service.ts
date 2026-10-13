import { startOfDay, subDays } from "date-fns"
import { and, sql as drizzleSql, eq, gte, inArray, lt, or } from "drizzle-orm"

import { getTrashRetentionDays } from "~/constants/trash-retention"
import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  transactions,
  transactionTags,
  transfers,
} from "~/database/drizzle/schema"
import { type DbTransaction, runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import { hasAttachmentsFromExtra } from "~/database/utils/has-attachments-from-extra"
import type {
  CreateTransferParams,
  EditTransferFields,
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type { TransactionKind, TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"
import {
  assertMinorUnits,
  convertMinorUnits,
  toMajorUnits,
} from "~/utils/money"

// CSI-2: a pending transaction may only carry a kind that represents a
// legitimately un-applied state. Anything else is a form/caller bug.
function assertPendingKindAllowed(isPending: boolean, kind: string): void {
  if (
    isPending &&
    kind !== "upcoming" &&
    kind !== "subscription" &&
    kind !== "repetitive"
  ) {
    const msg = `Refusing to persist pending transaction with kind='${kind}'`
    if (__DEV__) throw new Error(msg)
    logger.error(msg, { kind })
  }
}

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
  kind: transactions.kind,
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

function requireTx(db: Db, id: string): RowTransaction {
  const row = db
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.id, id))
    .get()
  if (!row) throw new Error(`Transaction ${id} not found`)
  return row
}

function getTagIdsForTx(db: Db, txId: string): string[] {
  return db
    .select({ tagId: transactionTags.tagId })
    .from(transactionTags)
    .where(eq(transactionTags.transactionId, txId))
    .all()
    .map((r) => r.tagId)
}

function toDateMs(v: number | Date | undefined, fallback: number): number {
  if (v === undefined) return fallback
  return typeof v === "number" ? v : v.getTime()
}

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

function deleteTransferById(txId: string, db: Db): void {
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
          balance: drizzleSql`${accounts.balance} - ${delta}`,
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

function restoreTransferById(txId: string, db: Db): void {
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
          balance: drizzleSql`${accounts.balance} + ${delta}`,
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

function destroyTransferById(txId: string, db: Db): void {
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
          balance: drizzleSql`${accounts.balance} - ${delta}`,
          updatedAt: new Date().toISOString(),
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

/**
 * Insert a transaction and apply its balance delta inside an open database
 * transaction, so a caller can make it part of a larger all-or-nothing write.
 */
export function createTransactionInTx(
  db: DbTransaction,
  data: TransactionFormValues,
): string {
  assertMinorUnits(data.amount)
  const id = generateId()
  const now = new Date().toISOString()
  const extra = data.extra ?? null
  const extraJson = extra ? JSON.stringify(extra) : null
  const hasAttachments = hasAttachmentsFromExtra(extra) ? 1 : 0

  const kind = data.kind ?? "default"
  assertPendingKindAllowed(!!data.isPending, kind)

  const balanceBefore = data.isPending
    ? 0
    : (db
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, data.accountId))
        .get()?.balance ?? 0)

  db.insert(transactions)
    .values({
      id,
      accountId: data.accountId,
      categoryId: data.categoryId ?? null,
      amount: data.amount,
      type: data.type,
      transactionDate: data.transactionDate.toISOString(),
      title: data.title ?? null,
      description: data.description ?? null,
      isDeleted: 0,
      deletedAt: null,
      isPending: data.isPending ? 1 : 0,
      requiresManualConfirmation: data.requiresManualConfirmation ? 1 : 0,
      accountBalanceBefore: balanceBefore,
      subtype: data.subtype ?? null,
      kind,
      extra: extraJson,
      hasAttachments,
      recurringId: data.recurringId ?? null,
      location: data.location ?? null,
      goalId: data.goalId ?? null,
      budgetId: data.budgetId ?? null,
      loanId: data.loanId ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  if (!data.isPending) {
    const delta = getBalanceDelta(data.amount, data.type, data.subtype)
    if (delta !== 0) {
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} + ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, data.accountId))
        .run()
    }
  }

  if (data.tags?.length) {
    db.insert(transactionTags)
      .values(data.tags.map((tagId) => ({ transactionId: id, tagId })))
      .onConflictDoNothing()
      .run()
  }

  return id
}

export async function createTransaction(
  data: TransactionFormValues,
): Promise<string> {
  return runInTransaction("transaction.create", (db) =>
    createTransactionInTx(db, data),
  )
}

type TransferRecurringOptions = {
  recurringId: string
  isPending: boolean
  subtype?: string | null
  extra?: Record<string, string> | null
  kind?: TransactionKind
}

/**
 * Insert a transfer (both legs and the link) and move both balances inside an
 * open database transaction, so a caller can make it part of a larger
 * all-or-nothing write.
 */
export function createTransferInTx(
  db: DbTransaction,
  params: CreateTransferParams,
  recurringOptions?: TransferRecurringOptions,
): void {
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

  const creditAmount =
    fromAcc.currencyCode !== toAcc.currencyCode &&
    params.conversionRate != null &&
    params.conversionRate > 0
      ? convertMinorUnits(
          params.amount,
          fromAcc.currencyCode,
          toAcc.currencyCode,
          params.conversionRate,
        )
      : params.amount

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
      accountBalanceBefore: isPending ? 0 : fromAcc.balance,
      subtype: recurringOptions?.subtype ?? null,
      // transfers are pending+default by design (migration 0001 & deriveKind exclude type='transfer' from 'upcoming') — CSI-2 assert intentionally not applied here
      kind: recurringOptions?.kind ?? "default",
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
      accountBalanceBefore: isPending ? 0 : toAcc.balance,
      subtype: recurringOptions?.subtype ?? null,
      kind: recurringOptions?.kind ?? "default",
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
        balance: drizzleSql`${accounts.balance} - ${params.amount}`,
        updatedAt: now,
      })
      .where(eq(accounts.id, params.fromAccountId))
      .run()
    db.update(accounts)
      .set({
        balance: drizzleSql`${accounts.balance} + ${creditAmount}`,
        updatedAt: now,
      })
      .where(eq(accounts.id, params.toAccountId))
      .run()
  }

  db.insert(transfers)
    .values({
      id: generateId(),
      fromTransactionId: debitId,
      toTransactionId: creditId,
      fromAccountId: params.fromAccountId,
      toAccountId: params.toAccountId,
      conversionRate: params.conversionRate ?? 1,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

export async function createTransfer(
  params: CreateTransferParams,
  recurringOptions?: TransferRecurringOptions,
): Promise<void> {
  await runInTransaction("transfer.create", (db) =>
    createTransferInTx(db, params, recurringOptions),
  )
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateTransaction(
  id: string,
  data: Partial<TransactionFormValues>,
): Promise<void> {
  if (data.amount !== undefined) assertMinorUnits(data.amount)
  await runInTransaction("transaction.update", (db) =>
    updateTransactionInTx(db, id, data),
  )
}

function updateTransactionInTx(
  db: DbTransaction,
  id: string,
  data: Partial<TransactionFormValues>,
): void {
  const now = new Date().toISOString()

  const tx = requireTx(db, id)
  // A trashed row is not part of any balance; editing it would move one.
  if (tx.is_deleted) throw new Error(`Transaction ${id} is in the trash`)

  const oldPending = !!tx.is_pending
  const oldAmount = tx.amount
  const oldType = tx.type
  const oldSubtype = tx.subtype
  const oldAccountId = tx.account_id
  const oldCategoryId = tx.category_id

  // ES-5: a loan-linked row's kind / type / account / loan link are locked.
  // The form disables these fields; this is defence in depth — silently keep
  // the stored value rather than throwing.
  const isLoanLinked = tx.loan_id != null
  const nextKind =
    data.kind !== undefined && !isLoanLinked
      ? data.kind
      : (tx.kind ?? "default")

  const newPending = data.isPending !== undefined ? data.isPending : oldPending
  const newAmount = data.amount !== undefined ? data.amount : oldAmount
  const newType = data.type !== undefined && !isLoanLinked ? data.type : oldType
  const newSubtype =
    data.subtype !== undefined ? (data.subtype ?? null) : oldSubtype
  const newAccountId =
    data.accountId !== undefined && !isLoanLinked
      ? data.accountId
      : oldAccountId
  const newCategoryId =
    data.categoryId !== undefined ? data.categoryId : oldCategoryId

  assertPendingKindAllowed(newPending, nextKind)

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
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} + ${diff}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, oldAccountId))
        .run()
    }
  } else {
    if (oldDelta !== 0) {
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} - ${oldDelta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, oldAccountId))
        .run()
    }
    if (newDelta !== 0) {
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} + ${newDelta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, newAccountId))
        .run()
    }
  }

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
    const acc = db
      .select({ balance: accounts.balance })
      .from(accounts)
      .where(eq(accounts.id, targetAccountId))
      .get()
    newBalanceBefore = (acc?.balance ?? 0) - newDelta
  } else if (!oldPending && newAccountId !== oldAccountId) {
    // Account changed while confirmed: snapshot new account's pre-transfer balance.
    const acc = db
      .select({ balance: accounts.balance })
      .from(accounts)
      .where(eq(accounts.id, newAccountId))
      .get()
    newBalanceBefore = (acc?.balance ?? 0) - newDelta
  }

  // -- Tag sync --
  if (data.tags !== undefined) {
    const existingTagIds = getTagIdsForTx(db, id)
    const existingSet = new Set(existingTagIds)
    const newSet = new Set(data.tags)

    const tagIdsToDelete = existingTagIds.filter((tagId) => !newSet.has(tagId))
    if (tagIdsToDelete.length) {
      db.delete(transactionTags)
        .where(
          and(
            eq(transactionTags.transactionId, id),
            inArray(transactionTags.tagId, tagIdsToDelete),
          ),
        )
        .run()
    }
    const tagIdsToInsert = data.tags.filter((tagId) => !existingSet.has(tagId))
    if (tagIdsToInsert.length) {
      db.insert(transactionTags)
        .values(tagIdsToInsert.map((tagId) => ({ transactionId: id, tagId })))
        .onConflictDoNothing()
        .run()
    }
  }

  // -- Transaction row update --
  const extra = data.extra !== undefined ? (data.extra ?? null) : null
  const extraJson =
    data.extra !== undefined ? (extra ? JSON.stringify(extra) : null) : null

  db.update(transactions)
    .set({
      ...(data.amount !== undefined ? { amount: data.amount } : {}),
      ...(data.type !== undefined && !isLoanLinked ? { type: data.type } : {}),
      kind: nextKind,
      ...(data.transactionDate !== undefined
        ? { transactionDate: data.transactionDate.toISOString() }
        : {}),
      ...(data.title !== undefined ? { title: data.title ?? null } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      ...(data.isPending !== undefined
        ? { isPending: data.isPending ? 1 : 0 }
        : {}),
      ...(data.requiresManualConfirmation !== undefined
        ? {
            requiresManualConfirmation: data.requiresManualConfirmation ? 1 : 0,
          }
        : {}),
      ...(data.categoryId !== undefined
        ? { categoryId: newCategoryId ?? null }
        : {}),
      ...(data.accountId !== undefined && !isLoanLinked
        ? { accountId: data.accountId }
        : {}),
      accountBalanceBefore: newBalanceBefore,
      ...(data.extra !== undefined
        ? {
            extra: extraJson ?? null,
            hasAttachments: hasAttachmentsFromExtra(data.extra ?? null) ? 1 : 0,
          }
        : {}),
      ...(data.subtype !== undefined ? { subtype: data.subtype ?? null } : {}),
      ...(data.location !== undefined
        ? { location: data.location ?? null }
        : {}),
      ...(data.recurringId !== undefined
        ? { recurringId: data.recurringId ?? null }
        : {}),
      ...(data.goalId !== undefined ? { goalId: data.goalId ?? null } : {}),
      ...(data.budgetId !== undefined
        ? { budgetId: data.budgetId ?? null }
        : {}),
      ...(data.loanId !== undefined && !isLoanLinked
        ? { loanId: data.loanId ?? null }
        : {}),
      updatedAt: now,
    })
    .where(eq(transactions.id, id))
    .run()
}

export async function editTransfer(
  txId: string,
  fields: EditTransferFields,
): Promise<void> {
  if (fields.amount !== undefined) assertMinorUnits(fields.amount)
  const now = new Date().toISOString()

  await runInTransaction("transfer.edit", (db) => {
    const tx = requireTx(db, txId)
    const partnerInfo = getPartnerTxId(txId, db)
    if (!partnerInfo) throw new Error("Paired transfer leg not found.")

    const paired = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.id, partnerInfo.partnerId))
      .get()
    if (!paired) throw new Error("Paired transfer leg not found.")
    if (tx.is_deleted || paired.is_deleted) {
      throw new Error(`Transfer ${txId} is in the trash`)
    }

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

    if (!debitRow.is_pending) {
      if (fromChanged) {
        db.update(accounts)
          .set({
            balance: drizzleSql`${accounts.balance} + ${oldDebitAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, debitRow.account_id))
          .run()
        db.update(accounts)
          .set({
            balance: drizzleSql`${accounts.balance} - ${newDebitAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newFromAccountId))
          .run()
      } else {
        db.update(accounts)
          .set({
            balance: drizzleSql`${accounts.balance} + ${oldDebitAmount - newDebitAmount}`,
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
            balance: drizzleSql`${accounts.balance} - ${oldCreditAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, creditRow.account_id))
          .run()
        db.update(accounts)
          .set({
            balance: drizzleSql`${accounts.balance} + ${newCreditAmount}`,
            updatedAt: now,
          })
          .where(eq(accounts.id, newToAccountId))
          .run()
      } else {
        db.update(accounts)
          .set({
            balance: drizzleSql`${accounts.balance} + ${newCreditAmount - oldCreditAmount}`,
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

// ── Soft Delete ───────────────────────────────────────────────────────────────

export async function deleteTransaction(id: string): Promise<void> {
  await runInTransaction("transaction.delete", (db) =>
    deleteTransactionInTx(db, id),
  )
}

function deleteTransactionInTx(db: DbTransaction, id: string): void {
  const now = new Date().toISOString()

  const tx = requireTx(db, id)
  if (tx.is_deleted) return

  const transferPartner = db
    .select({ id: transfers.id })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, id),
        eq(transfers.toTransactionId, id),
      ),
    )
    .get()
  if (transferPartner) {
    deleteTransferById(tx.id, db)
    return
  }

  if (!tx.is_pending) {
    const delta = getBalanceDelta(
      tx.amount,
      tx.type as TransactionType,
      tx.subtype,
    )
    db.update(accounts)
      .set({
        balance: drizzleSql`${accounts.balance} - ${delta}`,
        updatedAt: now,
      })
      .where(eq(accounts.id, tx.account_id))
      .run()
  }

  db.update(transactions)
    .set({ isDeleted: 1, deletedAt: now, updatedAt: now })
    .where(eq(transactions.id, id))
    .run()
}

export async function deleteTransfer(txId: string): Promise<void> {
  await runInTransaction("transfer.delete", (db) => {
    requireTx(db, txId)
    deleteTransferById(txId, db)
  })
}

// ── Restore ───────────────────────────────────────────────────────────────────

export async function restoreTransaction(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("transaction.restore", (db) => {
    const tx = requireTx(db, id)

    const transferPartner = db
      .select({ id: transfers.id })
      .from(transfers)
      .where(
        or(
          eq(transfers.fromTransactionId, id),
          eq(transfers.toTransactionId, id),
        ),
      )
      .get()
    if (transferPartner) {
      restoreTransferById(tx.id, db)
      return
    }

    if (!tx.is_deleted) return

    db.update(transactions)
      .set({ isDeleted: 0, deletedAt: null, updatedAt: now })
      .where(eq(transactions.id, id))
      .run()

    if (!tx.is_pending) {
      const delta = getBalanceDelta(
        tx.amount,
        tx.type as TransactionType,
        tx.subtype,
      )
      // Refresh balance_before snapshot then apply delta
      const acc = db
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(accounts.id, tx.account_id))
        .get()
      const balanceBefore = acc?.balance ?? 0
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} + ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, tx.account_id))
        .run()
      db.update(transactions)
        .set({ accountBalanceBefore: balanceBefore })
        .where(eq(transactions.id, id))
        .run()
    }
  })
}

// ── Permanent Destroy ─────────────────────────────────────────────────────────

export async function destroyTransaction(id: string): Promise<void> {
  await runInTransaction("transaction.destroy", (db) =>
    destroyTransactionInTx(db, id),
  )
}

function destroyTransactionInTx(db: DbTransaction, id: string): void {
  const now = new Date().toISOString()

  const tx = requireTx(db, id)

  const transferPartner = db
    .select({ id: transfers.id })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, id),
        eq(transfers.toTransactionId, id),
      ),
    )
    .get()
  if (transferPartner) {
    destroyTransferById(tx.id, db)
    return
  }

  if (!tx.is_deleted) {
    if (!tx.is_pending) {
      const delta = getBalanceDelta(
        tx.amount,
        tx.type as TransactionType,
        tx.subtype,
      )
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} - ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, tx.account_id))
        .run()
    }
  }

  db.delete(transactionTags).where(eq(transactionTags.transactionId, id)).run()

  if (tx.type === "transfer") {
    db.delete(transfers)
      .where(
        or(
          eq(transfers.fromTransactionId, id),
          eq(transfers.toTransactionId, id),
        ),
      )
      .run()
  }

  db.delete(transactions).where(eq(transactions.id, id)).run()
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
  await runInTransaction("transaction.confirm", (db) =>
    confirmTransactionInTx(db, id, options),
  )
}

/** Confirm (or hold) many transactions in one commit, so live queries fire once. */
export async function confirmTransactions(
  ids: string[],
  options: ConfirmOptions,
): Promise<void> {
  if (ids.length === 0) return
  await runInTransaction("transaction.confirmMany", (db) => {
    for (const id of ids) confirmTransactionInTx(db, id, options)
  })
}

function confirmTransactionInTx(
  db: DbTransaction,
  id: string,
  options: ConfirmOptions,
): void {
  const shouldConfirm = options.confirm !== false
  const now = new Date().toISOString()

  const tx = requireTx(db, id)

  // A trashed row never touches a balance, however it is asked to move.
  if (tx.is_deleted) return
  if (shouldConfirm && !tx.is_pending) return
  if (!shouldConfirm && tx.is_pending) return

  // Collect both legs for transfers
  const legs: RowTransaction[] = [tx]
  const transferRow = db
    .select({
      fromTransactionId: transfers.fromTransactionId,
      toTransactionId: transfers.toTransactionId,
    })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, id),
        eq(transfers.toTransactionId, id),
      ),
    )
    .get()
  if (transferRow) {
    const partnerId =
      transferRow.fromTransactionId === id
        ? transferRow.toTransactionId
        : transferRow.fromTransactionId
    const pair = db
      .select(txSelection)
      .from(transactions)
      .where(and(eq(transactions.id, partnerId), eq(transactions.isDeleted, 0)))
      .get()
    if (pair) {
      if (shouldConfirm && pair.is_pending) legs.push(pair)
      if (!shouldConfirm && !pair.is_pending) legs.push(pair)
    }
  }

  const accountIds = [...new Set(legs.map((l) => l.account_id))]

  if (shouldConfirm) {
    const balances = db
      .select({ id: accounts.id, balance: accounts.balance })
      .from(accounts)
      .where(inArray(accounts.id, accountIds))
      .all()
    const balanceByAccountId = new Map(
      balances.map((row) => [row.id, row.balance]),
    )
    const deltas = legs.map((leg) => ({
      leg,
      delta: getBalanceDelta(
        leg.amount,
        leg.type as TransactionType,
        leg.subtype,
      ),
    }))

    for (const { leg, delta } of deltas) {
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} + ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
      db.update(transactions)
        .set({
          isPending: 0,
          kind: leg.kind === "upcoming" ? "default" : leg.kind,
          accountBalanceBefore: balanceByAccountId.get(leg.account_id) ?? 0,
          ...(options.updateTransactionDate ? { transactionDate: now } : {}),
          updatedAt: now,
        })
        .where(eq(transactions.id, leg.id))
        .run()
    }
  } else {
    for (const leg of legs) {
      const delta = getBalanceDelta(
        leg.amount,
        leg.type as TransactionType,
        leg.subtype,
      )
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} - ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
      db.update(transactions)
        .set({
          isPending: 1,
          // Mirror the confirm branch in reverse: a re-pended default leg
          // that isn't a transfer or recurring instance goes back to
          // 'upcoming' so it never lands in the CSI-2-forbidden
          // kind='default' && is_pending=1 state.
          ...(leg.kind === "default" &&
          leg.type !== "transfer" &&
          leg.recurring_id == null
            ? { kind: "upcoming" }
            : {}),
          accountBalanceBefore: 0,
          updatedAt: now,
        })
        .where(eq(transactions.id, leg.id))
        .run()
    }
  }
}

// ── Recurring scope helpers ───────────────────────────────────────────────────

/** Live (non-deleted) transactions of a recurring rule, optionally from a date / pending only. */
function getRuleInstanceIds(
  ruleId: string,
  opts: { fromDate?: Date; pendingOnly?: boolean } = {},
): string[] {
  return drizzleDb
    .select({ id: transactions.id })
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        opts.fromDate
          ? gte(transactions.transactionDate, opts.fromDate.toISOString())
          : undefined,
        opts.pendingOnly ? eq(transactions.isPending, 1) : undefined,
        eq(transactions.isDeleted, 0),
      ),
    )
    .all()
    .map((row) => row.id)
}

export async function deleteAllRecurringInstances(
  ruleId: string,
): Promise<void> {
  const ids = getRuleInstanceIds(ruleId)
  await runInTransaction("recurring.deleteAll", (db) => {
    for (const id of ids) deleteTransactionInTx(db, id)
  })
}

export async function deleteFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
): Promise<void> {
  const ids = getRuleInstanceIds(ruleId, { fromDate })
  await runInTransaction("recurring.deleteFuture", (db) => {
    for (const id of ids) deleteTransactionInTx(db, id)
  })
}

export async function detachFromRule(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("transaction.detach", (db) => {
    db.update(transactions)
      .set({ recurringId: null, updatedAt: now })
      .where(eq(transactions.id, id))
      .run()
  })
}

/**
 * Apply the edited fields to every pending instance of a rule from `fromDate`
 * on. Each instance keeps its own date; `dateShiftMs` moves all of them by the
 * same amount when the user changed the edited instance's date.
 *
 * Instances stay pending: `isPending` belongs to the edited instance, and
 * copying it would confirm future instances early. The manual-confirmation
 * flag is copied only when `applyManualConfirmation` is set.
 */
export async function updateFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
  payload: Omit<RecurringEditPayload, "transactionDate" | "isPending">,
  { dateShiftMs = 0, applyManualConfirmation = false } = {},
): Promise<void> {
  const rows = drizzleDb
    .select({
      id: transactions.id,
      transactionDate: transactions.transactionDate,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        gte(transactions.transactionDate, fromDate.toISOString()),
        eq(transactions.isPending, 1),
        eq(transactions.isDeleted, 0),
      ),
    )
    .all()
  if (payload.amount !== undefined) assertMinorUnits(payload.amount)
  await runInTransaction("recurring.updateFuture", (db) => {
    for (const { id, transactionDate } of rows) {
      updateTransactionInTx(db, id, {
        amount: payload.amount,
        type: payload.type,
        transactionDate:
          dateShiftMs === 0
            ? undefined
            : new Date(new Date(transactionDate).getTime() + dateShiftMs),
        categoryId: payload.categoryId,
        accountId: payload.accountId,
        title: payload.title,
        description: payload.description,
        requiresManualConfirmation: applyManualConfirmation
          ? payload.requiresManualConfirmation
          : undefined,
        tags: payload.tags,
        extra: payload.extra,
        subtype: payload.subtype,
      })
    }
  })
}

// ── Trash helpers ─────────────────────────────────────────────────────────────

/**
 * Destroying one leg of a transfer hard-deletes both, so in a batch the second
 * leg's id may already be gone. Skip it instead of failing the whole batch.
 */
function destroyTransactionIfPresent(db: DbTransaction, id: string): void {
  const exists = db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.id, id))
    .get()
  if (exists) destroyTransactionInTx(db, id)
}

export async function destroyAllDeletedTransactions(): Promise<void> {
  const deleted = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.isDeleted, 1))
    .all()
  await runInTransaction("trash.destroyAll", (db) => {
    for (const tx of deleted) destroyTransactionIfPresent(db, tx.id)
  })
}

export async function autoPurgeTrash(retentionValue: string): Promise<void> {
  const days = getTrashRetentionDays(retentionValue)
  if (days === null) return

  const cutoff = startOfDay(subDays(new Date(), days)).toISOString()

  const toPurge = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(
      and(eq(transactions.isDeleted, 1), lt(transactions.deletedAt, cutoff)),
    )
    .all()

  try {
    await runInTransaction("trash.autoPurge", (db) => {
      for (const tx of toPurge) destroyTransactionIfPresent(db, tx.id)
    })
    return
  } catch (err) {
    logger.error("[autoPurgeTrash] batch failed, retrying row by row", {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  // One bad row rolled the batch back; isolate it so the rest still purge.
  for (const tx of toPurge) {
    try {
      await runInTransaction("trash.autoPurgeRow", (db) =>
        destroyTransactionIfPresent(db, tx.id),
      )
    } catch (err) {
      logger.error("[autoPurgeTrash] failed to destroy transaction", {
        id: tx.id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

export async function getConversionRateForTransaction(tx: {
  id: string
}): Promise<number | null> {
  const row = drizzleDb
    .select({ conversionRate: transfers.conversionRate })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, tx.id),
        eq(transfers.toTransactionId, tx.id),
      ),
    )
    .get()
  return row?.conversionRate ?? null
}
