import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { goalModifyStyles } from "./goal-modify.styles"

interface GoalFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSave: () => void
}

export function GoalFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  onCancel,
  onSave,
}: GoalFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={goalModifyStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={goalModifyStyles.button}
      >
        <Text variant="default" style={goalModifyStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        onPress={onSave}
        style={goalModifyStyles.button}
        disabled={!formName.trim() || (!isAddMode && !isDirty) || isSubmitting}
      >
        <Text variant="default" style={goalModifyStyles.saveText}>
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
