import { emit } from "~/database/events"
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

  await runInTransaction("loan.create", async (db) => {
    const account = await db.getFirstAsync<{ balance: number }>(
      `SELECT balance FROM accounts WHERE id = ?`,
      [data.accountId],
    )
    if (!account) throw new Error(`Account ${data.accountId} not found`)

    await db.runAsync(
      `INSERT INTO loans (id, name, description, principal_amount, loan_type, due_date,
        account_id, category_id, icon, color_scheme_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.description ?? null,
        data.principalAmount,
        data.loanType,
        data.dueDate != null ? new Date(data.dueDate).toISOString() : null,
        data.accountId,
        data.categoryId,
        data.icon ?? null,
        data.colorSchemeName ?? null,
        now,
        now,
      ],
    )

    await db.runAsync(
      `INSERT INTO transactions (
        id, account_id, category_id, amount, type, transaction_date,
        title, description, is_deleted, deleted_at, is_pending,
        requires_manual_confirmation,
        account_balance_before, subtype, extra, has_attachments,
        recurring_id, location, goal_id, budget_id, loan_id,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, NULL, 0, NULL, 0,
        0,
        ?, ?, NULL, 0,
        NULL, NULL, NULL, NULL, ?,
        ?, ?
      )`,
      [
        transactionId,
        data.accountId,
        data.categoryId,
        data.principalAmount,
        transactionType,
        transactionDate.toISOString(),
        data.initialTransactionTitle,
        account.balance,
        subtype,
        id,
        now,
        now,
      ],
    )

    const delta = getBalanceDelta(
      data.principalAmount,
      transactionType,
      subtype,
    )
    if (delta !== 0) {
      await db.runAsync(
        `UPDATE accounts SET balance = balance + ?, updated_at = ? WHERE id = ?`,
        [delta, now, data.accountId],
      )
    }
  })

  emit("loans:dirty", undefined)
  emit("transactions:dirty", {})
  emit("accounts:dirty", { ids: [data.accountId] })
  emit("categories:dirty", undefined)
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

  await runInTransaction("loan.update", async (db) => {
    await db.runAsync(
      `UPDATE loans SET
        name = COALESCE(?, name),
        description = CASE WHEN ? THEN ? ELSE description END,
        principal_amount = COALESCE(?, principal_amount),
        loan_type = COALESCE(?, loan_type),
        due_date = CASE WHEN ? THEN ? ELSE due_date END,
        account_id = COALESCE(?, account_id),
        category_id = COALESCE(?, category_id),
        icon = CASE WHEN ? THEN ? ELSE icon END,
        color_scheme_name = CASE WHEN ? THEN ? ELSE color_scheme_name END,
        updated_at = ?
       WHERE id = ?`,
      [
        data.name ?? null,
        data.description !== undefined ? 1 : 0,
        data.description ?? null,
        data.principalAmount ?? null,
        data.loanType ?? null,
        data.dueDate !== undefined ? 1 : 0,
        data.dueDate != null ? new Date(data.dueDate).toISOString() : null,
        data.accountId ?? null,
        data.categoryId ?? null,
        data.icon !== undefined ? 1 : 0,
        data.icon ?? null,
        data.colorSchemeName !== undefined ? 1 : 0,
        data.colorSchemeName ?? null,
        now,
        id,
      ],
    )
  })

  emit("loans:dirty", undefined)
}

export async function deleteLoanById(id: string): Promise<void> {
  const now = new Date().toISOString()

  await runInTransaction("loan.delete", async (db) => {
    await db.runAsync(
      `UPDATE transactions SET loan_id = NULL, updated_at = ? WHERE loan_id = ?`,
      [now, id],
    )
    await db.runAsync(`DELETE FROM loans WHERE id = ?`, [id])
  })

  emit("loans:dirty", undefined)
  emit("transactions:dirty", {})
}
