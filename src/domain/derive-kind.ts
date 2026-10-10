import type { TransactionKind } from "~/types/transactions"

// type-only import (elided by Node type-stripping) — keep this module runtime-import-free

export interface DeriveKindInput {
  subtype: string | null
  isPending: boolean
  type: string
  loanType: "lent" | "borrowed" | null
  recurringId: string | null
}

/** Mirrors migration 0001's backfill precedence: loan link > recurring > pending(non-transfer). */
export function deriveKind(input: DeriveKindInput): TransactionKind {
  if (input.loanType === "lent") return "lent"
  if (input.loanType === "borrowed") return "borrowed"
  if (input.recurringId != null || input.subtype === "recurring") {
    return "repetitive"
  }
  if (input.isPending && input.type !== "transfer") return "upcoming"
  return "default"
}
