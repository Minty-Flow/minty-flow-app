import { logger } from "~/utils/logger"

type CommitListener = (name: string) => void

const listeners = new Set<CommitListener>()

/**
 * Subscribe to every write transaction that commits, by the name its caller
 * gave `runInTransaction`. Returns the unsubscribe function.
 */
export function onWriteCommitted(listener: CommitListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** @internal Called by `runInTransaction` once a transaction has committed. */
export function emitWriteCommitted(name: string): void {
  for (const listener of listeners) {
    try {
      listener(name)
    } catch (error) {
      logger.error("Write listener failed", { name, error: String(error) })
    }
  }
}

/**
 * Whether a write can add, move, confirm or remove a pending transaction, and
 * so change which reminders should be scheduled. Matches the label prefixes the
 * services pass to `runInTransaction`.
 */
export function writeAffectsPendingTransactions(name: string): boolean {
  return /^(transaction|transfer|recurring|trash|import|restore|recover|account|loan)\./.test(
    name,
  )
}
