import type { TransactionKind, TransactionType } from "~/types/transactions"

import { ALLOWED_TYPES_BY_KIND } from "./transaction-kind"

// Every kind must appear in the matrix, mapping only to real transaction types.
const _exhaustive: Record<TransactionKind, readonly TransactionType[]> =
  ALLOWED_TYPES_BY_KIND
void _exhaustive

// Loan kinds allow both cash directions (opening entry + repayment).
type _LoanKindsAllowBothDirections =
  "expense" extends (typeof ALLOWED_TYPES_BY_KIND)["lent"][number]
    ? "income" extends (typeof ALLOWED_TYPES_BY_KIND)["lent"][number]
      ? "expense" extends (typeof ALLOWED_TYPES_BY_KIND)["borrowed"][number]
        ? "income" extends (typeof ALLOWED_TYPES_BY_KIND)["borrowed"][number]
          ? true
          : never
        : never
      : never
    : never
const _loanKindsOk: _LoanKindsAllowBothDirections = true
void _loanKindsOk
