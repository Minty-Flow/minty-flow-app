import { useTranslation } from "react-i18next"
import {
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface ImportConfirmModalProps {
  visible: boolean
  isLoading: boolean
  recordCount: number
  tableCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function ImportConfirmModal({
  visible,
  isLoading,
  recordCount,
  tableCount,
  onConfirm,
  onCancel,
}: ImportConfirmModalProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const { theme } = useUnistyles()
  const maxCardWidth = Math.min(width - 48, 400)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <Pressable
        style={[styles.backdrop, { width }]}
        onPress={isLoading ? undefined : onCancel}
        accessibilityLabel={t("common.actions.close")}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.card,
              {
                maxWidth: maxCardWidth,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius ?? 16,
              },
            ]}
            pointerEvents="box-none"
          >
            {/* Icon + title header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: `${theme.colors.customColors.expense}20`,
                  },
                ]}
              >
                <IconSvg
                  name="alert-triangle"
                  size={26}
                  color={theme.colors.customColors.expense}
                />
              </View>
              <Text style={styles.title}>
                {t("screens.settings.dataManagement.importConfirm.title")}
              </Text>
            </View>

            {/* Record count summary */}
            <View
              style={[
                styles.summaryBox,
                { backgroundColor: `${theme.colors.onSurface}08` },
              ]}
            >
              <Text style={styles.summaryText}>
                {t(
                  "screens.settings.dataManagement.importConfirm.recordSummary",
                  { count: recordCount, tables: tableCount },
                )}
              </Text>
            </View>

            {/* Warning text */}
            <Text style={styles.warning}>
              {t("screens.settings.dataManagement.importConfirm.warning")}
            </Text>

            {/* Buttons */}
            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    borderColor: theme.colors.customColors.semi,
                    backgroundColor: `${theme.colors.onSurface}08`,
                  },
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={onCancel}
                disabled={isLoading}
              >
                <Text
                  style={[styles.buttonText, { color: theme.colors.onSurface }]}
                >
                  {t("screens.settings.dataManagement.importConfirm.cancel")}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.confirmButton,
                  {
                    backgroundColor: theme.colors.customColors.expense,
                  },
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicatorMinty size="small" color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    {t("screens.settings.dataManagement.importConfirm.confirm")}
                  </Text>
                )}
              </Pressable>
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
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
    color: theme.colors.onSurface,
  },
  summaryBox: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  warning: {
    fontSize: 13,
    color: theme.colors.onSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {},
  buttonPressed: { opacity: 0.7 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
  },
}))
