/**
 * Full-screen modal to preview an attachment image.
 */

import { Image } from "expo-image"
import { useTranslation } from "react-i18next"
import { Modal } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import type { TransactionAttachment } from "~/types/transactions"

import { View } from "../ui/view"

const H_PAD = 20

const styles = StyleSheet.create(() => ({
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewCloseBtn: {
    position: "absolute",
    top: 50,
    left: H_PAD,
    zIndex: 10,
    padding: 8,
  },
  previewImage: {
    width: "100%",
    flex: 1,
  },
}))

interface AttachmentPreviewModalProps {
  attachment: TransactionAttachment | null
  onClose: () => void
}

export function AttachmentPreviewModal({
  attachment,
  onClose,
}: AttachmentPreviewModalProps) {
  const { t } = useTranslation()
  return (
    <Modal
      visible={attachment !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View native style={styles.previewOverlay}>
        <Pressable
          style={styles.previewCloseBtn}
          onPress={onClose}
          accessibilityLabel={t("components.transactionForm.a11y.closePreview")}
        >
          <IconSvg name="x-outline" size={28} color="#fff" />
        </Pressable>
        {attachment && (
          <Image
            source={{ uri: attachment.uri }}
            style={styles.previewImage}
            contentFit="contain"
          />
        )}
      </View>
    </Modal>
  )
}
