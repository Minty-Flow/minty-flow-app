import * as FileSystem from "expo-file-system/legacy"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ImportConfirmModal } from "~/components/data-management/import-confirm-modal"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
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
} from "~/database/services-sqlite/data-management-service"
import { useExportHistoryStore } from "~/stores/export-history.store"
import { Toast } from "~/utils/toast"

interface ImportModalState {
  visible: boolean
  backup: MintyFlowBackup | null
  recordCount: number
  tableCount: number
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
        <IconSvg name={icon} size={22} />
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

        const result = validateBackup(json)
        if (!result.success) {
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
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.export")}
      </Text>
      <View style={styles.grid}>
        <DataCard
          icon="database-export-outline"
          title={t("screens.settings.dataManagement.exportJson")}
          description={t("screens.settings.dataManagement.exportJsonDesc")}
          onPress={handleExportJson}
          loading={isSavingJson}
        />
        <DataCard
          icon="file-type-csv-outline"
          title={t("screens.settings.dataManagement.exportCsv")}
          description={t("screens.settings.dataManagement.exportCsvDesc")}
          onPress={handleExportCsv}
          loading={isSavingCsv}
        />
      </View>

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
        <DataCard
          icon="history-toggle-outline"
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
