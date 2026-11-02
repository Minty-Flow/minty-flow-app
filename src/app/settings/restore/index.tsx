import { useLocalSearchParams, useRouter } from "expo-router"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { DataCard } from "~/components/data-card"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
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
import { useOnboardingStore } from "~/stores/onboarding.store"
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

export default function RestoreScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const importSucceeded = useRef(false)

  // Onboarding sends the user here to restore a backup instead of starting
  // fresh; after the restore they land in the app, not back in onboarding.
  const { fromOnboarding } = useLocalSearchParams<{ fromOnboarding?: string }>()
  const importOnly = fromOnboarding === "true"
  const setOnboardingCompleted = useOnboardingStore((s) => s.setCompleted)

  const [isPickingFile, setIsPickingFile] = useState(false)
  const [importSheet, setImportSheet] = useState<ImportSheetState>({
    visible: false,
    restoreSettings: true,
    backup: null,
    recordCount: 0,
    tableCount: 0,
    stagingDir: null,
  })

  function handleImportJson() {
    setIsPickingFile(true)

    Promise.resolve(pickBackupFile())
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

  // Arrived from onboarding: the restore was the whole errand, so land in the
  // app. Navigating inside onConfirm would tear the sheet down mid-close, and
  // the stack must be cleared first or Back returns to onboarding, where
  // "Start fresh" would add presets on top of the import.
  function handleImportConfirmed() {
    if (!importSucceeded.current) return
    importSucceeded.current = false
    // The import replaced the data, so onboarding has nothing left to offer.
    // A no-op when onboarding is already over.
    setOnboardingCompleted()
    if (!importOnly) return
    router.dismissAll()
    router.replace("/")
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.import")}
      </Text>
      <Text style={styles.sectionHint}>
        {t("screens.settings.dataManagement.sections.importHint")}
      </Text>
      <View style={styles.grid}>
        <DataCard
          icon="database-import-outline"
          title={t("screens.settings.dataManagement.importJson")}
          description={t("screens.settings.dataManagement.importJsonDesc")}
          onPress={handleImportJson}
          loading={isPickingFile}
        />
      </View>

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
        confirmLabel={t(
          "screens.settings.dataManagement.importConfirm.confirm",
        )}
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
              {t(
                "screens.settings.dataManagement.importConfirm.restoreSettings",
              )}
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
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 60,
  },
  sectionHint: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    marginBottom: 12,
    paddingHorizontal: 4,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
}))
