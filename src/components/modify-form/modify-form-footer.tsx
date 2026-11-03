import { useTranslation } from "react-i18next"

import { FooterBar } from "~/components/footer-bar"
import { footerBarStyles } from "~/components/footer-bar.styles"
import { KeyboardStickyFooter } from "~/components/keyboard-sticky-footer"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

interface ModifyFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  /** Hide the save button (e.g. an archived account is read-only). */
  hideSave?: boolean
  onCancel: () => void
  onSave: () => void
  /** Footer height, for the screen's `ScrollIntoViewProvider.keyboardInset`. */
  onHeightChange?: (height: number) => void
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
  onHeightChange,
}: ModifyFormFooterProps) {
  const { t } = useTranslation()

  return (
    <KeyboardStickyFooter onHeightChange={onHeightChange}>
      <FooterBar>
        <Button
          variant="outline"
          size="lg"
          onPress={onCancel}
          style={footerBarStyles.button}
        >
          <Text variant="default" style={footerBarStyles.cancelText}>
            {t("common.actions.cancel")}
          </Text>
        </Button>
        {!hideSave && (
          <Button
            variant="default"
            size="lg"
            onPress={onSave}
            style={footerBarStyles.button}
            disabled={
              !formName.trim() || (!isAddMode && !isDirty) || isSubmitting
            }
          >
            <Text variant="default" style={footerBarStyles.saveText}>
              {isSubmitting
                ? t("common.actions.saving")
                : isAddMode
                  ? t("common.actions.create")
                  : t("common.actions.saveChanges")}
            </Text>
          </Button>
        )}
      </FooterBar>
    </KeyboardStickyFooter>
  )
}
