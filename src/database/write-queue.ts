/** @internal A zero-argument async factory that produces a value. */
type Task<T> = () => Promise<T>

/**
 * The tail of the FIFO write chain.
 *
 * Every new write appends itself after the current tail; the tail is replaced
 * with a void-normalised version of the new write so that a failure in one
 * task does not poison (reject) subsequent tasks.
 *
 * @internal
 */
let chain: Promise<void> = Promise.resolve()

/**
 * Returns `true` for transient SQLite contention errors that are safe to
 * retry without side effects.
 *
 * @internal
 */
function isRetryable(error: unknown) {
  const msg = String((error as { message?: string })?.message ?? "")
  return msg.includes("SQLITE_BUSY") || msg.includes("SQLITE_LOCKED")
}

/**
 * Executes `fn`, retrying up to `retries` times on `SQLITE_BUSY` /
 * `SQLITE_LOCKED` with linear back-off (50 ms × attempt number).
 *
 * Non-retryable errors are re-thrown immediately without consuming retries.
 *
 * @param fn - The async task to run.
 * @param retries - Maximum number of retry attempts (default 3).
 * @returns The resolved value of `fn`.
 *
 * @internal
 */
async function runWithRetry<T>(fn: Task<T>, retries = 3): Promise<T> {
  let attempt = 0

  while (true) {
    try {
      return await fn()
    } catch (err) {
      if (!isRetryable(err) || attempt >= retries) {
        throw err
      }
      attempt++
      await new Promise((r) => setTimeout(r, 50 * attempt))
    }
  }
}

/**
 * Enqueue a write task onto the global FIFO write chain.
 *
 * **Why this exists:** expo-sqlite's WAL mode allows one writer at a time.
 * Running concurrent `withTransactionAsync` calls causes `SQLITE_BUSY`.
 * All writes are serialised through this queue so that only one transaction
 * is in-flight at any moment.
 *
 * **Poison-proofing:** each task is appended as
 * `chain.then(task).then(void, void)`, so a rejection in one task does not
 * reject the shared `chain` promise — subsequent enqueued tasks still execute.
 *
 * **Retry:** each task is wrapped in {@link runWithRetry} with up to 3
 * attempts and 50 ms × attempt back-off for transient `SQLITE_BUSY` /
 * `SQLITE_LOCKED` errors.
 *
 * **Re-entrancy:** code already running inside a queued task (e.g. a service
 * calling another service) must bypass the queue via the `txDepth > 0` check
 * in {@link runInTransaction} — enqueuing from inside the queue would deadlock.
 *
 * @param task - The async write to serialise.
 * @returns A promise that resolves or rejects with the task's outcome.
 *
 * @example
 * ```ts
 * // Direct use (prefer runInTransaction for transactional work)
 * const id = await enqueueWrite(async () => {
 *   await getDb().runAsync("INSERT INTO accounts ...", [...])
 *   return newId
 * })
 * ```
 */
export function enqueueWrite<T>(task: Task<T>): Promise<T> {
  const result: Promise<T> = chain.then(() => runWithRetry(task))
  chain = result.then(
    () => undefined,
    () => undefined,
  ) // poison-proof
  return result
}
