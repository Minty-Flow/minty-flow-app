import { drizzleDb } from "./drizzle/db"
import { enqueueWrite } from "./write-queue"

export type DbTransaction = Parameters<
  Parameters<typeof drizzleDb.transaction>[0]
>[0]

/**
 * Tracks nesting depth of active transaction contexts.
 *
 * `0` — no transaction is in progress.
 * `> 0` — at least one `runInTransaction` frame is on the call stack.
 *
 * Used to detect re-entrant calls so they can bypass the write-queue and
 * avoid a self-deadlock (the queue can only process one task at a time).
 *
 * @internal
 */
let txDepth = 0

/**
 * Drizzle's expo-sqlite transactions are synchronous: a callback that returns
 * a promise would commit before its awaited work runs, and the global depth
 * counter above would let other callers slip past the write queue meanwhile.
 * Fail (and roll back) instead of silently misbehaving.
 */
function assertSynchronous<T>(
  fn: (db: DbTransaction) => T,
): (db: DbTransaction) => T {
  return (db) => {
    const result = fn(db)
    if (typeof (result as { then?: unknown } | null)?.then === "function") {
      throw new Error(
        "runInTransaction callbacks must be synchronous (no async/await or returned promises)",
      )
    }
    return result
  }
}

/**
 * Run `fn` inside an exclusive SQLite transaction, serialised through the
 * global write queue.
 *
 * **Serialisation:** delegates to {@link enqueueWrite}, which ensures only one
 * transaction is open at any moment — necessary because WAL mode allows only
 * one concurrent writer.
 *
 * **Re-entrancy:** if the caller is already executing inside `runInTransaction`
 * (`txDepth > 0`), the queue is bypassed and `fn` runs in the existing
 * transaction context. This lets services call other services without
 * deadlocking the queue.
 *
 * @param name - Reserved human-readable label for call-site clarity.
 * @param fn - Async callback that receives the open database instance and
 *   performs all reads/writes. Its return value is forwarded to the caller.
 * @returns A promise that resolves with `fn`'s return value once the
 *   transaction commits, or rejects if the transaction rolls back.
 *
 */
export async function runInTransaction<T>(
  _name: string,
  fn: (db: DbTransaction) => T,
): Promise<T> {
  // Re-entrant: if already inside a queued tx context, bypass queue to avoid deadlock.
  if (txDepth > 0) {
    txDepth++
    try {
      return drizzleDb.transaction(assertSynchronous(fn))
    } finally {
      txDepth--
    }
  }

  return enqueueWrite(async () => {
    txDepth++

    try {
      return drizzleDb.transaction(assertSynchronous(fn))
    } finally {
      txDepth--
    }
  })
}
