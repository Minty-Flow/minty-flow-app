import { eq, sql } from "drizzle-orm"

import { accounts, loans, transactions } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type { AddLoanFormSchema } from "~/schemas/loans.schema"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { assertMinorUnits } from "~/utils/money"

type CreateLoanInput = AddLoanFormSchema & {
  initialTransactionTitle: string
  initialTransactionDate?: Date
}

export async function createLoan(data: CreateLoanInput): Promise<string> {
  assertMinorUnits(data.principalAmount)
  const id = generateId()
  const transactionId = generateId()
  const now = new Date().toISOString()
  const transactionDate = data.initialTransactionDate ?? new Date()
  const transactionType =
    data.loanType === "lent"
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME
  const subtype =
    data.loanType === "lent"
      ? TransactionSubTypeEnum.LOAN_LENT
      : TransactionSubTypeEnum.LOAN_BORROWED

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
        subtype,
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

    const delta = getBalanceDelta(
      data.principalAmount,
      transactionType,
      subtype,
    )
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
