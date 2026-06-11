import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { budgetModifyStyles } from "./budget-modify.styles"

interface BudgetFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSave: () => void
}

export function BudgetFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  onCancel,
  onSave,
}: BudgetFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={budgetModifyStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={budgetModifyStyles.button}
      >
        <Text variant="default" style={budgetModifyStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        onPress={onSave}
        style={budgetModifyStyles.button}
        disabled={!formName.trim() || (!isAddMode && !isDirty) || isSubmitting}
      >
        <Text variant="default" style={budgetModifyStyles.saveText}>
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
