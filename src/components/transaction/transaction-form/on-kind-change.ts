import type { Recurrence, TransactionKind } from "~/types/transactions"

import type { RecurringState } from "./types"

// Runtime-import-free (type-only imports) so scripts/checks/*.mts can load it
// under Node type-stripping.

export type KindScratchState = {
  recurring: RecurringState
  toAccountId: string | undefined
}

const RECURRING_KINDS = new Set<TransactionKind>(["subscription", "repetitive"])
const DEFAULT_RECURRENCE: Recurrence = { interval: 1, unit: "month" }

function freshRecurrence(): RecurringState {
  return {
    recurrence: { ...DEFAULT_RECURRENCE },
    until: null,
    startDate: new Date(),
  }
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

  // subscription <-> repetitive: label only, keep the recurrence scratch.
  if (RECURRING_KINDS.has(prev) && RECURRING_KINDS.has(next)) return {}

  if (next === "default" || next === "upcoming") {
    const out: Partial<KindScratchState> = { recurring: freshRecurrence() }
    // upcoming disallows transfer — drop any pending destination account.
    if (next === "upcoming" && state.toAccountId !== undefined) {
      out.toAccountId = undefined
    }
    return out
  }

  if (RECURRING_KINDS.has(next)) {
    // arrived from a non-recurring kind -> seed a fresh recurrence
    return { recurring: freshRecurrence() }
  }

  // next is "lent" | "borrowed": a new one-time loan built from the main form
  // fields (title -> name, date -> due date), so only the transfer dest drops.
  return { recurring: freshRecurrence(), toAccountId: undefined }
}
