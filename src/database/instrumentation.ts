/**
 * Callback shape for all write instrumentation listeners.
 *
 * @param name - The transaction label passed to {@link runInTransaction}
 *   (e.g. `"account.create"`).
 * @param duration - Wall-clock milliseconds for the transaction; present on
 *   end / slow events, absent on start events.
 */
type Listener = (name: string, duration?: number) => void

/** @internal */
const startListeners = new Set<Listener>()
/** @internal */
const endListeners = new Set<Listener>()
/** @internal */
const slowListeners = new Set<Listener>()

/**
 * Register a listener that fires **before** a transaction begins.
 *
 * Useful for showing loading indicators or logging write activity.
 *
 * @param fn - Called with the transaction name; `duration` is always `undefined`.
 * @returns void — unsubscription not supported (listeners live for the app lifetime).
 */
// export function onWriteStart(fn: Listener) {
//   startListeners.add(fn)
// }

/**
 * Register a listener that fires **after** every transaction completes
 * (commit or rollback).
 *
 * @param fn - Called with the transaction name and wall-clock duration in ms.
 */
// export function onWriteEnd(fn: Listener) {
//   endListeners.add(fn)
// }

/**
 * Register a listener that fires only for transactions that exceed **50 ms**.
 *
 * The threshold is a fixed internal constant; no configuration is exposed.
 * Attach here to surface slow-write warnings in dev tooling or analytics.
 *
 * @param fn - Called with the transaction name and wall-clock duration in ms.
 */
// export function onSlowWrite(fn: Listener) {
//   slowListeners.add(fn)
// }

/**
 * Signal that a named transaction is about to start.
 *
 * Called by {@link runInTransaction} before `withTransactionAsync`. Invokes
 * all {@link onWriteStart} listeners synchronously.
 *
 * @param name - Transaction label.
 * @internal
 */
export function emitWriteStart(name: string) {
  startListeners.forEach((fn) => {
    fn(name)
  })
}

/**
 * Signal that a named transaction has finished.
 *
 * Invokes all {@link onWriteEnd} listeners with `name` and `duration`.
 * Additionally invokes {@link onSlowWrite} listeners when `duration > 50`.
 *
 * @param name - Transaction label.
 * @param duration - Elapsed wall-clock time in milliseconds.
 * @internal
 */
export function emitWriteEnd(name: string, duration: number) {
  endListeners.forEach((fn) => {
    fn(name, duration)
  })

  if (duration > 50) {
    slowListeners.forEach((fn) => {
      fn(name, duration)
    })
  }
}
