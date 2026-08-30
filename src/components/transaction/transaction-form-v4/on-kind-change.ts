import type { TransactionKind } from "~/types/transactions"

import type { RecurringState } from "./types"

// Runtime-import-free (type-only imports) so scripts/checks/*.mts can load it
// under Node type-stripping.

export type LoanDraft = { name: string; dueDate: Date | null }

export type KindScratchState = {
  recurring: RecurringState
  loanDraft: LoanDraft | null
  linkedLoanId: string | null
  toAccountId: string | undefined
}

const RECURRING_KINDS = new Set<TransactionKind>(["subscription", "repetitive"])

function disabledRecurring(): RecurringState {
  return {
    enabled: false,
    frequency: "daily" as RecurringState["frequency"],
    startDate: new Date(),
    endDate: null,
    endAfterOccurrences: null,
    endsOnPickerExpanded: false,
  }
}

function enabledRecurring(): RecurringState {
  return { ...disabledRecurring(), enabled: true }
}

/**
 * Kind-transition (KT) matrix. Returns only the scratch fields that must change
 * — never touches user-entered content (amount, account, category, date, title,
 * notes, attachments, tags).
 */
export function onKindChange(
  prev: TransactionKind,
  next: TransactionKind,
  state: KindScratchState,
): Partial<KindScratchState> {
  if (prev === next) return {}

  // subscription <-> repetitive: keep the recurrence scratch untouched.
  if (RECURRING_KINDS.has(prev) && RECURRING_KINDS.has(next)) return {}

  if (next === "default" || next === "upcoming") {
    const out: Partial<KindScratchState> = {
      recurring: disabledRecurring(),
      loanDraft: null,
      linkedLoanId: null,
    }
    // upcoming disallows transfer — drop any pending destination account.
    if (next === "upcoming" && state.toAccountId !== undefined) {
      out.toAccountId = undefined
    }
    return out
  }

  if (next === "subscription" || next === "repetitive") {
    const out: Partial<KindScratchState> = {
      loanDraft: null,
      linkedLoanId: null,
    }
    if (!state.recurring?.enabled) out.recurring = enabledRecurring()
    return out
  }

  // next is "lent" | "borrowed"
  return {
    recurring: disabledRecurring(),
    loanDraft: { name: "", dueDate: null },
    toAccountId: undefined,
  }
}
