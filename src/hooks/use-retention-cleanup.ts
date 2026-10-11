import { useEffect, useRef } from "react"

import { autoPurgeTrash } from "~/database/services/ledger-service"
import { useTrashBinStore } from "~/stores/trash-bin.store"
import { logger } from "~/utils/logger"

const PURGE_THROTTLE_MS = 60 * 60 * 1000 // 1 hour

/**
 * Subscribes to trash retention settings and runs retention cleanup when they change.
 * Syncs with reality: DB + user preference. Skips purge if one ran in the last hour
 * to avoid redundant work when settings flicker or multiple mounts occur.
 */
export function useRetentionCleanup(): void {
  const retentionPeriod = useTrashBinStore((s) => s.retentionPeriod)
  const lastPurgeRef = useRef<number>(0)

  const isRunningRef = useRef(false)

  useEffect(() => {
    const now = Date.now()
    if (now - lastPurgeRef.current < PURGE_THROTTLE_MS) return
    if (isRunningRef.current) return
    isRunningRef.current = true
    // Keep the purge out of the first render and its transitions.
    let started = false
    const handle = requestIdleCallback(() => {
      started = true
      autoPurgeTrash(retentionPeriod)
        .then(() => {
          lastPurgeRef.current = Date.now()
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
