import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { categoryModifyStyles } from "./category-modify.styles"

interface CategoryFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSave: () => void
}

export function CategoryFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  onCancel,
  onSave,
}: CategoryFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={categoryModifyStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={categoryModifyStyles.button}
      >
        <Text variant="default" style={categoryModifyStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        onPress={onSave}
        style={categoryModifyStyles.button}
        disabled={!formName.trim() || (!isAddMode && !isDirty) || isSubmitting}
      >
        <Text variant="default" style={categoryModifyStyles.saveText}>
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
