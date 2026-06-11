import { emit } from "~/database/events"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type { AddLoanFormSchema } from "~/schemas/loans.schema"

export async function createLoan(data: AddLoanFormSchema): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("loan.create", async (db) => {
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
  })

  emit("loans:dirty", undefined)
  return id
}

export async function updateLoanById(
  id: string,
  data: Partial<AddLoanFormSchema>,
): Promise<void> {
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
