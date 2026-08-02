import { startOfDay, subDays } from "date-fns"
import { and, sql as drizzleSql, eq, gte, inArray, lt, or } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  getTransactionById as getTransactionByIdFromReadModel,
  type TransactionWithRelations,
} from "~/database/drizzle/read-models/transaction-read-model"
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
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type { TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"
import {
  assertMinorUnits,
  convertMinorUnits,
  toMajorUnits,
} from "~/utils/money"

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

export async function createTransaction(
  data: TransactionFormValues,
): Promise<string> {
  assertMinorUnits(data.amount)
  const id = generateId()
  const now = new Date().toISOString()
  const extra = data.extra ?? null
  const extraJson = extra ? JSON.stringify(extra) : null
  const hasAttachments = hasAttachmentsFromExtra(extra) ? 1 : 0

  const txId = await runInTransaction("transaction.create", (db) => {
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
  })

  return txId
}

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
  })
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateTransaction(
  id: string,
  data: Partial<TransactionFormValues>,
): Promise<void> {
  if (data.amount !== undefined) assertMinorUnits(data.amount)
  const now = new Date().toISOString()

  await runInTransaction("transaction.update", (db) => {
    const tx = requireTx(db, id)

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

      const tagIdsToDelete = existingTagIds.filter(
        (tagId) => !newSet.has(tagId),
      )
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
      const tagIdsToInsert = data.tags.filter(
        (tagId) => !existingSet.has(tagId),
      )
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
        ...(data.type !== undefined ? { type: data.type } : {}),
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
              requiresManualConfirmation: data.requiresManualConfirmation
                ? 1
                : 0,
            }
          : {}),
        ...(data.categoryId !== undefined
          ? { categoryId: newCategoryId ?? null }
          : {}),
        ...(data.accountId !== undefined ? { accountId: data.accountId } : {}),
        accountBalanceBefore: newBalanceBefore,
        ...(data.extra !== undefined
          ? {
              extra: extraJson ?? null,
              hasAttachments: hasAttachmentsFromExtra(data.extra ?? null)
                ? 1
                : 0,
            }
          : {}),
        ...(data.subtype !== undefined
          ? { subtype: data.subtype ?? null }
          : {}),
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
        ...(data.loanId !== undefined ? { loanId: data.loanId ?? null } : {}),
        updatedAt: now,
      })
      .where(eq(transactions.id, id))
      .run()
  })
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
  const now = new Date().toISOString()

  await runInTransaction("transaction.delete", (db) => {
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
  })
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
  const now = new Date().toISOString()

  await runInTransaction("transaction.destroy", (db) => {
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

    db.delete(transactionTags)
      .where(eq(transactionTags.transactionId, id))
      .run()

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
  })
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

  await runInTransaction("transaction.confirm", (db) => {
    const tx = requireTx(db, id)

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
        .where(
          and(eq(transactions.id, partnerId), eq(transactions.isDeleted, 0)),
        )
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
          .set({ isPending: 1, accountBalanceBefore: 0, updatedAt: now })
          .where(eq(transactions.id, leg.id))
          .run()
      }
    }
  })
}

// ── Recurring scope helpers ───────────────────────────────────────────────────

export async function deleteAllRecurringInstances(
  ruleId: string,
): Promise<void> {
  const instances = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(
      and(eq(transactions.recurringId, ruleId), eq(transactions.isDeleted, 0)),
    )
    .all()
  for (const tx of instances) {
    await deleteTransaction(tx.id)
  }
}

export async function deleteFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
): Promise<void> {
  const instances = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        gte(transactions.transactionDate, fromDate.toISOString()),
        eq(transactions.isDeleted, 0),
      ),
    )
    .all()
  for (const tx of instances) {
    await deleteTransaction(tx.id)
  }
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

export async function updateFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
  payload: RecurringEditPayload,
): Promise<void> {
  const instances = drizzleDb
    .select(txSelection)
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
  const deleted = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(eq(transactions.isDeleted, 1))
    .all()
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

  const toPurge = drizzleDb
    .select(txSelection)
    .from(transactions)
    .where(
      and(eq(transactions.isDeleted, 1), lt(transactions.deletedAt, cutoff)),
    )
    .all()

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
  return getTransactionByIdFromReadModel(id)
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

export async function getTagIdsForTransaction(txId: string): Promise<string[]> {
  return drizzleDb
    .select({ tagId: transactionTags.tagId })
    .from(transactionTags)
    .where(eq(transactionTags.transactionId, txId))
    .all()
    .map((r) => r.tagId)
}
