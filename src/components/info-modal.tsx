/**
 * Reusable info modal with title, description, and a single OK button.
 * Use for informational messages (replaces Alert.alert for info-only content).
 */

import { useTranslation } from "react-i18next"
import {
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"

import { Pressable } from "./ui/pressable"

interface InfoModalProps {
  /** Whether the modal is visible. */
  visible: boolean
  /** Called when the user dismisses (OK button or backdrop tap). */
  onRequestClose: () => void
  /** Title shown in the modal. */
  title: string
  /** Body text. */
  description: string
  /** Label for the OK button. Default "OK". */
  okLabel?: string
  /** Optional icon name shown above the title (e.g. "information"). */
  icon?: IconSvgName
}

export function InfoModal({
  visible,
  onRequestClose,
  title,
  description,
  okLabel,
  icon = "info-circle",
}: InfoModalProps) {
  const { t } = useTranslation()
  const resolvedOkLabel = okLabel ?? t("common.actions.ok")
  const { width } = useWindowDimensions()
  const maxCardWidth = Math.min(width - 48, 400)

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
                <IconSvg name={icon} size={40} color={styles.iconColor.color} />
              </View>
            ) : null}

            <Text variant="h3" style={styles.title}>
              {title}
            </Text>

            <Text variant="p" style={styles.description}>
              {description}
            </Text>

            <Button
              variant="default"
              onPress={onRequestClose}
              style={styles.okButton}
            >
              <Text variant="default">{resolvedOkLabel}</Text>
            </Button>
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
  iconColor: {
    color: theme.colors.onSurface,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
  },
  okButton: {
    marginTop: 10,
  },
}))
