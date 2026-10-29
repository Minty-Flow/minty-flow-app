import { useCallback, useSyncExternalStore } from "react"
import { AppState } from "react-native"

import { localDayKey } from "~/utils/time-utils"

/* ------------------------------------------------------------------ */
/* Precise Minute Ticker (fires exactly at minute boundaries)         */
/* ------------------------------------------------------------------ */
const minuteListeners = new Set<() => void>()
let currentMinute = Math.floor(Date.now() / 60000)
let minuteTimeoutId: ReturnType<typeof setTimeout> | null = null
function scheduleNextMinute() {
  if (minuteTimeoutId) clearTimeout(minuteTimeoutId)
  const now = Date.now()
  const msUntilNextMinute = 60000 - (now % 60000)
  minuteTimeoutId = setTimeout(() => {
    currentMinute = Math.floor(Date.now() / 60000)
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
    const minuteTimestamp = Math.floor(timestamp / 60000) * 60000
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
  const subscribe = useCallback(
    (callback: () => void) => timestampScheduler.subscribe(timestamp, callback),
    [timestamp],
  )
  const getSnapshot = useCallback(() => Date.now() >= timestamp, [timestamp])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
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
  return (() => {
    if (transaction.isDeleted) return false
    return transaction.isPending && hasPassed
  })()
}

/* ------------------------------------------------------------------ */
/* Day Key (month-rollover staleness)                                  */
/* ------------------------------------------------------------------ */
const dayListeners = new Set<() => void>()
let currentDayKey = localDayKey(new Date())
let dayTimeoutId: ReturnType<typeof setTimeout> | null = null
let dayAppStateSub: ReturnType<typeof AppState.addEventListener> | null = null
/** Recompute the key and push it to every listener on a new local day. */
function publishDayKey() {
  const next = localDayKey(new Date())
  if (next !== currentDayKey) {
    currentDayKey = next
    for (const cb of dayListeners) cb()
  }
  scheduleNextDay()
}
function scheduleNextDay() {
  if (dayTimeoutId) clearTimeout(dayTimeoutId)
  const now = new Date()
  // `Date` normalizes the calendar date, so the next local midnight is right
  // even when a DST day is 23 or 25 hours long.
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  )
  dayTimeoutId = setTimeout(
    publishDayKey,
    nextMidnight.getTime() - now.getTime(),
  )
}
function subscribeDayKey(callback: () => void) {
  const becameFirst = dayListeners.size === 0
  dayListeners.add(callback)
  if (becameFirst) {
    // Recompute now: subscribers may have been detached across a rollover, and
    // the stored key would otherwise stay stale until the next midnight.
    publishDayKey()
    dayAppStateSub ??= AppState.addEventListener("change", (state) => {
      if (state === "active") publishDayKey()
    })
  }
  return () => {
    dayListeners.delete(callback)
    if (dayListeners.size === 0) {
      if (dayTimeoutId) clearTimeout(dayTimeoutId)
      dayTimeoutId = null
      dayAppStateSub?.remove()
      dayAppStateSub = null
    }
  }
}
/**
 * A `dayKey` that changes once per local day and immediately on app-foreground.
 * Screens whose date-range query is otherwise memoized on frozen inputs use this
 * to re-derive "this month" after a month rollover without a cold start.
 *
 * A live time zone change is not observed on Android (expo-localization only
 * reacts to configuration changes); it is picked up on the next foreground or
 * cold start, when the local date is recomputed.
 */
export function useDayKey(): string {
  return useSyncExternalStore(
    subscribeDayKey,
    () => currentDayKey,
    () => currentDayKey,
  )
}
