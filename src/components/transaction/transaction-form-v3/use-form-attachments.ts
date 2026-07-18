import * as DocumentPicker from "expo-document-picker"
import * as ImagePicker from "expo-image-picker"
import { useCallback, useReducer, useRef } from "react"
import { useTranslation } from "react-i18next"

import type { Transaction, TransactionAttachment } from "~/types/transactions"
import {
  deleteAttachmentFile,
  persistAttachment,
  resolveAttachmentUri,
} from "~/utils/attachments"
import { getFileExtension } from "~/utils/file-icon"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import { mergeReducer } from "./form-utils"
import type { AttachmentState } from "./types"

export function useFormAttachments(transaction: Transaction | null) {
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
              uri: resolveAttachmentUri(a.uri),
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

  const removedUris = useRef<string[]>([])

  /**
   * Copies each picked file into permanent storage, then appends them in a single
   * dispatch — `mergeReducer` has no functional form, so one dispatch per file would
   * read a stale list and keep only the last.
   */
  const addAttachments = useCallback(
    async (picked: TransactionAttachment[]) => {
      try {
        const persisted = await Promise.all(
          picked.map(async (a) => ({
            ...a,
            uri: resolveAttachmentUri(await persistAttachment(a.uri, a.name)),
          })),
        )
        setAttachmentState({ list: [...attachmentState.list, ...persisted] })
      } catch (e) {
        logger.error("Failed to save attachment", { e })
        Toast.error({
          title: t("components.transactionForm.toast.couldNotSelectFile"),
        })
      }
    },
    [attachmentState.list, t],
  )

  const removeAttachment = useCallback(
    (uri: string) => {
      removedUris.current.push(uri)
      setAttachmentState({
        list: attachmentState.list.filter((x) => x.uri !== uri),
      })
    },
    [attachmentState.list],
  )

  /**
   * Deletes the files of attachments removed during this edit. Call only after a
   * successful save — deleting at remove-time would destroy a still-referenced file
   * if the user then discards the form.
   */
  const flushRemovedAttachments = useCallback(() => {
    for (const uri of removedUris.current) deleteAttachmentFile(uri)
    removedUris.current = []
  }, [])

  const handleSelectFromFiles = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })
      if (result.canceled) return
      const file = result.assets[0]
      const ext = getFileExtension(file.name)
      await addAttachments([
        {
          uri: file.uri,
          name: file.name,
          size: file.size ?? 0,
          addedAt: new Date(),
          ext,
        },
      ])
    } catch (e) {
      logger.error("Document picker error", { e })
      Toast.error({
        title: t("components.transactionForm.toast.couldNotSelectFile"),
      })
    }
  }, [addAttachments, t])

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
    await addAttachments([
      {
        uri: asset.uri,
        name,
        size: asset.fileSize ?? 0,
        addedAt: new Date(),
        ext,
      },
    ])
  }, [addAttachments])

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
    await addAttachments(
      result.assets.map((asset) => {
        const name =
          asset.fileName ??
          `media-${Date.now()}.${asset.type === "video" ? "mp4" : "jpg"}`
        return {
          uri: asset.uri,
          name,
          size: asset.fileSize ?? 0,
          addedAt: new Date(),
          ext: getFileExtension(name),
        }
      }),
    )
  }, [addAttachments])

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
    await addAttachments([
      {
        uri: asset.uri,
        name,
        size: asset.fileSize ?? 0,
        addedAt: new Date(),
        ext,
      },
    ])
  }, [addAttachments])

  return {
    attachmentState,
    setAttachmentState,
    removeAttachment,
    flushRemovedAttachments,
    handleSelectFromFiles,
    handleTakePhoto,
    handleSelectMultipleMedia,
    handleSelectSinglePhoto,
  }
}
