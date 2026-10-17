/**
 * Reusable confirm bottom sheet.
 * Use for delete confirmations or other destructive/important actions.
 */
import { useEffect, useRef, useState } from "react"
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
  /**
   * Called when the user confirms the action. May return a Promise for async
   * flows. Return (or resolve) `false` when the action failed: the sheet then
   * stays open.
   */
  onConfirm: () => unknown
  /**
   * Called once the sheet has finished closing after a successful confirm.
   * Navigate here: leaving the screen in `onConfirm` tears the sheet down
   * mid-animation.
   */
  onConfirmed?: () => void
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
  /**
   * false blocks backdrop tap, swipe-down and back press, so the sheet closes
   * only through its buttons. Default true.
   */
  dismissable?: boolean
}
export function ConfirmSheet({
  visible,
  onRequestClose,
  onConfirm,
  onConfirmed,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  icon,
  note,
  closeOnConfirm = true,
  dismissable = true,
}: ConfirmSheetProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const inFlight = useRef(false)
  const confirmed = useRef(false)
  // After a confirm that closes the sheet, `loading` stays on through the exit
  // animation so the buttons do not flip back; a new presentation starts clean.
  useEffect(() => {
    if (visible) setLoading(false)
  }, [visible])
  const handleConfirm = () => {
    if (inFlight.current) return
    inFlight.current = true
    setLoading(true)
    Promise.resolve(onConfirm())
      .then((result) => {
        if (result === false) {
          setLoading(false)
          return
        }
        confirmed.current = true
        if (closeOnConfirm) {
          onRequestClose()
        } else {
          setLoading(false)
        }
      })
      .catch((e) => {
        logger.error("Error confirming sheet", { error: e })
        setLoading(false)
      })
      .finally(() => {
        inFlight.current = false
      })
  }
  // While a confirm runs, the action can remove what the sheet describes (a
  // deleted account, goal...). Keep showing what the user confirmed.
  const live = {
    title,
    description,
    note,
    confirmLabel,
    cancelLabel,
    icon,
    variant,
  }
  const shownRef = useRef(live)
  if (!loading) shownRef.current = live
  const shown = shownRef.current
  const handleDismissed = () => {
    if (!confirmed.current) return
    confirmed.current = false
    onConfirmed?.()
  }
  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onRequestClose}
      onDismissed={handleDismissed}
      dismissable={dismissable && !loading}
    >
      <View style={styles.card}>
        {shown.icon ? (
          <View style={styles.iconRow}>
            <IconSvg
              name={shown.icon}
              size={40}
              color={styles.iconColor(shown.variant).color}
            />
          </View>
        ) : null}

        <Text variant="h3" style={styles.title}>
          {shown.title}
        </Text>

        {shown.description ? (
          <Text variant="p" style={styles.description}>
            {shown.description}
          </Text>
        ) : null}

        {shown.note ? (
          <Text variant="small" style={styles.note}>
            {shown.note}
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
              {shown.cancelLabel || t("common.actions.cancel")}
            </Text>
          </Button>

          <Button
            variant={
              shown.variant === "destructive" ? "destructive" : "default"
            }
            onPress={handleConfirm}
            style={styles.actionButton}
            disabled={loading}
            accessibilityState={{ busy: loading }}
          >
            {loading ? (
              <ActivityIndicatorMinty />
            ) : (
              <Text variant="default">
                {shown.confirmLabel || t("common.actions.confirm")}
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
