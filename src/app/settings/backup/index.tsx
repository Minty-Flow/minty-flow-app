import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { DataCard } from "~/components/data-card"
import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  defaultExportBaseName,
  deleteExportFile,
  saveCsvToDevice,
  saveJsonToDevice,
  saveZipToDevice,
} from "~/database/services/data-management-service"
import { useAppLockStore } from "~/stores/app-lock.store"
import {
  type ExportRecord,
  useExportHistoryStore,
} from "~/stores/export-history.store"
import { Toast } from "~/utils/toast"

export default function BackupScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const addExport = useExportHistoryStore((s) => s.addExport)

  // The custom file-name field is hidden until the header button reveals it.
  const [baseName, setBaseName] = useState("")
  const [showFileName, setShowFileName] = useState(false)
  const [savingType, setSavingType] = useState<ExportRecord["type"] | null>(
    null,
  )
  const navigation = useNavigation()

  // Header button: reveals / hides the custom file-name field (export only).
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant={showFileName ? "secondary" : "ghost"}
          size="icon"
          onPress={() => setShowFileName((v) => !v)}
          accessibilityLabel={t(
            "screens.settings.dataManagement.fileNameLabel",
          )}
          accessibilityState={{ expanded: showFileName }}
        >
          <IconSvg name="pencil-outline" size={20} />
        </Button>
      ),
    })
  }, [navigation, showFileName, t])

  function runExport(
    save: (baseName?: string) => Promise<{
      uri: string
      fileName: string
      savedToDevice: boolean
    }>,
    type: ExportRecord["type"],
  ) {
    void (async () => {
      // An export hands over the full DB + attachments, so re-verify the user
      // every time the lock is on — even when the app is already unlocked.
      if (
        useAppLockStore.getState().lockAppEnabled &&
        !(await useAppLockStore.getState().verifyIdentity())
      ) {
        return
      }
      setSavingType(type)
      try {
        const { uri, fileName, savedToDevice } = await save(
          baseName.trim() || undefined,
        )
        // Cancelling the folder picker / share sheet is not an export: no toast,
        // no history entry (the service already removed the temporary copy).
        if (!savedToDevice) return
        const evicted = addExport({
          uri,
          fileName,
          type,
          exportedAt: new Date().toISOString(),
        })
        // A record that fell off the history can no longer be opened or
        // removed from the screen, so its file would stay on the device.
        for (const old of evicted) void deleteExportFile(old.uri)
        Toast.success({
          title: t("screens.settings.dataManagement.exportSaved"),
        })
      } catch {
        Toast.error({ title: t("screens.settings.dataManagement.exportError") })
      } finally {
        setSavingType(null)
      }
    })()
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {showFileName && (
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
      )}
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.backup")}
      </Text>
      <Text style={styles.sectionHint}>
        {t("screens.settings.dataManagement.sections.backupHint")}
      </Text>
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
      </View>

      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.spreadsheets")}
      </Text>
      <Text style={styles.sectionHint}>
        {t("screens.settings.dataManagement.sections.spreadsheetsHint")}
      </Text>
      <View style={styles.grid}>
        <DataCard
          icon="file-type-csv-outline"
          title={t("screens.settings.dataManagement.exportCsv")}
          description={t("screens.settings.dataManagement.exportCsvDesc")}
          onPress={() => runExport(saveCsvToDevice, "csv")}
          loading={savingType === "csv"}
        />
      </View>

      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.history")}
      </Text>
      <View style={styles.historyCard}>
        <ActionItem
          icon="history-toggle-outline"
          title={t("screens.settings.dataManagement.history.title")}
          description={t("screens.settings.dataManagement.history.description")}
          onPress={() => router.push("/settings/backup/export-history")}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
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
  historyCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
}))
