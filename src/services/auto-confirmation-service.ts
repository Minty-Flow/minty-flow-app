import { useSyncExternalStore } from "react"

import {
  getPendingTransactions,
  type TransactionWithRelations,
} from "~/database/drizzle/read-models/transaction-read-model"
import { confirmTransaction } from "~/database/services/ledger-service"
import { TransactionKindEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"

/**
 * Auto-Confirmation Service
 *
 * A pending row is "pre-approved" when its kind's auto-pay switch is on
 * (`autoPaySubscriptions` / `autoPayRepetitive` / `autoPayUpcoming`) and it
 * carries no explicit `requiresManualConfirmation` opt-out.
 * The moment transactionDate passes, pre-approved rows are confirmed so they
 * never linger in an "auto-confirming" state.
 *
 * Architecture:
 * - One singleton, owned by `useTransactionLifecycleSync`. `sweep()` is the
 *   single resilient entry point: it reads every pending row, confirms the
 *   past-due pre-approved ones, and schedules an exact-time timeout for those
 *   due within the 24 h cap.
 * - Exposes a `version` counter so React can subscribe via
 *   useSyncExternalStore (no useEffect needed in consumers).
 * - `sweep()` runs on: startup + every app foreground (from the owning hook),
 *   a 60 s self-interval while active (long foreground sessions), and each
 *   scheduled per-row timeout.
 *
 * Hydration-aware:
 * - Requires explicit configure() call with store config after hydration.
 * - Prevents silent failures if storage switches from sync to async.
 * - Call configure() + start() only AFTER hydration is confirmed.
 *
 * Failure handling:
 * - Per-row confirms are isolated (Promise.allSettled) — one bad row can't
 *   abort the rest.
 * - A sweep is a no-op while a previous sweep is still in flight.
 * - A row whose DB-level confirm keeps throwing is abandoned after
 *   MAX_CONFIRM_FAILURES tries (logged once), until it succeeds or leaves the
 *   pending set. `write-queue.ts` already retries SQLITE_BUSY/LOCKED beneath us.
 */

const MAX_CONFIRM_FAILURES = 3
/** Self-tick so a long foreground session confirms rows as they come due. */
const SWEEP_INTERVAL_MS = 60_000

interface AutoConfirmConfig {
  autoPaySubscriptions: boolean
  autoPayRepetitive: boolean
  autoPayUpcoming: boolean
  updateDateUponConfirmation: boolean
}

class AutoConfirmationService {
  /* ---- internal state ---- */
  private scheduledTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
  private sweepInterval: ReturnType<typeof setInterval> | null = null
  private isActive = false
  private config: AutoConfirmConfig | null = null
  private sweeping = false
  /** txId -> consecutive DB-level confirm failures. */
  private failCounts = new Map<string, number>()

  /* ---- reactive version (for useSyncExternalStore) ---- */
  private version = 0
  private listeners = new Set<() => void>()

  private bump() {
    this.version++
    for (const cb of this.listeners) cb()
  }

  subscribe = (callback: () => void): (() => void) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  getSnapshot = (): number => this.version

  /* ---- lifecycle ---- */

  /**
   * Configure the service with store config.
   * Must be called once after hydration, before start().
   * This removes the implicit store dependency and makes it explicit.
   */
  configure(config: AutoConfirmConfig) {
    this.config = config
  }

  start() {
    if (this.isActive) return
    if (!this.config) {
      throw new Error(
        "AutoConfirmationService must be configured before starting",
      )
    }
    this.isActive = true
    // Long foreground session: a row whose due time was > 24 h out (so no exact
    // timeout) still confirms within a minute of coming due. RN timers freeze in
    // the background, so this costs nothing while suspended.
    this.sweepInterval = setInterval(() => {
      void this.sweep().catch(() => {})
    }, SWEEP_INTERVAL_MS)
  }

  stop() {
    this.isActive = false
    this.clearAllSchedules()
    this.failCounts.clear()
    this.sweeping = false
    if (this.sweepInterval) {
      clearInterval(this.sweepInterval)
      this.sweepInterval = null
    }
  }

  /**
   * The single resilient pass. Reads every pending row and, for each one that is
   * pre-approved and not fail-capped: confirms it now if past due, otherwise
   * schedules an exact-time timeout (within the 24 h cap). Past-due confirms run
   * isolated via Promise.allSettled. A no-op while a previous sweep is running.
   */
  async sweep(): Promise<void> {
    if (!this.config) return
    if (this.sweeping) return
    this.sweeping = true
    try {
      const { updateDateUponConfirmation } = this.config
      const rows = await getPendingTransactions()
      const now = Date.now()
      const eligible = new Set<string>()
      const dueNow: string[] = []

      for (const row of rows) {
        if (!this.shouldAutoConfirm(row) || this.isCapped(row.id)) continue
        eligible.add(row.id)
        const msUntil = row.transactionDate.getTime() - now
        if (msUntil <= 0) {
          dueNow.push(row.id)
        } else {
          this.scheduleTimeout(row.id, msUntil, updateDateUponConfirmation)
        }
      }

      // Drop timeouts + fail-counts for rows that are no longer pending/eligible.
      for (const [txId] of this.scheduledTimeouts) {
        if (!eligible.has(txId)) this.clearTimeout(txId)
      }
      const pendingIds = new Set(rows.map((r) => r.id))
      for (const txId of [...this.failCounts.keys()]) {
        if (!pendingIds.has(txId)) this.failCounts.delete(txId)
      }

      if (dueNow.length > 0) {
        const results = await Promise.allSettled(
          dueNow.map((id) =>
            this.confirmTransaction(id, updateDateUponConfirmation),
          ),
        )
        const confirmed = results.filter(
          (r) => r.status === "fulfilled" && r.value,
        ).length
        if (confirmed > 0) this.bump()
      }
    } catch (e) {
      logger.error("[AutoConfirm] sweep failed", {
        error: e instanceof Error ? e.message : String(e),
      })
    } finally {
      this.sweeping = false
    }
  }

  cancelSchedule(transactionId: string) {
    this.clearTimeout(transactionId)
  }

  clearAllSchedules() {
    for (const timeout of this.scheduledTimeouts.values()) {
      clearTimeout(timeout)
    }
    this.scheduledTimeouts.clear()
  }

  /* ---- helpers ---- */

  /** Determine if a transaction qualifies for auto-confirmation. */
  private shouldAutoConfirm(row: TransactionWithRelations): boolean {
    if (!this.config) {
      return false
    }
    if (row.isDeleted) return false
    if (!row.isPending) return false
    return isPreapproved(row, this.config)
  }

  /** A row whose DB-level confirm has thrown MAX_CONFIRM_FAILURES times. */
  private isCapped(transactionId: string): boolean {
    return (this.failCounts.get(transactionId) ?? 0) >= MAX_CONFIRM_FAILURES
  }

  private scheduleTimeout(
    transactionId: string,
    msUntil: number,
    updateDate: boolean,
  ) {
    this.clearTimeout(transactionId)

    // JS setTimeout clamps delay to a signed 32-bit int (~24.85 days). Any value
    // beyond that wraps to a small positive number and fires almost immediately,
    // confirming the transaction far too early. Cap at 24 h and let the next
    // sweep() re-schedule anything further out.
    const MAX_TIMEOUT_MS = 24 * 60 * 60 * 1000
    if (msUntil > MAX_TIMEOUT_MS) return

    const timeout = setTimeout(() => {
      this.scheduledTimeouts.delete(transactionId)
      if (this.isCapped(transactionId)) return
      void this.confirmTransaction(transactionId, updateDate).then((ok) => {
        if (ok) this.bump()
      })
    }, msUntil)

    this.scheduledTimeouts.set(transactionId, timeout)
  }

  /** Returns true if the row was confirmed without throwing. Never rejects. */
  private async confirmTransaction(
    transactionId: string,
    updateDate: boolean,
  ): Promise<boolean> {
    if (!this.isActive) return false
    try {
      await confirmTransaction(transactionId, {
        updateTransactionDate: updateDate,
      })
      this.failCounts.delete(transactionId)
      return true
    } catch (e) {
      const failures = (this.failCounts.get(transactionId) ?? 0) + 1
      this.failCounts.set(transactionId, failures)
      if (failures >= MAX_CONFIRM_FAILURES) {
        logger.warn("[AutoConfirm] giving up after repeated confirm failures", {
          transactionId,
          failures,
        })
      } else {
        logger.error("[AutoConfirm] confirmTransaction failed", {
          transactionId,
          error: e instanceof Error ? e.message : String(e),
        })
      }
      return false
    }
  }

  private clearTimeout(transactionId: string) {
    const timeout = this.scheduledTimeouts.get(transactionId)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledTimeouts.delete(transactionId)
    }
  }
}

