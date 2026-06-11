import { getDb } from "./db"
import { emitWriteEnd, emitWriteStart } from "./instrumentation"
import { enqueueWrite } from "./write-queue"

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
 * **`withTransactionAsync` workaround:** expo-sqlite's `withTransactionAsync`
 * returns `void`, so results are captured via a `{ value: T }` box inside
 * the callback and extracted after the call completes.
 *
 * **Instrumentation:** emits write-start and write-end events (with duration)
 * via {@link emitWriteStart} / {@link emitWriteEnd} so perf listeners can
 * detect slow transactions (> 50 ms threshold).
 *
 * @param name - A human-readable label used in instrumentation events
 *   (e.g. `"account.create"`, `"transfer.delete"`).
 * @param fn - Async callback that receives the open database instance and
 *   performs all reads/writes. Its return value is forwarded to the caller.
 * @returns A promise that resolves with `fn`'s return value once the
 *   transaction commits, or rejects if the transaction rolls back.
 *
 * @example
 * ```ts
 * const id = await runInTransaction("account.create", async (db) => {
 *   await db.runAsync("INSERT INTO accounts (...) VALUES (?)", [name])
 *   return newId
 * })
 * ```
 */
export async function runInTransaction<T>(
  name: string,
  fn: (db: ReturnType<typeof getDb>) => Promise<T>,
): Promise<T> {
  // Re-entrant: if already inside a queued tx context, bypass queue to avoid deadlock
  if (txDepth > 0) {
    txDepth++
    try {
      return await fn(getDb())
    } finally {
      txDepth--
    }
  }

  return enqueueWrite(async () => {
    const db = getDb()
    const start = performance.now()

    emitWriteStart(name)
    txDepth++

    try {
      // withTransactionAsync callback must return void; capture result separately
      let captured: { value: T } | undefined
      await db.withTransactionAsync(async () => {
        captured = { value: await fn(db) }
      })
      if (!captured) throw new Error("Transaction callback did not execute")
      return captured.value
    } finally {
      txDepth--
      emitWriteEnd(name, performance.now() - start)
    }
  })
}
