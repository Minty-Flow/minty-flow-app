import { formatDistanceToNow } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import * as FileSystem from "expo-file-system/legacy"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  FlatList,
  Modal,
  Share,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  deleteExportFile,
  saveExistingFileToDevice,
} from "~/database/services-sqlite/data-management-service"
import i18n from "~/i18n/config"
import { LangCodeEnum } from "~/i18n/language.constants"
import {
  type ExportRecord,
  useExportHistoryStore,
} from "~/stores/export-history.store"
import { formatFileSize } from "~/utils/format-file-size"
import { Toast } from "~/utils/toast"

function getRelativeLocale() {
  return i18n.language === LangCodeEnum.AR ? ar : enUS
}

function formatRelative(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), {
      addSuffix: true,
      locale: getRelativeLocale(),
    })
  } catch {
    return ""
  }
}

function getRecordIcon(type: ExportRecord["type"]): IconSvgName {
  return type === "json" ? "database-export-outline" : "file-type-csv-outline"
}

function useRecordTitle(record: ExportRecord): string {
  const { t } = useTranslation()
  return record.type === "json"
    ? t("screens.settings.dataManagement.exportJson")
    : t("screens.settings.dataManagement.exportCsv")
}

interface ExportRowProps {
  record: ExportRecord
  fileSize: number | null
  onPress: () => void
}

