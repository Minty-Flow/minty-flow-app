import { useEffect } from "react"

import { recoverInterruptedImport } from "~/database/services-sqlite/data-management-service"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

/**
 * Checks once on mount for an interrupted import (process-kill mid-reset).
 * If the emergency snapshot file exists, restores from it and notifies the user.
 * This is the safety net for the crash-safe import fix (#2).
 */
export function useImportRecovery(): void {
  useEffect(() => {
    recoverInterruptedImport()
      .then((recovered) => {
        if (recovered) {
          Toast.success({
            title: "Import interrupted — your data has been restored.",
          })
        }
      })
      .catch((e) =>
        logger.error("Import recovery failed", { error: String(e) }),
      )
  }, [])
}