export const autoConfirmationService = new AutoConfirmationService()

/**
 * Subscribe to the service's version counter.
 * Every confirmation bumps the version so the upcoming section re-groups.
 */
export function useAutoConfirmVersion(): number {
  return useSyncExternalStore(
    autoConfirmationService.subscribe,
    autoConfirmationService.getSnapshot,
    autoConfirmationService.getSnapshot,
  )
}

/** Per-kind auto-pay resolution: which switch governs this row. */
type AutoPayConfig = {
  autoPaySubscriptions: boolean
  autoPayRepetitive: boolean
  autoPayUpcoming: boolean
}

/**
 * Check if a transaction should be auto-confirmed (for use in grouping).
 * True = this row's kind switch is on and it has no explicit
 * `requiresManualConfirmation` opt-out, so it auto-confirms once due.
 */
export function isPreapproved(
  row: TransactionWithRelations,
  cfg: AutoPayConfig,
): boolean {
  // A row created in a "require confirmation" mode keeps that opt-out for life.
  if (row.requiresManualConfirmation) return false
  if (row.kind === TransactionKindEnum.UPCOMING) return cfg.autoPayUpcoming
  if (row.kind === TransactionKindEnum.REPETITIVE) return cfg.autoPayRepetitive
  // subscription instances (and any legacy pending row).
  return cfg.autoPaySubscriptions
}
