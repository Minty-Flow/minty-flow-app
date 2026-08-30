import type { TransactionKind, TransactionType } from "~/types/transactions"

import { ALLOWED_TYPES_BY_KIND } from "./transaction-kind"

// Every kind must appear in the matrix, mapping only to real transaction types.
const _exhaustive: Record<TransactionKind, readonly TransactionType[]> =
  ALLOWED_TYPES_BY_KIND
void _exhaustive

// lent/borrowed are single-type.
type _LentIsExpenseOnly =
  (typeof ALLOWED_TYPES_BY_KIND)["lent"] extends readonly ["expense"]
    ? true
    : never
const _lentOk: _LentIsExpenseOnly = true
void _lentOk
