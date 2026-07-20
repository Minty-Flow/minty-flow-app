import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ConfirmModal } from "~/components/confirm-modal"
import { IconSvg, type IconSvgName } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  countBackupRecords,
  defaultExportBaseName,
  deleteStagingDir,
  importBackup,
  type MintyFlowBackup,
  pickBackupFile,
  readPickedBackup,
  restoreAttachmentsFromStaging,
  saveCsvToDevice,
  saveJsonToDevice,
  saveZipToDevice,
  validateBackup,
} from "~/database/services-sqlite/data-management-service"
import {
  type ExportRecord,
  useExportHistoryStore,
} from "~/stores/export-history.store"
import { Toast } from "~/utils/toast"

interface ImportModalState {
  visible: boolean
  backup: MintyFlowBackup | null
  recordCount: number
  tableCount: number
  stagingDir: string | null
}

interface DataCardProps {
  icon: IconSvgName
  title: string
  description: string
  onPress: () => void
  loading?: boolean
}

function DataCard({
  icon,
  title,
  description,
  onPress,
  loading,
}: DataCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.cardIconContainer}>
        {loading ? (
          <ActivityIndicatorMinty size="small" />
        ) : (
          <IconSvg name={icon} size={22} />
        )}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Pressable>
  )
}

export default function DataManagementScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { addExport } = useExportHistoryStore()

  // Onboarding sends the user here purely to restore a backup — exporting and browsing
  // past exports are meaningless before any data exists.
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const importOnly = mode === "import"

  const [baseName, setBaseName] = useState("")
  const [savingType, setSavingType] = useState<ExportRecord["type"] | null>(
    null,
  )
  const [isPickingFile, setIsPickingFile] = useState(false)
  const [importModal, setImportModal] = useState<ImportModalState>({
    visible: false,
    backup: null,
    recordCount: 0,
    tableCount: 0,
    stagingDir: null,
  })

  function runExport(
    save: (baseName?: string) => Promise<{
      uri: string
      fileName: string
      savedToDevice: boolean
    }>,
    type: ExportRecord["type"],
  ) {
    setSavingType(type)

    Promise.resolve(save(baseName.trim() || undefined))
      .then(({ uri, fileName, savedToDevice }) => {
        addExport({ uri, fileName, type, exportedAt: new Date().toISOString() })
        Toast.success({
          title: t(
            savedToDevice
              ? "screens.settings.dataManagement.exportSaved"
              : "screens.settings.dataManagement.exportSavedLocally",
          ),
        })
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.exportError") })
      })
      .finally(() => {
        setSavingType(null)
      })
  }

  function handleImportJson() {
    setIsPickingFile(true)

    Promise.resolve(pickBackupFile())
      .then((file) => {
        // null means the user cancelled the picker — nothing to report.
        if (!file) return null
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
        setImportModal({
          visible: true,
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

  // Returns the promise so ConfirmModal can own the spinner and close on resolve.
  function handleConfirmImport() {
    const { backup, stagingDir } = importModal
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
        if (stagingDir) await restoreAttachmentsFromStaging(stagingDir)
        Toast.success({
          title: t("screens.settings.dataManagement.importSuccess"),
        })
        // Arrived from onboarding: the restore was the whole errand, so land in the app
        // instead of dropping the user into a settings stack rooted at onboarding.
        if (importOnly) router.replace("/")
      })
      .catch(() => {
        if (stagingDir) deleteStagingDir(stagingDir)
        Toast.error({ title: t("screens.settings.dataManagement.importError") })
      })
  }

  function handleCancelImport() {
    if (importModal.stagingDir) deleteStagingDir(importModal.stagingDir)
    setImportModal((s) => ({
      ...s,
      visible: false,
      backup: null,
      stagingDir: null,
    }))
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!importOnly && (
        <>
          <Text style={styles.sectionHeader}>
            {t("screens.settings.dataManagement.sections.export")}
          </Text>
          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                {t("screens.settings.dataManagement.fileNameLabel")}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.clearBtn,
                  baseName.length === 0 && styles.clearBtnDisabled,
                  pressed && styles.clearBtnPressed,
                ]}
                onPress={() => setBaseName("")}
                disabled={baseName.length === 0}
                hitSlop={12}
                accessibilityLabel={t("common.actions.clear")}
              >
                <IconSvg
                  name="x-outline"
                  size={14}
                  color={styles.clearBtnText.color}
                />
                <Text style={styles.clearBtnText}>
                  {t("common.actions.clear")}
                </Text>
              </Pressable>
            </View>
            <Input
              value={baseName}
              onChangeText={setBaseName}
              placeholder={defaultExportBaseName("zip")}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
              returnKeyType="done"
              accessibilityLabel={t(
                "screens.settings.dataManagement.fileNameLabel",
              )}
            />
            <Text style={styles.fieldHelper}>
              {t("screens.settings.dataManagement.fileNameHelper")}
            </Text>
          </View>
          <View style={styles.grid}>
            <DataCard
              icon="file-zip-outline"
              title={t("screens.settings.dataManagement.exportZip")}
              description={t("screens.settings.dataManagement.exportZipDesc")}
              onPress={() => runExport(saveZipToDevice, "zip")}
              loading={savingType === "zip"}
            />
            <DataCard
              icon="database-export-outline"
              title={t("screens.settings.dataManagement.exportJson")}
              description={t("screens.settings.dataManagement.exportJsonDesc")}
              onPress={() => runExport(saveJsonToDevice, "json")}
              loading={savingType === "json"}
            />
            <DataCard
              icon="file-type-csv-outline"
              title={t("screens.settings.dataManagement.exportCsv")}
              description={t("screens.settings.dataManagement.exportCsvDesc")}
              onPress={() => runExport(saveCsvToDevice, "csv")}
              loading={savingType === "csv"}
            />
          </View>
        </>
      )}

      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.import")}
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

      {!importOnly && (
        <>
          <Text style={styles.sectionHeader}>
            {t("screens.settings.dataManagement.sections.history")}
          </Text>
          <View style={styles.historyCard}>
            <ActionItem
              icon="history-toggle-outline"
              title={t("screens.settings.dataManagement.history.title")}
              description={t(
                "screens.settings.dataManagement.history.description",
              )}
              onPress={() =>
                router.push("/settings/data-management/export-history")
              }
            />
          </View>
        </>
      )}

      <ConfirmModal
        visible={importModal.visible}
        variant="destructive"
        icon="alert-triangle"
        title={t("screens.settings.dataManagement.importConfirm.title")}
        description={t("screens.settings.dataManagement.importConfirm.warning")}
        note={t("screens.settings.dataManagement.importConfirm.recordSummary", {
          count: importModal.recordCount,
          tables: importModal.tableCount,
        })}
        confirmLabel={t(
          "screens.settings.dataManagement.importConfirm.confirm",
        )}
        cancelLabel={t("screens.settings.dataManagement.importConfirm.cancel")}
        onConfirm={handleConfirmImport}
        onRequestClose={handleCancelImport}
      />
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
  sectionHeader: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  field: {
    gap: 6,
    marginBottom: 16,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    paddingHorizontal: 4,
  },
  // Taken out of flow so toggling disabled can't reflow the label row or the cards below it.
  clearBtn: {
    position: "absolute",
    end: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 4,
    borderRadius: theme.radius,
  },
  clearBtnDisabled: {
    opacity: 0.4,
  },
  clearBtnPressed: {
    opacity: 0.6,
  },
  clearBtnText: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  fieldHelper: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    minHeight: 150,
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 18,
  },
}))
