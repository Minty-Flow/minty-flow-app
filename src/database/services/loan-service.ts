import { and, eq, sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  accounts,
  loans,
  transactions,
  transactionTags,
} from "~/database/drizzle/schema"
import { mapTransaction } from "~/database/mappers/transaction.mapper"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import { generateId } from "~/database/utils/generate-id"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import {
  getKindForLoanType,
  getOpeningTypeForLoan,
} from "~/domain/transaction-kind"
import type { AddLoanFormSchema } from "~/schemas/loans.schema"
import type { Loan, LoanTerm, LoanType } from "~/types/loans"
import { type Transaction, TransactionTypeEnum } from "~/types/transactions"
import { assertMinorUnits } from "~/utils/money"

type CreateLoanInput = AddLoanFormSchema & {
  initialTransactionTitle: string
  initialTransactionDate?: Date
  /** Progress-tracked (`long_term`) unless the form path passes `one_time`. */
  term?: LoanTerm
  /** When false, only the loan row is written — no opening cash-flow entry. */
  withOpeningTransaction?: boolean
}

export async function createLoan(data: CreateLoanInput): Promise<string> {
  assertMinorUnits(data.principalAmount)
  const id = generateId()
  const transactionId = generateId()
  const now = new Date().toISOString()
  const transactionDate = data.initialTransactionDate ?? new Date()
  const withOpening = data.withOpeningTransaction !== false
  const transactionType =
    data.loanType === "lent"
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME

  await runInTransaction("loan.create", (db) => {
    const account = db
      .select({ balance: accounts.balance })
      .from(accounts)
      .where(eq(accounts.id, data.accountId))
      .get()
    if (!account) throw new Error(`Account ${data.accountId} not found`)

    db.insert(loans)
      .values({
        id,
        name: data.name,
        description: data.description ?? null,
        principalAmount: data.principalAmount,
        loanType: data.loanType,
        term: data.term ?? "long_term",
        dueDate:
          data.dueDate != null ? new Date(data.dueDate).toISOString() : null,
        accountId: data.accountId,
        categoryId: data.categoryId,
        icon: data.icon ?? null,
        colorSchemeName: data.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    if (!withOpening) return

    db.insert(transactions)
      .values({
        id: transactionId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        amount: data.principalAmount,
        type: transactionType,
        transactionDate: transactionDate.toISOString(),
        title: data.initialTransactionTitle,
        description: null,
        isDeleted: 0,
        deletedAt: null,
        isPending: 0,
        requiresManualConfirmation: 0,
        accountBalanceBefore: account.balance,
        subtype: null,
        kind: getKindForLoanType(data.loanType),
        extra: null,
        hasAttachments: 0,
        recurringId: null,
        location: null,
        goalId: null,
        budgetId: null,
        loanId: id,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    const delta = getBalanceDelta(data.principalAmount, transactionType)
    if (delta !== 0) {
      db.update(accounts)
        .set({ balance: sql`${accounts.balance} + ${delta}`, updatedAt: now })
        .where(eq(accounts.id, data.accountId))
        .run()
    }
  })
  return id
}

export async function updateLoanById(
  id: string,
  data: Partial<AddLoanFormSchema>,
): Promise<void> {
  if (data.principalAmount !== undefined) {
    assertMinorUnits(data.principalAmount)
  }
  const now = new Date().toISOString()

  await runInTransaction("loan.update", (db) => {
    db.update(loans)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description ?? null }
          : {}),
        ...(data.principalAmount !== undefined
          ? { principalAmount: data.principalAmount }
          : {}),
        ...(data.loanType !== undefined ? { loanType: data.loanType } : {}),
        ...(data.dueDate !== undefined
          ? {
              dueDate:
                data.dueDate != null
                  ? new Date(data.dueDate).toISOString()
                  : null,
            }
          : {}),
        ...(data.accountId !== undefined ? { accountId: data.accountId } : {}),
        ...(data.categoryId !== undefined
          ? { categoryId: data.categoryId }
          : {}),
        ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
        ...(data.colorSchemeName !== undefined
          ? { colorSchemeName: data.colorSchemeName ?? null }
          : {}),
        updatedAt: now,
      })
      .where(eq(loans.id, id))
      .run()
  })
}

/**
 * One-way promotion of a one-time loan to a progress-tracked long-term loan.
 * Idempotent: a loan already `long_term` (or missing) is left untouched, and the
 * term never moves back (LP-4).
 */
export async function promoteLoanToLongTerm(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("loan.promote", (db) => {
    db.update(loans)
      .set({ term: "long_term", updatedAt: now })
      .where(and(eq(loans.id, id), eq(loans.term, "one_time")))
      .run()
  })
}

