import { Q } from "@nozbe/watermelondb"
import type { Observable } from "@nozbe/watermelondb/utils/rx"
import { distinctUntilChanged, map } from "rxjs/operators"

import type { AddLoanFormSchema } from "~/schemas/loans.schema"
import type { Loan, LoanType } from "~/types/loans"
import { LoanTypeEnum } from "~/types/loans"

import { database } from "../index"
import type LoanModel from "../models/loan"
import type TransactionModel from "../models/transaction"
import { modelToLoan } from "../utils/model-to-loan"

/**
 * Loan Service
 *
 * Provides functions for managing loan data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 *
 * Unlike goals/budgets, loans use direct foreign keys (account_id, category_id)
 * rather than join tables — no join-table merging is required at mapping time.
 */

const getLoanCollection = () => database.get<LoanModel>("loans")

const getTransactionCollection = () =>
  database.get<TransactionModel>("transactions")

const LOAN_OBSERVED_COLUMNS = [
  "name",
  "description",
  "principal_amount",
  "loan_type",
  "due_date",
  "account_id",
  "category_id",
  "icon",
  "color_scheme_name",
] as const

const TRANSACTION_OBSERVED_COLUMNS = [
  "title",
  "transaction_date",
  "amount",
  "type",
  "is_deleted",
  "is_pending",
  "loan_id",
] as const

/**
 * Observe all loans, sorted by due_date ascending (nulls last), then name.
 *
 * WatermelonDB does not support NULLS LAST in Q.sortBy, so sorting is
 * performed in JS after each emission. Due dates are stored as Date | null.
 */
export const observeLoans = (): Observable<Loan[]> =>
  getLoanCollection()
    .query()
    .observeWithColumns([...LOAN_OBSERVED_COLUMNS])
    .pipe(
      map((models) => {
        const loans = models.map(modelToLoan)
        return loans.sort((a, b) => {
          // Nulls last: if only one has a due date, the one without sorts last
          if (a.dueDate == null && b.dueDate == null) {
            return a.name.localeCompare(b.name)
          }
          if (a.dueDate == null) return 1
          if (b.dueDate == null) return -1
          const dateDiff = a.dueDate.getTime() - b.dueDate.getTime()
          if (dateDiff !== 0) return dateDiff
          return a.name.localeCompare(b.name)
        })
      }),
      // Prevent re-sort when only non-sort-relevant fields change (e.g., balance, category).
      // Custom comparator checks loan IDs, due dates, and names—if these are unchanged,
      // skip emission. This prevents unnecessary re-sorts on every field change.
      distinctUntilChanged((prev, curr) => {
        if (prev.length !== curr.length) return false
        return prev.every((loan, i) => {
          const other = curr[i]
          const sameDueDate =
            (loan.dueDate == null && other.dueDate == null) ||
            (loan.dueDate != null &&
              other.dueDate != null &&
              loan.dueDate.getTime() === other.dueDate.getTime())
          return loan.id === other.id && loan.name === other.name && sameDueDate
        })
      }),
    )

/**
 * Observe a single loan model by ID (raw model, for edit screens).
 */
export const observeLoanById = (id: string): Observable<LoanModel> =>
  getLoanCollection().findAndObserve(id)

/**
 * Observe transactions linked to a loan (for loan detail page).
 * Sorted descending by transaction_date, excluding deleted transactions.
 */
export const observeLoanTransactions = (
  loanId: string,
): Observable<TransactionModel[]> =>
  getTransactionCollection()
    .query(
      Q.where("loan_id", loanId),
      Q.where("is_deleted", false),
      Q.sortBy("transaction_date", Q.desc),
    )
    .observeWithColumns([...TRANSACTION_OBSERVED_COLUMNS])

/**
 * Observe the total repayment progress for a loan.
 *
 * Only counts repayment transactions — NOT the initial cash-flow transaction
 * created when the loan was opened:
 *   - LENT:     counts income transactions  (repayments received from borrower)
 *   - BORROWED: counts expense transactions (repayments you made to lender)
 *
 * The initial transaction has the opposite type, so it is naturally excluded.
 */