function ExportRow({ record, fileSize, onPress }: ExportRowProps) {
  const title = useRecordTitle(record)
  const icon = getRecordIcon(record.type)
  const sizeText = fileSize != null ? formatFileSize(fileSize) : null
  const meta = [formatRelative(record.exportedAt), sizeText]
    .filter(Boolean)
    .join(" · ")

  return (
    <Pressable
      style={({ pressed }) => [rowStyles.row, pressed && rowStyles.rowPressed]}
      onPress={onPress}
    >
      <View style={rowStyles.iconWrap}>
        <IconSvg name={icon} size={20} />
      </View>
      <View style={rowStyles.body}>
        <Text style={rowStyles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={rowStyles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <ChevronIcon direction="trailing" size={16} />
    </Pressable>
  )
}

interface ActionModalProps {
  visible: boolean
  record: ExportRecord | null
  fileSize: number | null
  onClose: () => void
  onSave: () => void
  onShare: () => void
  onDelete: () => void
}

function ActionModal({
  visible,
  record,
  fileSize,
  onClose,
  onSave,
  onShare,
  onDelete,
}: ActionModalProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 32, 440)

  const isJson = record?.type === "json"
  const title = record
    ? isJson
      ? t("screens.settings.dataManagement.exportJson")
      : t("screens.settings.dataManagement.exportCsv")
    : ""
  const icon: IconSvgName = isJson
    ? "database-export-outline"
    : "file-type-csv-outline"
  const sizeText = fileSize != null ? formatFileSize(fileSize) : null
  const meta = record
    ? [formatRelative(record.exportedAt), sizeText].filter(Boolean).join(" · ")
    : ""

  return (
    <Modal
      visible={visible && record !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={[actionStyles.backdrop, { width }]}
        onPress={onClose}
        accessibilityLabel={t("common.actions.close")}
        native
        disableRipple
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[actionStyles.card, { maxWidth: maxCardWidth }]}>
            <View style={actionStyles.header}>
              <View style={actionStyles.headerIcon}>
                <IconSvg name={icon} size={22} />
              </View>
              <View style={actionStyles.headerBody}>
                <Text style={actionStyles.headerTitle} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={actionStyles.headerMeta} numberOfLines={1}>
                  {meta}
                </Text>
              </View>
            </View>

            <View
              style={[
                actionStyles.divider,
                { backgroundColor: `${theme.colors.onSurface}12` },
              ]}
            />

            <ActionButton
              icon="download-outline"
              label={t("screens.settings.dataManagement.history.saveAs")}
              onPress={onSave}
            />
            <ActionButton
              icon="share-outline"
              label={t("screens.settings.dataManagement.history.share")}
              onPress={onShare}
            />
            <ActionButton
              icon="trash-outline"
              label={t("screens.settings.dataManagement.history.remove")}
              onPress={onDelete}
              destructive
            />
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

interface ActionButtonProps {
  icon: IconSvgName
  label: string
  onPress: () => void
  destructive?: boolean
}

function ActionButton({
  icon,
  label,
  onPress,
  destructive,
}: ActionButtonProps) {
  const { theme } = useUnistyles()
  const color = destructive ? theme.colors.error : theme.colors.onSurface
  return (
    <Pressable
      style={({ pressed }) => [
        actionStyles.actionRow,
        pressed && actionStyles.actionRowPressed,
      ]}
      onPress={onPress}
    >
      <IconSvg name={icon} size={20} color={color} />
      <Text style={[actionStyles.actionLabel, { color }]}>{label}</Text>
    </Pressable>
  )
}

interface ConfirmState {
  visible: boolean
  type: "remove" | "clearAll"
  targetId?: string
}

export default function ExportHistoryScreen() {
  const { t } = useTranslation()
  const { exports, removeExport, clearAll } = useExportHistoryStore()

  const [fileSizes, setFileSizes] = useState<Record<string, number | null>>({})
  const [actionId, setActionId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>({
    visible: false,
    type: "remove",
  })

  useEffect(() => {
    let cancelled = false
    async function loadSizes() {
      const entries = await Promise.all(
        exports.map(async (e) => {
          try {
            const info = await FileSystem.getInfoAsync(e.uri)
            const size =
              info.exists && "size" in info && typeof info.size === "number"
                ? info.size
                : null
            return [e.id, size] as const
          } catch {
            return [e.id, null] as const
          }
        }),
      )
      if (cancelled) return
      setFileSizes(Object.fromEntries(entries))
    }
    loadSizes()
    return () => {
      cancelled = true
    }
  }, [exports])

  const activeRecord = actionId
    ? (exports.find((e) => e.id === actionId) ?? null)
    : null

  const handleSave = useCallback(async () => {
    if (!activeRecord) return
    setActionId(null)
    const ext = activeRecord.type === "json" ? "json" : "csv"
    try {
      const saved = await saveExistingFileToDevice(
        activeRecord.uri,
        activeRecord.fileName,
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
    }
  }, [activeRecord, t])

  const handleShare = useCallback(async () => {
    if (!activeRecord) return
    setActionId(null)
    try {
      const info = await FileSystem.getInfoAsync(activeRecord.uri)
      if (!info.exists) {
        Toast.error({
          title: t("screens.settings.dataManagement.exportFileNotFound"),
        })
        return
      }
      await Share.share({ url: activeRecord.uri, title: activeRecord.fileName })
    } catch {
      Toast.error({
        title: t("screens.settings.dataManagement.exportError"),
      })
    }
  }, [activeRecord, t])

  function handleDeletePress() {
    if (!activeRecord) return
    setConfirm({ visible: true, type: "remove", targetId: activeRecord.id })
    setActionId(null)
  }

  function handleClearAllPress() {
    setConfirm({ visible: true, type: "clearAll" })
  }

  async function handleConfirmDelete() {
    if (confirm.type === "clearAll") {
      await Promise.all(exports.map((r) => deleteExportFile(r.uri)))
      clearAll()
      return
    }
    if (!confirm.targetId) return
    const record = exports.find((e) => e.id === confirm.targetId)
    if (record) await deleteExportFile(record.uri)
    removeExport(confirm.targetId)
  }

  return (
    <View style={styles.container}>
      {exports.length > 0 && (
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [
              styles.clearAllBtn,
              pressed && styles.clearAllBtnPressed,
            ]}
            onPress={handleClearAllPress}
          >
            <IconSvg
              name="trash-outline"
              size={16}
              color={styles.clearAllIcon.color}
            />
            <Text style={styles.clearAllText}>
              {t("screens.settings.dataManagement.history.clearAll")}
            </Text>
          </Pressable>
        </View>
      )}
      <FlatList
        data={exports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExportRow
            record={item}
            fileSize={fileSizes[item.id] ?? null}
            onPress={() => setActionId(item.id)}
          />
        )}
        contentContainerStyle={
          exports.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        ListEmptyComponent={
          <EmptyState
            icon="database-outline"
            title={t("screens.settings.dataManagement.history.empty")}
            description={t(
              "screens.settings.dataManagement.history.emptyDescription",
            )}
          />
        }
      />

      <ActionModal
        visible={actionId !== null}
        record={activeRecord}
        fileSize={activeRecord ? (fileSizes[activeRecord.id] ?? null) : null}
        onClose={() => setActionId(null)}
        onSave={handleSave}
        onShare={handleShare}
        onDelete={handleDeletePress}
      />

      <ConfirmModal
        visible={confirm.visible}
        variant="destructive"
        icon="trash-outline"
        title={t(
          confirm.type === "clearAll"
            ? "screens.settings.dataManagement.history.clearAllConfirmTitle"
            : "screens.settings.dataManagement.history.removeConfirmTitle",
        )}
        description={t(
          confirm.type === "clearAll"
            ? "screens.settings.dataManagement.history.clearAllConfirmMessage"
            : "screens.settings.dataManagement.history.removeConfirmMessage",
        )}
        confirmLabel={t(
          confirm.type === "clearAll"
            ? "screens.settings.dataManagement.history.clearAll"
            : "screens.settings.dataManagement.history.remove",
        )}
        onConfirm={handleConfirmDelete}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemGap: {
    height: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: `${theme.colors.error}1F`,
  },
  clearAllBtnPressed: {
    opacity: 0.7,
  },
  clearAllIcon: {
    color: theme.colors.error,
  },
  clearAllText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.error,
  },
}))

const rowStyles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
  },
  rowPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  meta: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
}))

const actionStyles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  headerMeta: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  actionRowPressed: {
    opacity: 0.6,
  },
  actionLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
  },
}))
