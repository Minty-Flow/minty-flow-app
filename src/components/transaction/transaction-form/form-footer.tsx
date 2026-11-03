import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { FooterBar } from "~/components/footer-bar"
import { footerBarStyles } from "~/components/footer-bar.styles"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

import { transactionFormStyles } from "./form.styles"

type Props = {
  isNew: boolean
  isSaving: boolean
  isDirty: boolean
  /** A trashed transaction: nothing to save, only a way out. */
  readOnly?: boolean
  onCancel: () => void
  onSave: () => void
}

export function FormFooter({
  isNew,
  isSaving,
  isDirty,
  readOnly = false,
  onCancel,
  onSave,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <FooterBar>
      <Button
        variant="outline"
        size="lg"
        onPress={onCancel}
        style={footerBarStyles.button}
        disabled={isSaving}
      >
        <Text style={footerBarStyles.cancelText}>
          {readOnly ? t("common.actions.close") : t("common.actions.cancel")}
        </Text>
      </Button>
      {readOnly ? null : (
        <Button
          variant="default"
          size="lg"
          onPress={onSave}
          style={footerBarStyles.button}
          disabled={isSaving || (!isNew && !isDirty)}
        >
          {isSaving ? (
            <ActivityIndicatorMinty
              size="small"
              color={theme.colors.onPrimary}
              style={transactionFormStyles.saveSpinner}
            />
          ) : (
            <Text style={footerBarStyles.saveText}>
              {isNew
                ? t("components.transactionForm.create")
                : t("components.transactionForm.save")}
            </Text>
          )}
        </Button>
      )}
    </FooterBar>
  )
}
