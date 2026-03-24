/**
 * Reusable confirm modal centered on the screen.
 * Use for delete confirmations or other destructive/important actions.
 */

import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { logger } from "~/utils/logger"

import { Pressable } from "./ui/pressable"

interface ConfirmModalProps {
  /** Whether the modal is visible. */
  visible: boolean
  /** Called when the user requests close (backdrop tap or cancel). */
  onRequestClose: () => void
  /** Called when the user confirms the action. May return a Promise for async flows. */
  onConfirm: () => Promise<void> | void
  /** Title shown in the modal (e.g. "Delete category?"). */
  title: string
  /** Description or warning message. */
  description: string
  /** Label for the confirm button (e.g. "Delete"). */
  confirmLabel?: string
  /** Label for the cancel button. Default "Cancel". */
  cancelLabel?: string
  /** "destructive" uses red/danger styling for the confirm button. */
  variant?: "destructive" | "default"
  /** Optional icon name shown above the title (e.g. "trash"). */
  icon?: IconSvgName
  /** Optional note shown below the description in muted/small text. */
  note?: string
}

export function ConfirmModal({
  visible,
  onRequestClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  icon,
  note,
}: ConfirmModalProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 400)
  const [loading, setLoading] = useState(false)

  const handleConfirm = useCallback(() => {
    setLoading(true)

    Promise.resolve(onConfirm())
      .then(() => {
        onRequestClose()
      })
      .catch((e) => {
        logger.error("Error confirming modal", { error: e })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [onConfirm, onRequestClose])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <Pressable
        style={[styles.backdrop, { width }]}
        onPress={onRequestClose}
        accessibilityLabel={t("common.actions.close")}
        native
        disableRipple
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[styles.card, { maxWidth: maxCardWidth }]}
            accessibilityLabel={title}
            accessibilityRole="alert"
          >
            {icon ? (
              <View style={styles.iconRow}>
                <IconSvg
                  name={icon}
                  size={40}
                  color={styles.iconColor(variant).color}
                />
              </View>
            ) : null}

            <Text variant="h3" style={styles.title}>
              {title}
            </Text>

            <Text variant="p" style={styles.description}>
              {description}
            </Text>

            {note ? (
              <Text variant="small" style={styles.note}>
                {note}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Button
                variant="outline"
                onPress={onRequestClose}
                style={styles.actionButton}
                disabled={loading}
              >
                <Text variant="default">
                  {cancelLabel || t("common.actions.cancel")}
                </Text>
              </Button>

              <Button
                variant={variant === "destructive" ? "destructive" : "default"}
                onPress={handleConfirm}
                style={styles.actionButton}
                disabled={loading}
                accessibilityState={{ busy: loading }}
              >
                {loading ? (
                  <ActivityIndicatorMinty />
                ) : (
                  <Text variant="default">
                    {confirmLabel || t("common.actions.confirm")}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  iconRow: {
    alignItems: "center",
    marginBottom: 4,
  },
  iconColor: (variant: "destructive" | "default") => ({
    color:
      variant === "destructive" ? theme.colors.error : theme.colors.onSurface,
  }),
  title: {
    textAlign: "center",
    fontWeight: "600",
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
  },
  note: {
    textAlign: "center",
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
  },
}))
