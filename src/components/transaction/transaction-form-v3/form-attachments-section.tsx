import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { DynamicIcon } from "~/components/dynamic-icon"
import { AttachmentPreviewModal } from "~/components/transaction/attachment-preview-modal"
import { Button } from "~/components/ui/button"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionAttachment } from "~/types/transactions"
import { getFileIconForExtension, isImageExtension } from "~/utils/file-icon"
import { formatFileSize } from "~/utils/format-file-size"
import { openFileInExternalApp } from "~/utils/open-file"
import { formatCreatedAt } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"

type AttachmentCallbacks = {
  onPreview: (a: TransactionAttachment) => void
  onOpenExternal: (a: TransactionAttachment) => void
  onRemoveRequest: (a: TransactionAttachment) => void
  onRemoveConfirm: (uri: string) => void
  onRemoveCancel: () => void
  onSelectFromFiles: () => void
  onTakePhoto: () => void
  onSelectMultipleMedia: () => void
  onSelectSinglePhoto: () => void
}

type Props = {
  list: TransactionAttachment[]
  preview: TransactionAttachment | null
  fileToOpen: TransactionAttachment | null
  toRemove: TransactionAttachment | null
  addFilesExpanded: boolean
  onToggleAddFiles: () => void
  onClosePreview: () => void
  onCancelFileOpen: () => void
} & AttachmentCallbacks

export function FormAttachmentsSection({
  list,
  preview,
  fileToOpen,
  toRemove,
  addFilesExpanded,
  onToggleAddFiles,
  onClosePreview,
  onCancelFileOpen,
  onPreview,
  onOpenExternal,
  onRemoveRequest,
  onRemoveConfirm,
  onRemoveCancel,
  onSelectFromFiles,
  onTakePhoto,
  onSelectMultipleMedia,
  onSelectSinglePhoto,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <>
      <View style={transactionFormStyles.fieldBlock}>
        <Text variant="small" style={transactionFormStyles.sectionLabel}>
          {t("components.transactionForm.fields.fileAttachments")}
        </Text>

        {list.length > 0 && (
          <View style={transactionFormStyles.attachmentsList}>
            {list.map((a) => (
              <View key={a.uri} style={transactionFormStyles.attachmentRow}>
                <Pressable
                  style={transactionFormStyles.attachmentRowMain}
                  onPress={() => {
                    if (isImageExtension(a.ext)) {
                      onPreview(a)
                    } else {
                      onOpenExternal(a)
                    }
                  }}
                >
                  <DynamicIcon
                    icon={getFileIconForExtension(a.ext)}
                    size={24}
                    color={theme.colors.primary}
                    variant="badge"
                  />
                  <View style={transactionFormStyles.attachmentInfo}>
                    <Text
                      variant="default"
                      style={transactionFormStyles.attachmentName}
                      numberOfLines={1}
                    >
                      {a.name}
                    </Text>
                    <Text
                      variant="muted"
                      style={transactionFormStyles.attachmentMeta}
                    >
                      {formatCreatedAt(a.addedAt)} • {formatFileSize(a.size)}
                    </Text>
                  </View>
                </Pressable>
                <Button
                  variant="ghost"
                  size="icon"
                  style={transactionFormStyles.attachmentRemoveBtn}
                  onPress={() => onRemoveRequest(a)}
                  accessibilityLabel={t(
                    "components.transactionForm.attachments.a11y.removeAttachment",
                  )}
                  hitSlop={8}
                >
                  <IconSymbol name="close" size={20} />
                </Button>
              </View>
            ))}
          </View>
        )}

        {/* Add files toggle */}
        <Pressable
          style={transactionFormStyles.notesHeader}
          onPress={onToggleAddFiles}
          accessibilityLabel={t(
            "components.transactionForm.attachments.a11y.addFiles",
          )}
          accessibilityHint={
            addFilesExpanded
              ? t(
                  "components.transactionForm.attachments.a11y.addFilesCollapseHint",
                )
              : t(
                  "components.transactionForm.attachments.a11y.addFilesExpandHint",
                )
          }
        >
          <IconSymbol
            name="plus"
            size={20}
            color={theme.colors.customColors.semi}
          />
          <Text variant="default" style={transactionFormStyles.addFilesLabel}>
            {t("components.transactionForm.addFiles.label")}
          </Text>
          <IconSymbol
            name={addFilesExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
        </Pressable>

        {addFilesExpanded && (
          <View style={transactionFormStyles.addFilesOptionsContainer}>
            <Pressable
              style={transactionFormStyles.addFilesOptionRow}
              onPress={onSelectFromFiles}
            >
              <DynamicIcon
                icon="file-document"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={transactionFormStyles.addFilesOptionLabel}
              >
                {t("components.transactionForm.addFiles.selectFromFiles")}
              </Text>
              <IconSymbol
                name="chevron-right"
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>
            <Pressable
              style={transactionFormStyles.addFilesOptionRow}
              onPress={onTakePhoto}
            >
              <DynamicIcon
                icon="camera"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={transactionFormStyles.addFilesOptionLabel}
              >
                {t("components.transactionForm.addFiles.takeAPhoto")}
              </Text>
              <IconSymbol
                name="chevron-right"
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>
            <Pressable
              style={transactionFormStyles.addFilesOptionRow}
              onPress={onSelectMultipleMedia}
            >
              <DynamicIcon
                icon="image-multiple"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={transactionFormStyles.addFilesOptionLabel}
              >
                {t("components.transactionForm.addFiles.selectMultipleMedia")}
              </Text>
              <IconSymbol
                name="chevron-right"
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>
            <Pressable
              style={[
                transactionFormStyles.addFilesOptionRow,
                transactionFormStyles.addFilesOptionRowLast,
              ]}
              onPress={onSelectSinglePhoto}
            >
              <DynamicIcon
                icon="image"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={transactionFormStyles.addFilesOptionLabel}
              >
                {t("components.transactionForm.addFiles.selectAPhoto")}
              </Text>
              <IconSymbol
                name="chevron-right"
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Modals managed here to keep JSX co-located with state */}
      <AttachmentPreviewModal attachment={preview} onClose={onClosePreview} />

      <ConfirmModal
        visible={!!fileToOpen}
        onRequestClose={onCancelFileOpen}
        onConfirm={async () => {
          if (fileToOpen) {
            try {
              await openFileInExternalApp(fileToOpen.uri, fileToOpen.ext)
            } catch {
              // ignore
            }
            onCancelFileOpen()
          }
        }}
        title={t("components.transactionForm.openFile.title", {
          name:
            fileToOpen?.name ??
            t("components.transactionForm.attachments.openFileModal"),
        })}
        description={t("components.transactionForm.openFile.description")}
        confirmLabel={t("common.actions.confirm")}
        cancelLabel={t("common.actions.cancel")}
      />

      <ConfirmModal
        visible={!!toRemove}
        onRequestClose={onRemoveCancel}
        onConfirm={() => {
          if (toRemove) {
            onRemoveConfirm(toRemove.uri)
            onRemoveCancel()
          }
        }}
        title={t("components.transactionForm.removeAttachment.title")}
        description={t(
          "components.transactionForm.removeAttachment.description",
        )}
        confirmLabel={t("common.actions.delete")}
        cancelLabel={t("common.actions.cancel")}
        variant="destructive"
      />
    </>
  )
}