export async function deleteLoanById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("loan.delete", (db) => {
    db.update(transactions)
      .set({ loanId: null, updatedAt: now })
      .where(eq(transactions.loanId, id))
      .run()
    db.delete(loans).where(eq(loans.id, id)).run()
  })
}

// ── Opening-entry helpers (OE invariant) ─────────────────────────────────────

/**
 * A loan's opening entry is its non-deleted, loan-linked transaction whose
 * `type` equals `getOpeningTypeForLoan(loanType)`. Exactly one exists per loan.
 */
export function isLoanOpeningTransaction(
  tx: Pick<Transaction, "loanId" | "type" | "isDeleted">,
  loan: Pick<Loan, "id" | "loanType">,
): boolean {
  return (
    !tx.isDeleted &&
    tx.loanId === loan.id &&
    tx.type === getOpeningTypeForLoan(loan.loanType)
  )
}

export async function getLoanOpeningTransaction(
  loanId: string,
): Promise<Transaction | null> {
  const loan = drizzleDb
    .select({ loanType: loans.loanType })
    .from(loans)
    .where(eq(loans.id, loanId))
    .get()
  if (!loan) return null

  const openingType = getOpeningTypeForLoan(loan.loanType as LoanType)
  const row = drizzleDb
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.loanId, loanId),
        eq(transactions.type, openingType),
        eq(transactions.isDeleted, 0),
      ),
    )
    .get()
  return row ? mapTransaction(row as unknown as RowTransaction) : null
}

// ── Atomic create with opening entry (LA-1, form path) ───────────────────────

export type LoanOpeningInput = {
  name: string
  principalAmount: number
  loanType: LoanType
  term?: LoanTerm
  accountId: string
  categoryId: string
  dueDate?: number | null
  icon?: string | null
  colorSchemeName?: string | null
  description?: string | null
}

export type OpeningEntryInput = {
  title: string | null
  description?: string | null
  transactionDate: Date
  tags?: string[]
  location?: string | null
}

/**
 * Create a loan together with its opening cash-flow entry in one transaction.
 * Any failure rolls back both — never a loan without its opening entry.
 */
export async function createLoanWithOpeningEntry(
  loan: LoanOpeningInput,
  opening: OpeningEntryInput,
): Promise<{ loanId: string; transactionId: string }> {
  assertMinorUnits(loan.principalAmount)
  const loanId = generateId()
  const transactionId = generateId()
  const now = new Date().toISOString()
  const openingType = getOpeningTypeForLoan(loan.loanType)

  await runInTransaction("loan.createWithOpening", (db) => {
    const account = db
      .select({ balance: accounts.balance })
      .from(accounts)
      .where(eq(accounts.id, loan.accountId))
      .get()
    if (!account) throw new Error(`Account ${loan.accountId} not found`)

    db.insert(loans)
      .values({
        id: loanId,
        name: loan.name,
        description: loan.description ?? null,
        principalAmount: loan.principalAmount,
        loanType: loan.loanType,
        term: loan.term ?? "one_time",
        dueDate:
          loan.dueDate != null ? new Date(loan.dueDate).toISOString() : null,
        accountId: loan.accountId,
        categoryId: loan.categoryId,
        icon: loan.icon ?? null,
        colorSchemeName: loan.colorSchemeName ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    db.insert(transactions)
      .values({
        id: transactionId,
        accountId: loan.accountId,
        categoryId: loan.categoryId,
        amount: loan.principalAmount,
        type: openingType,
        transactionDate: opening.transactionDate.toISOString(),
        title: opening.title,
        description: opening.description ?? null,
        isDeleted: 0,
        deletedAt: null,
        isPending: 0,
        requiresManualConfirmation: 0,
        accountBalanceBefore: account.balance,
        subtype: null,
        kind: getKindForLoanType(loan.loanType),
        extra: null,
        hasAttachments: 0,
        recurringId: null,
        location: opening.location ?? null,
        goalId: null,
        budgetId: null,
        loanId,
        createdAt: now,
        updatedAt: now,
      })
      .run()

    const delta = getBalanceDelta(loan.principalAmount, openingType)
    if (delta !== 0) {
      db.update(accounts)
        .set({ balance: sql`${accounts.balance} + ${delta}`, updatedAt: now })
        .where(eq(accounts.id, loan.accountId))
        .run()
    }

    if (opening.tags?.length) {
      db.insert(transactionTags)
        .values(opening.tags.map((tagId) => ({ transactionId, tagId })))
        .onConflictDoNothing()
        .run()
    }
  })

  return { loanId, transactionId }
}
