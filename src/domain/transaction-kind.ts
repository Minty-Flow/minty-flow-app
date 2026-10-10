import type { LoanType } from "~/types/loans"
import type { TransactionKind, TransactionType } from "~/types/transactions"

const EXPENSE_INCOME_TRANSFER = ["expense", "income", "transfer"] as const
const EXPENSE_INCOME = ["expense", "income"] as const

/**
 * Single source of truth for which transaction `type` each `kind` permits.
 *
 * `kind` identifies the relationship (loan / recurring / …); `type` identifies
 * the cash direction. A `lent` loan's opening entry is an expense (money out)
 * and its repayments are income (money back) — so both types are valid for the
 * loan kinds. Mirror for `borrowed`.
 */
export const ALLOWED_TYPES_BY_KIND = {
  default: EXPENSE_INCOME_TRANSFER,
  upcoming: EXPENSE_INCOME,
  subscription: EXPENSE_INCOME_TRANSFER,
  repetitive: EXPENSE_INCOME_TRANSFER,
  lent: EXPENSE_INCOME,
  borrowed: EXPENSE_INCOME,
} as const satisfies Record<TransactionKind, readonly TransactionType[]>

export function getAllowedTransactionTypes(
  kind: TransactionKind,
): readonly TransactionType[] {
  return ALLOWED_TYPES_BY_KIND[kind]
}

export function isKindTypeValid(
  kind: TransactionKind,
  type: TransactionType,
): boolean {
  return (ALLOWED_TYPES_BY_KIND[kind] as readonly TransactionType[]).includes(
    type,
  )
}

export function getKindForLoanType(loanType: LoanType): "lent" | "borrowed" {
  return loanType === "lent" ? "lent" : "borrowed"
}

export function getOpeningTypeForLoan(
  loanType: LoanType,
): "expense" | "income" {
  return loanType === "lent" ? "expense" : "income"
}

export function getRepaymentTypeForLoan(
  loanType: LoanType,
): "income" | "expense" {
  return loanType === "lent" ? "income" : "expense"
}
