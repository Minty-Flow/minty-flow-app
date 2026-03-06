import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { useCallback, useReducer } from "react"
import { useTranslation } from "react-i18next"

import type TransactionModel from "~/database/models/transaction"
import type { TransactionAttachment } from "~/types/transactions"
import { getFileExtension } from "~/utils/file-icon"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { mergeReducer } from "./form-utils"
import type { AttachmentState } from "./types"

export function useFormAttachments(transaction: TransactionModel | null) {
  const { t } = useTranslation()

  const [attachmentState, setAttachmentState] = useReducer(
    mergeReducer<AttachmentState>,
    null,
    (): AttachmentState => ({
      list: (() => {
        if (!transaction?.extra?.attachments) return []
        try {
          const parsed = JSON.parse(transaction.extra.attachments) as unknown
          if (!Array.isArray(parsed)) return []
          return parsed.map(
            (a: {
              uri: string
              name: string
              size: number
              addedAt: string
              ext: string
            }) => ({
              ...a,
              addedAt: new Date(a.addedAt),
            }),
          )
        } catch {
          return []
        }
      })(),
      preview: null,
      fileToOpen: null,
      toRemove: null,
      addFilesExpanded: false,
    }),
  )

  const addAttachment = useCallback(
    (a: TransactionAttachment) => {
      setAttachmentState({ list: [...attachmentState.list, a] })
    },
    [attachmentState.list],
  )

  const removeAttachment = useCallback(
    (uri: string) => {
      setAttachmentState({
        list: attachmentState.list.filter((x) => x.uri !== uri),
      })
    },
    [attachmentState.list],
  )

  const handleSelectFromFiles = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })
      if (result.canceled) return
      const file = result.assets[0]
      const ext = getFileExtension(file.name)
      addAttachment({
        uri: file.uri,
        name: file.name,
        size: file.size ?? 0,
        addedAt: new Date(),
        ext,
      })
    } catch (e) {
      logger.error("Document picker error", { e })
      Toast.error({
        title: t("components.transactionForm.toast.couldNotSelectFile"),
      })
    }
  }, [addAttachment, t])

  const handleTakePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Camera access is needed to take a photo.",
      })
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    })
    if (result.canceled || !result.assets[0]) return
    const asset = result.assets[0]
    const name = asset.fileName ?? `photo-${Date.now()}.jpg`
    const ext = getFileExtension(name)
    addAttachment({
      uri: asset.uri,
      name,
      size: asset.fileSize ?? 0,
      addedAt: new Date(),
      ext,
    })
  }, [addAttachment])

  const handleSelectMultipleMedia = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Photo library access is needed.",
      })
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.8,
    })
    if (result.canceled || result.assets.length === 0) return
    for (const asset of result.assets) {
      const name =
        asset.fileName ??
        `media-${Date.now()}.${asset.type === "video" ? "mp4" : "jpg"}`
      const ext = getFileExtension(name)
      addAttachment({
        uri: asset.uri,
        name,
        size: asset.fileSize ?? 0,
        addedAt: new Date(),
        ext,
      })
    }
  }, [addAttachment])

  const handleSelectSinglePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Toast.error({
        title: "Permission required",
        description: "Photo library access is needed.",
      })
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    })
    if (result.canceled || !result.assets[0]) return
    const asset = result.assets[0]
    const name = asset.fileName ?? `photo-${Date.now()}.jpg`
    const ext = getFileExtension(name)
    addAttachment({
      uri: asset.uri,
      name,
      size: asset.fileSize ?? 0,
      addedAt: new Date(),
      ext,
    })
  }, [addAttachment])

  return {
    attachmentState,
    setAttachmentState,
    removeAttachment,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,
  }
}
