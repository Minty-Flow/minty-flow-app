/**
 * Reusable info bottom sheet with title, description, and a single OK button.
 * Use for informational messages (replaces Alert.alert for info-only content).
 */

import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

interface InfoSheetProps {
  /** Whether the sheet is visible. */
  visible: boolean
  /** Called when the user dismisses (OK button or backdrop tap). */
  onRequestClose: () => void
  /** Title shown in the sheet. */
  title: string
  /** Body text. */
  description: string
  /** Label for the OK button. Default "OK". */
  okLabel?: string
  /** Optional icon name shown above the title (e.g. "information"). */
  icon?: IconSvgName
}

export function InfoSheet({
  visible,
  onRequestClose,
  title,
  description,
  okLabel,
  icon = "info-circle",
}: InfoSheetProps) {
  const { t } = useTranslation()
  const resolvedOkLabel = okLabel ?? t("common.actions.ok")

  return (
    <BottomSheet isPresented={visible} onDismiss={onRequestClose}>
      <View style={styles.card}>
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
