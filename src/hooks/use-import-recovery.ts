import { useEffect } from "react"

import { recoverInterruptedImport } from "~/database/services-sqlite/data-management-service"
import i18n from "~/i18n/config"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

/**
 * Checks once on mount for an interrupted import (process-kill mid-reset).
 * If the emergency snapshot file exists, restores from it and notifies the user.
 */
export function useImportRecovery(): void {
  useEffect(() => {
    recoverInterruptedImport()
      .then((recovered) => {
        if (recovered) {
          Toast.success({
            title: i18n.t("screens.settings.dataManagement.importRecovered"),
          })
        }
      })
      .catch((e) =>
        logger.error("Import recovery failed", { error: String(e) }),
      )
  }, [])
}
