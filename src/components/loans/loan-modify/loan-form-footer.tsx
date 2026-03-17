import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { loanModifyStyles } from "./loan-modify.styles"
import type { LoanFormFooterProps } from "./types"

export function LoanFormFooter({
  formName,
  isAddMode,
  isDirty,
  isSubmitting,
  onCancel,
  onSave,
}: LoanFormFooterProps) {
  const { t } = useTranslation()

  return (
    <View style={loanModifyStyles.actions}>
      <Button
        variant="outline"
        onPress={onCancel}
        style={loanModifyStyles.button}
      >
        <Text variant="default" style={loanModifyStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        onPress={onSave}
        style={loanModifyStyles.button}
        disabled={!formName.trim() || (!isAddMode && !isDirty) || isSubmitting}
      >
        <Text variant="default" style={loanModifyStyles.saveText}>
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
