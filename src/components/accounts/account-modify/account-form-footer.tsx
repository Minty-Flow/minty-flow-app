import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { accountModifyStyles } from "./account-modify.styles"

interface AccountFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  isArchived?: boolean
  onCancel: () => void
  onSave: () => void
}

export function AccountFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  isArchived = false,
  onCancel,
  onSave,
}: AccountFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={accountModifyStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={accountModifyStyles.button}
      >
        <Text variant="default" style={accountModifyStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      {!isArchived && (
        <Button
          variant="default"
          onPress={onSave}
          style={accountModifyStyles.button}
          disabled={
            !formName.trim() || (!isAddMode && !isDirty) || isSubmitting
          }
        >
          <Text variant="default" style={accountModifyStyles.saveText}>
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
