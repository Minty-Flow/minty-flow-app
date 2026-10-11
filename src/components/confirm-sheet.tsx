/**
 * Reusable confirm bottom sheet.
 * Use for delete confirmations or other destructive/important actions.
 */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { logger } from "~/utils/logger"

interface ConfirmSheetProps {
  /** Whether the sheet is visible. */
  visible: boolean
  /** Called when the user requests close (backdrop tap or cancel). */
  onRequestClose: () => void
  /** Called when the user confirms the action. May return a Promise for async flows. */
  onConfirm: () => Promise<void> | void
  /** Title shown in the sheet (e.g. "Delete category?"). */
  title: string
  /** Description or warning message. Omit for simple confirmations. */
  description?: string
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
  /** Keep the sheet mounted/owned by the parent after confirm resolves. */
  closeOnConfirm?: boolean
}
export function ConfirmSheet({
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
  closeOnConfirm = true,
}: ConfirmSheetProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const handleConfirm = () => {
    setLoading(true)
    Promise.resolve(onConfirm())
      .then(() => {
        if (closeOnConfirm) onRequestClose()
      })
      .catch((e) => {
        logger.error("Error confirming sheet", { error: e })
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onRequestClose}
      dismissable={!loading}
    >
      <View style={styles.card}>
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

        {description ? (
          <Text variant="p" style={styles.description}>
            {description}
          </Text>
        ) : null}

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
    </BottomSheet>
  )
}
const styles = StyleSheet.create((theme) => ({
  card: {
    paddingVertical: 8,
    gap: 16,
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
