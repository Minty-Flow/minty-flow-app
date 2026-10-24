import { useEffect, useRef } from "react"

import { autoPurgeTrash } from "~/database/services/ledger-service"
import { useTrashBinStore } from "~/stores/trash-bin.store"
import { logger } from "~/utils/logger"

const PURGE_THROTTLE_MS = 60 * 60 * 1000 // 1 hour

/**
 * Subscribes to trash retention settings and runs retention cleanup when they change.
 * Syncs with reality: DB + user preference. Skips purge if one ran in the last hour
 * for the same retention period, to avoid redundant work when multiple mounts
 * occur. A changed period always purges: a shorter one has just made more
 * items due.
 */
export function useRetentionCleanup(): void {
  const retentionPeriod = useTrashBinStore((s) => s.retentionPeriod)
  const lastPurgeRef = useRef<{ at: number; period: typeof retentionPeriod }>({
    at: 0,
    period: retentionPeriod,
  })

  const isRunningRef = useRef(false)

  useEffect(() => {
    const now = Date.now()
    const last = lastPurgeRef.current
    if (last.period === retentionPeriod && now - last.at < PURGE_THROTTLE_MS) {
      return
    }
    if (isRunningRef.current) return
    isRunningRef.current = true
    // Keep the purge out of the first render and its transitions.
    let started = false
    const handle = requestIdleCallback(() => {
      started = true
      autoPurgeTrash(retentionPeriod)
        .then(() => {
          lastPurgeRef.current = { at: Date.now(), period: retentionPeriod }
        })
        .catch((e) => logger.error("Trash purge failed", { error: String(e) }))
        .finally(() => {
          isRunningRef.current = false
        })
    })
    return () => {
      // Cancelled before it ran: release the guard (a running purge releases it itself).
      cancelIdleCallback(handle)
      if (!started) isRunningRef.current = false
    }
  }, [retentionPeriod])
}
