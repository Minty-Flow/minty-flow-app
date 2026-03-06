import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface ActionButtonsProps {
  onCancelPress: () => void
  onSavePress: () => void
  isSubmitting: boolean
  isAddMode: boolean
  isDirty: boolean
  formName: string
}

export const ActionButtons = ({
  onCancelPress,
  onSavePress,
  isSubmitting,
  isAddMode,
  isDirty,
  formName,
}: ActionButtonsProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.actions}>
      <Button variant="outline" onPress={onCancelPress} style={styles.button}>
        <Text variant="default" style={styles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        onPress={onSavePress}
        style={styles.button}
        disabled={!formName.trim() || (!isAddMode && !isDirty) || isSubmitting}
      >
        <Text variant="default" style={styles.saveText}>
          {isSubmitting
            ? t("common.actions.saving")
            : isAddMode
              ? t("common.actions.create")
              : t("common.actions.saveChanges")}
        </Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  actions: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  button: {
    flex: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
