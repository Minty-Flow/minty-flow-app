import { useSyncExternalStore } from "react"
import { AppState } from "react-native"

import type { TransactionWithRelations } from "~/database/services/transaction-service"
import {
  confirmTransactionSync,
  getPendingTransactionModelsFull,
} from "~/database/services/transaction-service"
import { logger } from "~/utils/logger"

/**
 * Auto-Confirmation Service
 *
 * When requireConfirmation is false, transactions are "pre-approved":
 * they just wait for their scheduled time. The moment transactionDate
 * passes, the service confirms them immediately so they never linger
 * in an "auto-confirming" state.
 *
 * Architecture:
 * - One singleton that schedules per-transaction timeouts.
 * - Exposes a `version` counter so React can subscribe via
 *   useSyncExternalStore (no useEffect needed in consumers).
 * - On app foreground, sweeps for any past-due transactions.
 *
 * Hydration-aware:
 * - Requires explicit configure() call with store config after hydration.
 * - Prevents silent failures if storage switches from sync to async.
 * - Call configure() + start() only AFTER hydration is confirmed.
 */

type ConfirmCallback = (transactionId: string) => void

interface AutoConfirmConfig {
  requireConfirmation: boolean
  updateDateUponConfirmation: boolean
}

class AutoConfirmationService {
  /* ---- internal state ---- */
  private scheduledTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
  private appStateSubscription: { remove: () => void } | null = null
  private onConfirmedCallbacks = new Set<ConfirmCallback>()
  private isActive = false
  private config: AutoConfirmConfig | null = null

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
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange,
    )
  }

  stop() {
    this.isActive = false
    this.clearAllSchedules()
    if (this.appStateSubscription) {
      this.appStateSubscription.remove()
      this.appStateSubscription = null
    }
  }

  /* ---- public API ---- */

  onConfirmed(callback: ConfirmCallback): () => void {
    this.onConfirmedCallbacks.add(callback)
    return () => this.onConfirmedCallbacks.delete(callback)
  }

  /**
   * Main scheduling entry point.
   * For every qualifying transaction:
   *   - Past due → confirm NOW (fire-and-forget).
   *   - Future   → schedule a timeout for the exact millisecond.
   */
  scheduleTransactions(transactions: TransactionWithRelations[]) {
    if (!this.config) {
      return
    }

    const { updateDateUponConfirmation } = this.config

    const now = Date.now()
    const scheduled = new Set<string>()

    for (const row of transactions) {
      const { transaction } = row
      const txId = transaction.id

      if (!this.shouldAutoConfirm(row)) continue

      const targetTime = transaction.transactionDate.getTime()
      const msUntil = targetTime - now

      if (msUntil <= 0) {
        // Past due → confirm now (no buffer, time has passed)
        void this.confirmTransaction(txId, updateDateUponConfirmation)
      } else {
        // Future → schedule timeout for exact time
        this.scheduleTimeout(txId, msUntil, updateDateUponConfirmation)
      }
      scheduled.add(txId)
    }

    // Clean up stale schedules
    for (const [txId] of this.scheduledTimeouts) {
      if (!scheduled.has(txId)) this.clearTimeout(txId)
    }
  }

  /**
   * Run on app startup (and optionally foreground). Fetches all pending
   * transactions and confirms any that are past-due and pre-approved.
   * Matches migration guide: "Call autoConfirmDueTransactions on app startup".
   */
  async runAutoConfirmDueOnStartup(): Promise<void> {
    if (!this.config) {
      return
    }

    const rows = await getPendingTransactionModelsFull()
    await this.confirmPastDue(rows)
  }

  /**
   * Immediate sweep for all past-due auto-confirm transactions.
   * Fix #3: When date passes, pre-approved (no requiresManualConfirmation) get
   * isPending → false and move from Upcoming to Today; manual-confirm ones stay
   * in Upcoming until user taps Confirm. Called on startup and foreground.
   */
  async confirmPastDue(transactions: TransactionWithRelations[]) {
    if (!this.config) {
      return
    }

    const { updateDateUponConfirmation } = this.config

    const now = Date.now()
    for (const row of transactions) {
      if (!this.shouldAutoConfirm(row)) continue
      if (row.transaction.transactionDate.getTime() <= now) {
        await this.confirmTransaction(
          row.transaction.id,
          updateDateUponConfirmation,
        )
      }
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

    const { transaction } = row
    const { requireConfirmation } = this.config
    const needsManualConfirm =
      transaction.requiresManualConfirmation ?? requireConfirmation

    if (needsManualConfirm) return false
    if (!transaction.isPending) return false
    if (transaction.isDeleted) return false

    return true
  }

  private scheduleTimeout(
    transactionId: string,
    msUntil: number,
    updateDate: boolean,
  ) {
    this.clearTimeout(transactionId)

    const timeout = setTimeout(() => {
      void this.confirmTransaction(transactionId, updateDate)
      this.scheduledTimeouts.delete(transactionId)
    }, msUntil)

    this.scheduledTimeouts.set(transactionId, timeout)
  }

  private async confirmTransaction(transactionId: string, updateDate: boolean) {
    if (!this.isActive) return
    try {
      await confirmTransactionSync(transactionId, {
        updateTransactionDate: updateDate,
      })
      for (const callback of this.onConfirmedCallbacks) {
        callback(transactionId)
      }
      this.bump()
    } catch (e) {
      logger.error("[AutoConfirm] confirmTransaction failed", {
        transactionId,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  private clearTimeout(transactionId: string) {
    const timeout = this.scheduledTimeouts.get(transactionId)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledTimeouts.delete(transactionId)
    }
  }

  private handleAppStateChange = (state: string) => {
    if (state === "active" && this.isActive) {
      this.bump() // Trigger re-render so grouping re-runs
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

/**
 * Check if a transaction should be auto-confirmed (for use in grouping).
 * True = this transaction is pre-approved and will auto-confirm at its time.
 * Follows the same logic for all transactions (manual and recurring):
 * pre-approved when the per-transaction or global requireConfirmation is off.
 */
export function isPreapproved(
  row: TransactionWithRelations,
  globalRequireConfirmation: boolean,
): boolean {
  const { transaction } = row
  const needsManualConfirm =
    transaction.requiresManualConfirmation ?? globalRequireConfirmation
  return !needsManualConfirm
}
