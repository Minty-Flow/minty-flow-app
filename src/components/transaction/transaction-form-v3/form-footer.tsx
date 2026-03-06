import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { transactionFormStyles } from "./form.styles"

type Props = {
  isNew: boolean
  isSaving: boolean
  isDirty: boolean
  onCancel: () => void
  onSave: () => void
}

export function FormFooter({
  isNew,
  isSaving,
  isDirty,
  onCancel,
  onSave,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <View style={transactionFormStyles.footer}>
      <Button
        variant="secondary"
        size="lg"
        onPress={onCancel}
        style={transactionFormStyles.footerButton}
        disabled={isSaving}
      >
        <Text style={transactionFormStyles.cancelText}>
          {t("common.actions.cancel")}
        </Text>
      </Button>
      <Button
        variant="default"
        size="lg"
        onPress={onSave}
        style={transactionFormStyles.footerButton}
        disabled={isSaving || (!isNew && !isDirty)}
      >
        {isSaving ? (
          <ActivityIndicatorMinty
            size="small"
            color={theme.colors.onPrimary}
            style={transactionFormStyles.saveSpinner}
          />
        ) : (
          <Text style={transactionFormStyles.saveText}>
            {isNew
              ? t("components.transactionForm.create")
              : t("components.transactionForm.save")}
          </Text>
        )}
      </Button>
    </View>
  )
}
