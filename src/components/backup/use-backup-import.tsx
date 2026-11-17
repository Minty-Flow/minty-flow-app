import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import {
  countBackupRecords,
  deleteStagingDir,
  importBackup,
  type MintyFlowBackup,
  pickBackupFile,
  pickedFileKind,
  readPickedBackup,
  restoreAttachmentsFromStaging,
  restoreProfileImageFromStaging,
  validateBackup,
} from "~/database/services/data-management-service"
import {
  applyBackupProfile,
  applyPortableSettings,
} from "~/stores/portable-settings"
import { Toast } from "~/utils/toast"

interface ImportSheetState {
  visible: boolean
  /** Apply the backup's preferences and profile after the data is restored. */
  restoreSettings: boolean
  backup: MintyFlowBackup | null
  recordCount: number
  tableCount: number
  stagingDir: string | null
}

/**
 * The whole import flow (pick or take a file, validate, confirm, restore) and
 * its confirm sheet. Render `sheet` once; call `start()` to pick a file, or
 * `start({ uri, name })` to import a file already on the device.
 * `onImported` runs after a successful restore, once the sheet has closed.
 */
export function useBackupImport(onImported?: () => void) {
  const { t } = useTranslation()
  const importSucceeded = useRef(false)

  const [isPickingFile, setIsPickingFile] = useState(false)
  const [importSheet, setImportSheet] = useState<ImportSheetState>({
    visible: false,
    restoreSettings: true,
    backup: null,
    recordCount: 0,
    tableCount: 0,
    stagingDir: null,
  })

  function handleImportJson(preset?: { uri: string; name: string }) {
    setIsPickingFile(true)

    Promise.resolve(preset ?? pickBackupFile())
      .then((file) => {
        // null means the user cancelled the picker — nothing to report.
        if (!file) return null
        const kind = pickedFileKind(file.name)
        if (kind === "csv" || kind === "unsupported") {
          Toast.error({
            title: t(
              kind === "csv"
                ? "screens.settings.dataManagement.importCsvRejected"
                : "screens.settings.dataManagement.importUnsupported",
            ),
            description: t(
              "screens.settings.dataManagement.importAcceptedTypes",
            ),
          })
          return null
        }
        return readPickedBackup(file.uri, file.name)
      })
      .then((picked) => {
        if (!picked) return

        const result = validateBackup(picked.json)
        if (!result.success) {
          if (picked.stagingDir) deleteStagingDir(picked.stagingDir)
          const title =
            result.reason === "parse_error"
              ? t("screens.settings.dataManagement.importParseError")
              : t("screens.settings.dataManagement.importValidationError")
          Toast.error({ title, description: result.message })
          return
        }

        const { total, tableCount } = countBackupRecords(result.backup)
        setImportSheet({
          visible: true,
          restoreSettings: true,
          backup: result.backup,
          recordCount: total,
          tableCount,
          stagingDir: picked.stagingDir,
        })
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.importError") })
      })
      .finally(() => {
        setIsPickingFile(false)
      })
  }

  // Returns the promise so ConfirmSheet can own the spinner and close on resolve.
  function handleConfirmImport() {
    const { backup, stagingDir } = importSheet
    if (!backup) return

    return Promise.resolve(importBackup(backup))
      .then(async (result) => {
        if (!result.success) {
          if (stagingDir) deleteStagingDir(stagingDir)
          Toast.error({
            title: t("screens.settings.dataManagement.importError"),
            description: result.error,
          })
          return
        }
        // Only once the DB is committed — a failed import rolls back and must not
        // leave the archive's attachments behind.
        // The data is already replaced, so a failed attachment copy must not
        // read as a failed restore.
        // Preferences and profile apply only now that the data is committed, so
        // a failed import changes nothing. Off when the user unticks the switch.
        if (importSheet.restoreSettings) {
          const imageRestored =
            !!stagingDir &&
            !!backup.profile?.imageFile &&
            restoreProfileImageFromStaging(stagingDir, backup.profile.imageFile)
          if (backup.settings) applyPortableSettings(backup.settings)
          if (backup.profile) applyBackupProfile(backup.profile, imageRestored)
        }
        let attachmentsFailed = false
        if (stagingDir) {
          try {
            await restoreAttachmentsFromStaging(stagingDir)
          } catch {
            attachmentsFailed = true
            deleteStagingDir(stagingDir)
          }
        }
        if (attachmentsFailed) {
          Toast.warn({
            title: t("screens.settings.dataManagement.importSuccess"),
            description: t(
              "screens.settings.dataManagement.importAttachmentsFailed",
            ),
          })
        } else {
          Toast.success({
            title: t("screens.settings.dataManagement.importSuccess"),
          })
        }
        importSucceeded.current = true
      })
      .catch(() => {
        if (stagingDir) deleteStagingDir(stagingDir)
        Toast.error({ title: t("screens.settings.dataManagement.importError") })
      })
  }

  function handleImportConfirmed() {
    if (!importSucceeded.current) return
    importSucceeded.current = false
    onImported?.()
  }

  function handleCancelImport() {
    if (importSheet.stagingDir) deleteStagingDir(importSheet.stagingDir)
    setImportSheet((s) => ({
      ...s,
      visible: false,
      backup: null,
      stagingDir: null,
    }))
  }

  const sheet = (
    <ConfirmSheet
      visible={importSheet.visible}
      variant="destructive"
      icon="alert-triangle"
      title={t("screens.settings.dataManagement.importConfirm.title")}
      description={t("screens.settings.dataManagement.importConfirm.warning")}
      note={t("screens.settings.dataManagement.importConfirm.recordSummary", {
        count: importSheet.recordCount,
        tables: importSheet.tableCount,
      })}
      confirmLabel={t("screens.settings.dataManagement.importConfirm.confirm")}
      cancelLabel={t("screens.settings.dataManagement.importConfirm.cancel")}
      onConfirm={handleConfirmImport}
      onConfirmed={handleImportConfirmed}
      onRequestClose={handleCancelImport}
    >
      {/* Only when the backup carries them: v3 to v5 backups have neither. */}
      {(importSheet.backup?.settings || importSheet.backup?.profile) && (
        <ListItem
          onPress={() =>
            setImportSheet((s) => ({
              ...s,
              restoreSettings: !s.restoreSettings,
            }))
          }
          accessibilityRole="switch"
          accessibilityState={{ checked: importSheet.restoreSettings }}
        >
          <Text variant="default" style={{ flex: 1 }}>
            {t("screens.settings.dataManagement.importConfirm.restoreSettings")}
          </Text>
          <Switch
            value={importSheet.restoreSettings}
            onValueChange={(value) =>
              setImportSheet((s) => ({ ...s, restoreSettings: value }))
            }
          />
        </ListItem>
      )}
    </ConfirmSheet>
  )

  return { start: handleImportJson, isPicking: isPickingFile, sheet }
}
