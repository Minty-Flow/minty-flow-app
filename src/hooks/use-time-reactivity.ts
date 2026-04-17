import { useMemo, useSyncExternalStore } from "react"

/* ------------------------------------------------------------------ */
/* Precise Minute Ticker (fires exactly at minute boundaries)         */
/* ------------------------------------------------------------------ */

const minuteListeners = new Set<() => void>()
let currentMinute = Math.floor(Date.now() / 60_000)
let minuteTimeoutId: ReturnType<typeof setTimeout> | null = null

function scheduleNextMinute() {
  if (minuteTimeoutId) clearTimeout(minuteTimeoutId)

  const now = Date.now()
  const msUntilNextMinute = 60_000 - (now % 60_000)

  minuteTimeoutId = setTimeout(() => {
    currentMinute = Math.floor(Date.now() / 60_000)
    for (const cb of minuteListeners) cb()
    scheduleNextMinute()
  }, msUntilNextMinute)
}

function subscribeMinute(callback: () => void) {
  const wasEmpty = minuteListeners.size === 0
  minuteListeners.add(callback)
  if (wasEmpty) scheduleNextMinute()

  return () => {
    minuteListeners.delete(callback)
    if (minuteListeners.size === 0 && minuteTimeoutId) {
      clearTimeout(minuteTimeoutId)
      minuteTimeoutId = null
    }
  }
}

/**
 * Returns a value that changes every minute (precisely at minute boundaries).
 * 60x more efficient than polling every second.
 */
export function useMinuteTick(): number {
  return useSyncExternalStore(
    subscribeMinute,
    () => currentMinute,
    () => currentMinute,
  )
}

/* ------------------------------------------------------------------ */
/* Specific Timestamp Watcher (fires exactly when a date passes)      */
/* ------------------------------------------------------------------ */

class TimestampScheduler {
  private listeners = new Map<number, Set<() => void>>()
  private timeouts = new Map<number, ReturnType<typeof setTimeout>>()

  subscribe(timestamp: number, callback: () => void): () => void {
    // Round to minute for grouping (multiple transactions at same minute)
    const minuteTimestamp = Math.floor(timestamp / 60_000) * 60_000

    if (!this.listeners.has(minuteTimestamp)) {
      this.listeners.set(minuteTimestamp, new Set())
      this.scheduleTimestamp(minuteTimestamp)
    }

    const set = this.listeners.get(minuteTimestamp)
    if (set) set.add(callback)

    return () => {
      const set = this.listeners.get(minuteTimestamp)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          this.listeners.delete(minuteTimestamp)
          const timeout = this.timeouts.get(minuteTimestamp)
          if (timeout) {
            clearTimeout(timeout)
            this.timeouts.delete(minuteTimestamp)
          }
        }
      }
    }
  }

  private scheduleTimestamp(timestamp: number) {
    const msUntil = timestamp - Date.now()

    if (msUntil <= 0) {
      this.notifyListeners(timestamp)
      return
    }

    const timeout = setTimeout(() => {
      this.notifyListeners(timestamp)
      this.timeouts.delete(timestamp)
    }, msUntil)

    this.timeouts.set(timestamp, timeout)
  }

  private notifyListeners(timestamp: number) {
    const set = this.listeners.get(timestamp)
    if (set) {
      for (const cb of set) cb()
    }
  }
}

const timestampScheduler = new TimestampScheduler()

/**
 * Returns true once the specified date has passed.
 * Updates **exactly** when the date passes (no polling, no delay).
 */
function useHasPassed(date: Date): boolean {
  const timestamp = date.getTime()

  return useSyncExternalStore(
    (callback) => timestampScheduler.subscribe(timestamp, callback),
    () => Date.now() >= timestamp,
    () => Date.now() >= timestamp,
  )
}

/* ------------------------------------------------------------------ */
/* Transaction-Specific Hooks                                          */
/* ------------------------------------------------------------------ */

interface ConfirmableTransaction {
  transactionDate: Date
  isPending: boolean
  isDeleted?: boolean
}

/**
 * Returns true if a transaction is confirmable (pending + date has passed).
 * Updates precisely when the transaction date passes (via useHasPassed).
 */
export function useIsConfirmable(transaction: ConfirmableTransaction): boolean {
  const hasPassed = useHasPassed(transaction.transactionDate)

  return useMemo(() => {
    if (transaction.isDeleted) return false
    return transaction.isPending && hasPassed
  }, [transaction.isPending, transaction.isDeleted, hasPassed])
}
