/**
 * Startup gate: when this version has database migrations to apply to an
 * existing database with data, offer a backup first. The prompt can only be
 * left through its two buttons (no backdrop tap, swipe or back press).
 */
import { type ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { hasPendingMigrationsWithData } from "~/database/pending-migrations"
import { saveZipToDevice } from "~/database/services/data-management-service"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import migrations from "../../drizzle/migrations"

type Phase = "checking" | "prompt" | "ready"

export function PreUpdateBackupGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<Phase>("checking")

  useEffect(() => {
    try {
      setPhase(hasPendingMigrationsWithData(migrations) ? "prompt" : "ready")
    } catch (error) {
      // Never block the app on a failed check; the migrator reports real problems.
      logger.error("Pending migration check failed", {
        error: error instanceof Error ? error.message : String(error),
      })
      setPhase("ready")
    }
  }, [])

  const handleSaveBackup = async () => {
    try {
      const saved = await saveZipToDevice("minty-flow-before-update")
      // Cancelling the save dialog keeps the prompt open.
      if (saved.savedToDevice) setPhase("ready")
    } catch (error) {
      logger.error("Pre-update backup failed", {
        error: error instanceof Error ? error.message : String(error),
      })
      Toast.error({ title: t("common.preUpdateBackup.failed") })
    }
  }

  if (phase === "ready") return <>{children}</>

  return (
    <>
      <MigrationState message={t("common.preUpdateBackup.checking")} />
      <ConfirmSheet
        visible={phase === "prompt"}
        dismissable={false}
        onRequestClose={() => setPhase("ready")}
        onConfirm={handleSaveBackup}
        closeOnConfirm={false}
        icon="archive"
        title={t("common.preUpdateBackup.title")}
        description={t("common.preUpdateBackup.description")}
        note={t("common.preUpdateBackup.note")}
        confirmLabel={t("common.preUpdateBackup.saveBackup")}
        cancelLabel={t("common.preUpdateBackup.continueWithout")}
      />
    </>
  )
}

export function MigrationState({ message }: { message: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicatorMinty />
      <Text>{message}</Text>
    </View>
  )
}
