import { endOfMonth, startOfMonth } from "date-fns"
import { and, count, eq, inArray, or, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  budgetAccounts,
  goalAccounts,
  loans,
  recurringTransactions,
  transactions,
  transactionTags,
  transfers,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  AddAccountsFormSchema,
  UpdateAccountsFormSchema,
} from "~/schemas/accounts.schema"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"
import { assertMinorUnits, rescaleMinorUnits } from "~/utils/money"

// ── Create ───────────────────────────────────────────────────────────────────

export async function createAccount(
  data: AddAccountsFormSchema,
): Promise<string> {
  assertMinorUnits(data.balance)
  const id = generateId()
  const now = new Date().toISOString()

  const result = await runInTransaction("account.create", (db) => {
    const last = db
      .select({ maxOrder: sql<number | null>`max(${accounts.sortOrder})` })
      .from(accounts)
      .get()
    const sortOrder = last?.maxOrder != null ? last.maxOrder + 1 : 0

    if (data.isPrimary) {
      db.update(accounts)
        .set({ isPrimary: 0, updatedAt: now })
        .where(sql`${accounts.id} != ${id}`)
        .run()
    }

    db.insert(accounts)
      .values({
        id,
        name: data.name,
        type: data.type,
        balance: data.balance,
        currencyCode: data.currencyCode,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        isPrimary: data.isPrimary ? 1 : 0,
        excludeFromBalance: data.excludeFromBalance ? 1 : 0,
        isArchived: 0,
        sortOrder,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    return id
  })
  return result
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateAccount(
  id: string,
  updates: Partial<UpdateAccountsFormSchema>,
): Promise<void> {
  if (updates.balance !== undefined) assertMinorUnits(updates.balance)
  const now = new Date().toISOString()
  let currencyChanged = false

  const balanceAdjustment = await runInTransaction<{
    amount: number
    type: TransactionType
  } | null>("account.update", (db) => {
    const existing = db
      .select({
        balance: accounts.balance,
        currencyCode: accounts.currencyCode,
      })
      .from(accounts)
      .where(eq(accounts.id, id))
      .get()
    if (!existing) throw new Error(`Account ${id} not found`)
    let comparableBalance = existing.balance

    if (
      updates.currencyCode &&
      updates.currencyCode !== existing.currencyCode
    ) {
      const nextCurrencyCode = updates.currencyCode
      currencyChanged = true
      comparableBalance = rescaleMinorUnits(
        existing.balance,
        existing.currencyCode,
        nextCurrencyCode,
      )
      const txRows = db
        .select({
          id: transactions.id,
          amount: transactions.amount,
          accountBalanceBefore: transactions.accountBalanceBefore,
        })
        .from(transactions)
        .where(eq(transactions.accountId, id))
        .all()
      for (const transaction of txRows) {
        db.update(transactions)
          .set({
            amount: rescaleMinorUnits(
              transaction.amount,
              existing.currencyCode,
              nextCurrencyCode,
            ),
            accountBalanceBefore: rescaleMinorUnits(
              transaction.accountBalanceBefore,
              existing.currencyCode,
              nextCurrencyCode,
            ),
            updatedAt: now,
          })
          .where(eq(transactions.id, transaction.id))
          .run()
      }

      const loanRows = db
        .select({
          id: loans.id,
          principalAmount: loans.principalAmount,
        })
        .from(loans)
        .where(eq(loans.accountId, id))
        .all()
      for (const loan of loanRows) {
        db.update(loans)
          .set({
            principalAmount: rescaleMinorUnits(
              loan.principalAmount,
              existing.currencyCode,
              nextCurrencyCode,
            ),
            updatedAt: now,
          })
          .where(eq(loans.id, loan.id))
          .run()
      }

      const recurringRows = db
        .select({
          id: recurringTransactions.id,
          jsonTransactionTemplate:
            recurringTransactions.jsonTransactionTemplate,
        })
        .from(recurringTransactions)
        .all()
      const recurringUpdates: [string, string][] = []
      for (const recurring of recurringRows) {
        const template = JSON.parse(recurring.jsonTransactionTemplate) as {
          accountId?: string
          amount?: number
        }
        if (template.accountId !== id || template.amount === undefined) continue
        template.amount = rescaleMinorUnits(
          template.amount,
          existing.currencyCode,
          nextCurrencyCode,
        )
        recurringUpdates.push([JSON.stringify(template), recurring.id])
      }
      for (const [template, recurringId] of recurringUpdates) {
        db.update(recurringTransactions)
          .set({ jsonTransactionTemplate: template })
          .where(eq(recurringTransactions.id, recurringId))
          .run()
      }

      db.update(accounts)
        .set({ balance: comparableBalance, updatedAt: now })
        .where(eq(accounts.id, id))
        .run()
    }

    if (updates.isPrimary === true) {
      db.update(accounts)
        .set({ isPrimary: 0, updatedAt: now })
        .where(sql`${accounts.id} != ${id}`)
        .run()
    }

    db.update(accounts)
      .set({
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.type !== undefined ? { type: updates.type } : {}),
        ...(updates.currencyCode !== undefined
          ? { currencyCode: updates.currencyCode }
          : {}),
        ...(updates.icon !== undefined ? { icon: updates.icon ?? null } : {}),
        ...(updates.colorSchemeName !== undefined
          ? { colorSchemeName: updates.colorSchemeName ?? null }
          : {}),
        ...(updates.isPrimary !== undefined
          ? { isPrimary: updates.isPrimary ? 1 : 0 }
          : {}),
        ...(updates.excludeFromBalance !== undefined
          ? { excludeFromBalance: updates.excludeFromBalance ? 1 : 0 }
          : {}),
        updatedAt: now,
      })
      .where(eq(accounts.id, id))
      .run()

    // Return balance adjustment info for after commit (avoid nested tx event timing)
    if (
      updates.balance !== undefined &&
      typeof updates.balance === "number" &&
      updates.balance !== comparableBalance
    ) {
      const delta = updates.balance - comparableBalance
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
    const { createTransaction } = await import("./ledger-service")
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
  if (currencyChanged) {
  }
}

// ── Archive / Unarchive ───────────────────────────────────────────────────────

export async function archiveAccount(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.archive", (db) => {
    db.update(accounts)
      .set({ isArchived: 1, updatedAt: now })
      .where(eq(accounts.id, id))
      .run()
  })
}

export async function unarchiveAccount(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.unarchive", (db) => {
    db.update(accounts)
      .set({ isArchived: 0, updatedAt: now })
      .where(eq(accounts.id, id))
      .run()
  })
}

// ── Destroy (cascading) ───────────────────────────────────────────────────────

export async function destroyAccount(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("account.destroy", (db) => {
    const txs = db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, id))
      .all()

    const allTxIds = txs.map((t) => t.id)
    const transferTxRows = allTxIds.length
      ? db
          .select({
            fromTransactionId: transfers.fromTransactionId,
            toTransactionId: transfers.toTransactionId,
          })
          .from(transfers)
          .where(
            or(
              inArray(transfers.fromTransactionId, allTxIds),
              inArray(transfers.toTransactionId, allTxIds),
            ),
          )
          .all()
      : []
    const transferTxIdSet = new Set<string>()
    for (const row of transferTxRows) {
      transferTxIdSet.add(row.fromTransactionId)
      transferTxIdSet.add(row.toTransactionId)
    }
    const transferTxIds = txs.flatMap((t) =>
      transferTxIdSet.has(t.id) ? [t.id] : [],
    )

    if (transferTxIds.length > 0) {
      const transferRows = db
        .select({
          fromTransactionId: transfers.fromTransactionId,
          toTransactionId: transfers.toTransactionId,
        })
        .from(transfers)
        .where(
          or(
            inArray(transfers.fromTransactionId, transferTxIds),
            inArray(transfers.toTransactionId, transferTxIds),
          ),
        )
        .all()

      const txIdSet = new Set(transferTxIds)
      const partnerTxIds = [
        ...new Set(
          transferRows.flatMap((row) => {
            const parts: string[] = []
            if (txIdSet.has(row.fromTransactionId))
              parts.push(row.toTransactionId)
            if (txIdSet.has(row.toTransactionId))
              parts.push(row.fromTransactionId)
            return parts
          }),
        ),
      ]

      if (partnerTxIds.length > 0) {
        const partnerTxs = db
          .select()
          .from(transactions)
          .where(inArray(transactions.id, partnerTxIds))
          .all()

        const partnerAccountDeltas = new Map<string, number>()
        for (const tx of partnerTxs) {
          if (!tx.isDeleted && !tx.isPending) {
            const delta = tx.amount
            partnerAccountDeltas.set(
              tx.accountId,
              (partnerAccountDeltas.get(tx.accountId) ?? 0) + delta,
            )
          }
        }

        for (const [accId, totalDelta] of partnerAccountDeltas) {
          db.update(accounts)
            .set({
              balance: sql`${accounts.balance} - ${totalDelta}`,
              updatedAt: now,
            })
            .where(eq(accounts.id, accId))
            .run()
        }

        const partnerIdsToDelete = partnerTxs.flatMap((tx) =>
          tx.isDeleted ? [] : [tx.id],
        )
        if (partnerIdsToDelete.length > 0) {
          db.update(transactions)
            .set({ isDeleted: 1, deletedAt: now, updatedAt: now })
            .where(inArray(transactions.id, partnerIdsToDelete))
            .run()
        }

        const affectedTransferTxIds = [...transferTxIds, ...partnerTxIds]
        db.delete(transfers)
          .where(
            or(
              inArray(transfers.fromTransactionId, affectedTransferTxIds),
              inArray(transfers.toTransactionId, affectedTransferTxIds),
            ),
          )
          .run()
      }
    }

    if (txs.length > 0) {
      db.delete(transactionTags)
        .where(inArray(transactionTags.transactionId, allTxIds))
        .run()
      db.delete(transactions).where(eq(transactions.accountId, id)).run()
    }

    db.delete(budgetAccounts).where(eq(budgetAccounts.accountId, id)).run()
    db.delete(goalAccounts).where(eq(goalAccounts.accountId, id)).run()
    db.delete(accounts).where(eq(accounts.id, id)).run()
  })
}

// ── Reorder ───────────────────────────────────────────────────────────────────

export async function updateAccountsOrder(
  entries: Array<{ id: string }>,
): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("account.reorder", (db) => {
    for (const [i, entry] of entries.entries()) {
      db.update(accounts)
        .set({ sortOrder: i, updatedAt: now })
        .where(eq(accounts.id, entry.id))
        .run()
    }
  })
}

// ── Read helpers ──────────────────────────────────────────────────────────────

export async function getAccountTransactionCount(
  accountId: string,
): Promise<number> {
  const row = drizzleDb
    .select({ cnt: count() })
    .from(transactions)
    .where(
      and(eq(transactions.accountId, accountId), eq(transactions.isDeleted, 0)),
    )
    .get()
  return row?.cnt ?? 0
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
