import * as FileSystem from "expo-file-system/legacy"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ImportConfirmModal } from "~/components/data-management/import-confirm-modal"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  countBackupRecords,
  importBackup,
  type MintyFlowBackup,
  pickBackupFile,
  saveCsvToDevice,
  saveJsonToDevice,
  validateBackup,
} from "~/database/services/data-management-service"
import { useExportHistoryStore } from "~/stores/export-history.store"
import { Toast } from "~/utils/toast"

interface ImportModalState {
  visible: boolean
  backup: MintyFlowBackup | null
  recordCount: number
  tableCount: number
}

export default function DataManagementScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { addExport } = useExportHistoryStore()

  const [isSavingJson, setIsSavingJson] = useState(false)
  const [isSavingCsv, setIsSavingCsv] = useState(false)
  const [isPickingFile, setIsPickingFile] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importModal, setImportModal] = useState<ImportModalState>({
    visible: false,
    backup: null,
    recordCount: 0,
    tableCount: 0,
  })

  function handleExportJson() {
    setIsSavingJson(true)

    Promise.resolve(saveJsonToDevice())
      .then(({ uri, fileName, savedToDevice }) => {
        addExport({
          uri,
          fileName,
          type: "json",
          exportedAt: new Date().toISOString(),
        })

        if (savedToDevice) {
          Toast.success({
            title: t("screens.settings.dataManagement.exportSaved"),
          })
        } else {
          Toast.success({
            title: t("screens.settings.dataManagement.exportSavedLocally"),
          })
        }
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.exportError") })
      })
      .finally(() => {
        setIsSavingJson(false)
      })
  }

  function handleExportCsv() {
    setIsSavingCsv(true)

    Promise.resolve(saveCsvToDevice())
      .then(({ uri, fileName, savedToDevice }) => {
        addExport({
          uri,
          fileName,
          type: "csv",
          exportedAt: new Date().toISOString(),
        })

        if (savedToDevice) {
          Toast.success({
            title: t("screens.settings.dataManagement.exportSaved"),
          })
        } else {
          Toast.success({
            title: t("screens.settings.dataManagement.exportSavedLocally"),
          })
        }
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.exportError") })
      })
      .finally(() => {
        setIsSavingCsv(false)
      })
  }

  function handleImportJson() {
    setIsPickingFile(true)

    Promise.resolve(pickBackupFile())
      .then((file) => {
        if (!file) {
          Toast.error({
            title: t("screens.settings.dataManagement.importInvalidFile"),
          })
          return null
        }
        return FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        })
      })
      .then((json) => {
        if (!json) return

        const backup = validateBackup(json)
        if (!backup) {
          Toast.error({
            title: t("screens.settings.dataManagement.importValidationError"),
          })
          return
        }

        const { total, tableCount } = countBackupRecords(backup)
        setImportModal({
          visible: true,
          backup,
          recordCount: total,
          tableCount,
        })
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.importError") })
      })
      .finally(() => {
        setIsPickingFile(false)
      })
  }

  function handleConfirmImport() {
    if (!importModal.backup) return
    setIsImporting(true)

    Promise.resolve(importBackup(importModal.backup))
      .then((result) => {
        setImportModal((s) => ({ ...s, visible: false, backup: null }))
        if (result.success) {
          Toast.success({
            title: t("screens.settings.dataManagement.importSuccess"),
          })
        } else {
          Toast.error({
            title: t("screens.settings.dataManagement.importError"),
            description: result.error,
          })
        }
      })
      .catch(() => {
        Toast.error({ title: t("screens.settings.dataManagement.importError") })
      })
      .finally(() => {
        setIsImporting(false)
      })
  }

  function handleCancelImport() {
    setImportModal((s) => ({ ...s, visible: false, backup: null }))
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Export section */}
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.export")}
      </Text>
      <View style={styles.section}>
        <ActionItem
          icon="database-export"
          title={t("screens.settings.dataManagement.exportJson")}
          description={t("screens.settings.dataManagement.exportJsonDesc")}
          onPress={handleExportJson}
          loading={isSavingJson}
        />
        <View style={styles.separator} />
        <ActionItem
          icon="file-type-csv"
          title={t("screens.settings.dataManagement.exportCsv")}
          description={t("screens.settings.dataManagement.exportCsvDesc")}
          onPress={handleExportCsv}
          loading={isSavingCsv}
        />
      </View>
      {/* Import section */}
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.import")}
      </Text>
      <View style={styles.section}>
        <ActionItem
          icon="database-import"
          title={t("screens.settings.dataManagement.importJson")}
          description={t("screens.settings.dataManagement.importJsonDesc")}
          onPress={handleImportJson}
          loading={isPickingFile}
        />
      </View>
      {/* History section */}
      <View style={styles.section}>
        <ActionItem
          icon="history-toggle"
          title={t("screens.settings.dataManagement.history.title")}
          description={t("screens.settings.dataManagement.history.description")}
          onPress={() =>
            router.push("/settings/data-management/export-history")
          }
        />
      </View>
      <ImportConfirmModal
        visible={importModal.visible}
        isLoading={isImporting}
        recordCount={importModal.recordCount}
        tableCount={importModal.tableCount}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
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
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.customColors.semi,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  section: {
    borderRadius: theme.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.customColors.semi,
    marginHorizontal: 20,
  },
}))
