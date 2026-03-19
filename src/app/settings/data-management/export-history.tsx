import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Pressable } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  deleteExportFile,
  saveExistingFileToDevice,
} from "~/database/services/data-management-service"
import {
  type ExportRecord,
  useExportHistoryStore,
} from "~/stores/export-history.store"
import { formatCreatedAt } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

interface ConfirmState {
  visible: boolean
  type: "remove" | "clearAll"
  targetId?: string
}

export default function ExportHistoryScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { exports, removeExport, clearAll } = useExportHistoryStore()

  const [savingId, setSavingId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>({
    visible: false,
    type: "remove",
  })

  async function handleSaveAs(record: ExportRecord) {
    setSavingId(record.id)
    try {
      const ext = record.type === "json" ? "json" : "csv"
      const saved = await saveExistingFileToDevice(
        record.uri,
        record.fileName,
        ext,
      )
      if (saved) {
        Toast.success({
          title: t("screens.settings.dataManagement.history.reSaved"),
        })
      }
    } catch (e) {
      const isNotFound = e instanceof Error && e.message === "file_not_found"
      Toast.error({
        title: isNotFound
          ? t("screens.settings.dataManagement.exportFileNotFound")
          : t("screens.settings.dataManagement.exportError"),
      })
    } finally {
      setSavingId(null)
    }
  }

  function confirmRemove(id: string) {
    setConfirm({ visible: true, type: "remove", targetId: id })
  }

  function confirmClearAll() {
    setConfirm({ visible: true, type: "clearAll" })
  }

  async function handleConfirm() {
    if (confirm.type === "clearAll") {
      for (const record of exports) {
        await deleteExportFile(record.uri)
      }
      clearAll()
    } else if (confirm.type === "remove" && confirm.targetId) {
      const record = exports.find((e) => e.id === confirm.targetId)
      if (record) await deleteExportFile(record.uri)
      removeExport(confirm.targetId)
    }
    setConfirm((s) => ({ ...s, visible: false }))
  }

  function renderRow({ item }: { item: ExportRecord }) {
    const isJson = item.type === "json"
    const isSaving = savingId === item.id
    const typeLabel = isJson
      ? t("screens.settings.dataManagement.history.typeJson")
      : t("screens.settings.dataManagement.history.typeCsv")

    return (
      <View
        style={[styles.card, { borderColor: `${theme.colors.onSurface}15` }]}
      >
        <View style={styles.cardHeader}>
          {/* Icon */}
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: `${theme.colors.primary}12` },
            ]}
          >
            <IconSvg
              name={isJson ? "database" : "file"}
              size={24}
              color={theme.colors.primary}
            />
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <View style={styles.cardTopLine}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${theme.colors.primary}12` },
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {typeLabel}
                </Text>
              </View>
              <Text style={styles.rowDate}>
                {formatCreatedAt(item.exportedAt)}
              </Text>
            </View>
            <Text style={styles.rowFileName}>{item.fileName}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          {/* Delete */}
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: `${theme.colors.customColors.expense}12`,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            onPress={() => confirmRemove(item.id)}
            disabled={savingId !== null}
            accessibilityRole="button"
          >
            <IconSvg
              name="trash"
              size={18}
              color={theme.colors.customColors.expense}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: theme.colors.customColors.expense },
              ]}
            >
              {t("screens.settings.dataManagement.history.remove") || "Delete"}
            </Text>
          </Pressable>

          {/* Save As */}
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.saveAsBtn,
              {
                borderColor: theme.colors.primary,
                opacity: pressed ? 0.6 : 1,
              },
              isSaving && styles.btnDisabled,
            ]}
            onPress={() => handleSaveAs(item)}
            disabled={isSaving || savingId !== null}
            accessibilityRole="button"
          >
            {isSaving ? (
              <ActivityIndicatorMinty size="small" />
            ) : (
              <>
                <IconSvg
                  name="download"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {t("screens.settings.dataManagement.history.saveAs")}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {exports.length > 0 && (
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [
              styles.clearAllBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={confirmClearAll}
            accessibilityRole="button"
          >
            <IconSvg
              name="trash"
              size={16}
              color={theme.colors.customColors.expense}
            />
            <Text
              style={[
                styles.clearAllText,
                { color: theme.colors.customColors.expense },
              ]}
            >
              {t("screens.settings.dataManagement.history.clearAll")}
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={exports}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={
          exports.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSvg
              name="database"
              size={48}
              color={theme.colors.customColors.semi}
            />
            <Text style={styles.emptyTitle}>
              {t("screens.settings.dataManagement.history.empty")}
            </Text>
            <Text style={styles.emptyDesc}>
              {t("screens.settings.dataManagement.history.emptyDescription")}
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={confirm.visible}
        title={
          confirm.type === "clearAll"
            ? t("screens.settings.dataManagement.history.clearAllConfirmTitle")
            : t("screens.settings.dataManagement.history.removeConfirmTitle")
        }
        description={
          confirm.type === "clearAll"
            ? t(
                "screens.settings.dataManagement.history.clearAllConfirmMessage",
              )
            : t("screens.settings.dataManagement.history.removeConfirmMessage")
        }
        confirmLabel={
          confirm.type === "clearAll"
            ? t("screens.settings.dataManagement.history.clearAll")
            : t("screens.settings.dataManagement.history.remove")
        }
        onConfirm={handleConfirm}
        onRequestClose={() => setConfirm((s) => ({ ...s, visible: false }))}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: `${theme.colors.customColors.expense}14`,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    gap: 6,
    justifyContent: "center",
  },
  cardTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  rowDate: {
    fontSize: 12,
    color: theme.colors.onSecondary,
  },
  rowFileName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.onSurface,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  saveAsBtn: {
    borderWidth: 1.5,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  separator: {
    height: 16, // Use height for gap between cards
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.onSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
}))
