import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { modifyFormStyles } from "./modify-form.styles"

interface ModifyFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  /** Hide the save button (e.g. an archived account is read-only). */
  hideSave?: boolean
  onCancel: () => void
  onSave: () => void
}

/** Cancel / Create-or-Save footer shared by every create / edit form. */
export function ModifyFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  hideSave = false,
  onCancel,
  onSave,
}: ModifyFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={modifyFormStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={modifyFormStyles.button}
      >
        <Text variant="default" style={modifyFormStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      {!hideSave && (
        <Button
          variant="default"
          onPress={onSave}
          style={modifyFormStyles.button}
          disabled={
            !formName.trim() || (!isAddMode && !isDirty) || isSubmitting
          }
        >
          <Text variant="default" style={modifyFormStyles.saveText}>
            {isSubmitting
              ? t("common.actions.saving")
              : isAddMode
                ? t("common.actions.create")
                : t("common.actions.saveChanges")}
          </Text>
        </Button>
      )}
    </View>
  )
}