export const observeLoanPaymentProgress = (
  loanId: string,
  loanType: LoanType,
): Observable<number> => {
  const repaymentType = loanType === LoanTypeEnum.LENT ? "income" : "expense"
  return getTransactionCollection()
    .query(
      Q.where("loan_id", loanId),
      Q.where("type", repaymentType),
      Q.where("is_deleted", false),
      Q.where("is_pending", false),
    )
    .observeWithColumns([...TRANSACTION_OBSERVED_COLUMNS])
    .pipe(map((txs) => txs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0)))
}

/**
 * Create a new loan record in a single write.
 * Returns the mapped Loan domain object.
 */
export const createLoan = async (data: AddLoanFormSchema): Promise<Loan> =>
  database.write(async () => {
    const model = await getLoanCollection().create((l) => {
      l.name = data.name
      l.description = data.description ?? null
      l.principalAmount = data.principalAmount
      l.loanType = data.loanType
      // WatermelonDB @date fields accept Date objects; schema stores as Unix ms
      l.dueDate = data.dueDate != null ? new Date(data.dueDate) : null
      l.accountId = data.accountId
      l.categoryId = data.categoryId
      l.icon = data.icon ?? null
      // setColorScheme is not available on LoanModel — assign field directly
      l.colorSchemeName = data.colorSchemeName ?? null
    })
    return modelToLoan(model)
  })

/**
 * Update an existing loan's fields in a single write.
 * Returns the mapped Loan domain object after update.
 */
export const updateLoan = async (
  loan: LoanModel,
  updates: Partial<AddLoanFormSchema>,
): Promise<Loan> =>
  database.write(async () => {
    const model = await loan.update((l) => {
      if (updates.name !== undefined) l.name = updates.name
      if (updates.description !== undefined)
        l.description = updates.description ?? null
      if (updates.principalAmount !== undefined)
        l.principalAmount = updates.principalAmount
      if (updates.loanType !== undefined) l.loanType = updates.loanType
      if (updates.dueDate !== undefined)
        l.dueDate = updates.dueDate != null ? new Date(updates.dueDate) : null
      if (updates.accountId !== undefined) l.accountId = updates.accountId
      if (updates.categoryId !== undefined) l.categoryId = updates.categoryId
      if (updates.icon !== undefined) l.icon = updates.icon ?? null
      if (updates.colorSchemeName !== undefined)
        l.colorSchemeName = updates.colorSchemeName ?? null
    })
    return modelToLoan(model)
  })

/**
 * Permanently delete a loan record.
 *
 * Soft-delete filtering behavior:
 * The linked-transaction query intentionally does NOT filter by `is_deleted`.
 * Both active and soft-deleted transactions have their `loan_id` nullified in
 * the same write as the loan destruction. This is correct because:
 *
 *   1. `observeLoanTransactions` and `observeLoanPaymentProgress` already
 *      exclude soft-deleted rows with `Q.where("is_deleted", false)`, so they
 *      never surface in the UI regardless.
 *   2. If a soft-deleted transaction were later restored (un-deleted), it must
 *      not hold a dangling reference to a loan that no longer exists. Nullifying
 *      `loan_id` proactively prevents that orphan scenario.
 *
 * Restoration implications:
 * A restored transaction will lose its loan association. This is an acceptable
 * trade-off: the loan itself is permanently destroyed and cannot be re-linked.
 * If restoring transactions while keeping the loan alive is ever needed, the
 * destroy flow would need to be revisited (e.g., soft-delete the loan instead).
 */
export const destroyLoan = async (loan: LoanModel): Promise<void> => {
  await database.write(async () => {
    const linkedTxs = await database
      .get<TransactionModel>("transactions")
      .query(Q.where("loan_id", loan.id))
      .fetch()
    const ops = linkedTxs.map((tx) =>
      tx.prepareUpdate((t) => {
        t.loanId = null
      }),
    )
    await database.batch(...ops)
    await loan.destroyPermanently()
  })
}
