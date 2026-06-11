import type { Transaction } from "~/types/transactions"

/**
 * Utility functions for pending transactions.
 *
 * Balance rule (Flutter parity): balance must EXCLUDE pending.
 * We store `is_pending`; account balance is only updated on create/update/delete
 * when the transaction is confirmed (!isPending). Pending transactions must never
 * bleed into the live balance.
 */

/**
 * Start of the next minute from the given date (or now).
 * Used as anchor to avoid boundary issues with "now" when deciding pending vs past.
 */
export function startOfNextMinute(anchor?: Date): Date {
  const d = anchor ?? new Date()
  const next = new Date(d)
  next.setSeconds(0, 0)
  next.setMinutes(next.getMinutes() + 1)
  return next
}

/**
 * End of the next minute (same as start of the minute after that).
 * Used for confirmable check: planned time has passed.
 */
function endOfNextMinute(anchor?: Date): Date {
  const d = anchor ?? new Date()
  const next = new Date(d)
  next.setSeconds(59, 999)
  next.setMinutes(next.getMinutes() + 1)
  return next
}

/**
 * Check if a transaction can be confirmed.
 * A transaction is confirmable if:
 * 1. It is not deleted
 * 2. It's marked as pending (isPending === true)
 * 3. Its transaction date has passed relative to anchor
 *
 * Flutter equivalent: `Transaction.confirmable([DateTime? anchor])` checks
 * `isDeleted`, `isPending`, and `transactionDate.isPastAnchored(anchor ?? now.endOfNextMinute())`.
 *
 * @param transaction - The transaction to check
 * @param anchor - Optional anchor timestamp; defaults to endOfNextMinute() for consistency with Flutter
 * @returns true if the transaction can be confirmed
 */
export function confirmable(
  transaction: Transaction,
  anchor?: number,
): boolean {
  if (transaction.isDeleted) return false
  if (!transaction.isPending) return false
  const ref = anchor ?? endOfNextMinute().getTime()
  return transaction.transactionDate.getTime() <= ref
}
