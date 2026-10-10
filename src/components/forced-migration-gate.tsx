/**
 * Startup gate for the one-time legacy-database upgrade: checks the database,
 * walks the user through the backup + upgrade when needed, then renders the app.
 */
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, BackHandler } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  exportLegacyDbForForcedMigration,
  generateLegacyZipBackupForForcedMigration,
  getDatabaseState,
  upgradeLegacyDbToDrizzle,
} from "~/database/forced-migration"
import { saveExistingFileToDevice } from "~/database/services/data-management-service"
import { useDbMigrationStore } from "~/stores/db-migration.store"
import {
  hideDevelopmentNoticeForSession,
  useDevelopmentNoticeStore,
} from "~/stores/development-notice.store"
import { logger } from "~/utils/logger"

import migrations from "../../drizzle/migrations"

export function ForcedMigrationGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const phase = useDbMigrationStore((s) => s.phase)
  const backupUri = useDbMigrationStore((s) => s.backupUri)
  const userBackupUri = useDbMigrationStore((s) => s.userBackupUri)
  const error = useDbMigrationStore((s) => s.error)
  const setPhase = useDbMigrationStore((s) => s.setPhase)
  const markUserBackupSaved = useDbMigrationStore((s) => s.markUserBackupSaved)
  const markExported = useDbMigrationStore((s) => s.markExported)
  const markComplete = useDbMigrationStore((s) => s.markComplete)
  const markFailed = useDbMigrationStore((s) => s.markFailed)
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [backupPromptVisible, setBackupPromptVisible] = useState(false)
  const upgradeNoticeShownRef = useRef(false)
  const migrationRunRef = useRef(false)

  // TODO(remove-after-drizzle-rollout): old SQLite -> Drizzle compatibility gate.
  // Once every supported install has this marker, delete this wrapper and render AppRootLayout directly.

  const showUpgradeNotice = useCallback(() => {
    if (upgradeNoticeShownRef.current) return
    upgradeNoticeShownRef.current = true
    const developmentNotice = useDevelopmentNoticeStore.getState()
    if (!developmentNotice.dismissed) {
      hideDevelopmentNoticeForSession()
      Alert.alert(
        "Your data is ready",
        `Your backup is saved and your data is ready.\n\n${t("common.developmentNotice.message")}`,
        [
          {
            text: "Don't show again",
            onPress: developmentNotice.dismiss,
          },
          { text: t("common.actions.ok") },
        ],
      )
      return
    }
    Alert.alert(
      "Your data is ready",
      "Your backup is saved and your data is ready.",
      [{ text: "OK" }],
    )
  }, [t])

  const runInPlaceUpgrade = useCallback(
    async (createBackup: boolean): Promise<boolean> => {
      setBusy(true)
      migrationRunRef.current = true
      try {
        if (createBackup) {
          if (!userBackupUri) {
            setPhase("exporting")
            const userBackup = await generateLegacyZipBackupForForcedMigration()
            const saved = await saveExistingFileToDevice(
              userBackup.uri,
              userBackup.fileName,
            )
            if (!saved) {
              markFailed(
                "Please save the backup first. The update will continue right after it's safely stored.",
              )
              return false
            }
            markUserBackupSaved(userBackup)
          }
          if (!backupUri) {
            const backup = await exportLegacyDbForForcedMigration()
            markExported(backup)
          }
        }
        setPhase("migrating")
        upgradeLegacyDbToDrizzle(migrations)
        markComplete()
        showUpgradeNotice()
        return true
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        logger.error("Forced DB migration in-place upgrade failed", {
          error: message,
        })
        markFailed(message)
        return false
      } finally {
        migrationRunRef.current = false
        setBusy(false)
      }
    },
    [
      backupUri,
      markComplete,
      markExported,
      markFailed,
      markUserBackupSaved,
      setPhase,
      showUpgradeNotice,
      userBackupUri,
    ],
  )

  const exitApp = useCallback(() => {
    BackHandler.exitApp()
  }, [])

  useEffect(() => {
    if (migrationRunRef.current) return
    if (phase === "failed") {
      setChecked(true)
      return
    }
    try {
      const state = getDatabaseState(migrations)
      if (state === "legacy") {
        setPhase("needs_backup")
        setChecked(true)
        setBackupPromptVisible(true)
        return
      }
      if (phase !== "complete") markComplete()
      setChecked(true)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logger.error("Forced DB migration detection failed", { error: message })
      markFailed(message)
      setChecked(true)
    }
  }, [markComplete, markFailed, phase, setPhase])

  if (!checked) return <MigrationState message="Checking database..." />

  if (phase === "idle" || phase === "complete") return <>{children}</>

  if (phase === "needs_backup") {
    return (
      <>
        <ForcedMigrationState
          message="Backup required before update."
          detail="Minty Flow needs to save a ZIP backup on your phone before updating your data."
          actionLabel="Continue"
          busy={busy}
          onAction={() => setBackupPromptVisible(true)}
        />
        <ConfirmSheet
          visible={backupPromptVisible && !busy}
          onRequestClose={exitApp}
          onConfirm={async () => {
            await runInPlaceUpgrade(true)
          }}
          title="Save a backup first"
          description="This update changes how Minty Flow stores your data. Before it starts, we'll ask where to save a ZIP backup on your phone so you have a recovery copy."
          note="After the backup is saved, the update continues automatically. Keep Minty Flow open until it finishes."
          confirmLabel="Save backup"
          cancelLabel="Exit app"
          icon="archive"
          closeOnConfirm={false}
        />
      </>
    )
  }

  if (phase === "exporting" || phase === "exported" || phase === "migrating") {
    return (
      <MigrationState
        message={
          phase === "exporting"
            ? "Before updating your data, Minty Flow needs to save a backup ZIP on your phone."
            : "Backup saved. Updating your data now..."
        }
      />
    )
  }

  if (phase === "failed") {
    return (
      <>
        <ForcedMigrationState
          message="Database upgrade paused."
          detail={error ?? "Unknown error"}
          actionLabel={userBackupUri ? "Try again" : "Save backup"}
          busy={busy}
          onAction={() => {
            if (userBackupUri) {
              void runInPlaceUpgrade(true)
              return
            }
            setBackupPromptVisible(true)
          }}
        />
        <ConfirmSheet
          visible={backupPromptVisible && !busy}
          onRequestClose={exitApp}
          onConfirm={async () => {
            await runInPlaceUpgrade(true)
          }}
          title="Save a backup first"
          description="This update changes how Minty Flow stores your data. Before it starts, we'll ask where to save a ZIP backup on your phone so you have a recovery copy."
          note="After the backup is saved, the update continues automatically. Keep Minty Flow open until it finishes."
          confirmLabel="Save backup"
          cancelLabel="Exit app"
          icon="archive"
          closeOnConfirm={false}
        />
      </>
    )
  }

  return (
    <ForcedMigrationState
      message={
        phase === "needs_backup"
          ? "Waiting to start database upgrade..."
          : "Before updating your data, Minty Flow needs to save a backup ZIP on your phone."
      }
      detail="Keep Minty Flow open until this finishes."
    />
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

function ForcedMigrationState({
  message,
  detail,
  actionLabel,
  onAction,
  busy,
}: {
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => void
  busy?: boolean
}) {
  const { theme } = useUnistyles()
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 24,
        backgroundColor: theme.colors.surface,
      }}
    >
      {(!onAction || busy) && <ActivityIndicatorMinty />}
      <Text variant="h4" style={{ textAlign: "center" }}>
        {message}
      </Text>
      {detail && (
        <Text
          variant="small"
          style={{ color: theme.colors.semantic.semi, textAlign: "center" }}
        >
          {detail}
        </Text>
      )}
      {actionLabel && (
        <Button disabled={!onAction || busy} onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      )}
    </View>
  )
}
