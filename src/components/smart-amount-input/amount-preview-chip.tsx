import { useTranslation } from "react-i18next"

import { IconSymbol } from "../ui/icon-symbol"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"
import { smartInputStyles } from "./styles"

interface AmountPreviewChipsProps {
  formattedTyped: string | null
  displayPreview: string | null
  previewError: string | null
  showMathToolbar: boolean
  onPreviewPress: () => void
}

export const AmountPreviewChips = ({
  formattedTyped,
  displayPreview,
  previewError,
  showMathToolbar,
  onPreviewPress,
}: AmountPreviewChipsProps) => {
  const { t } = useTranslation()
  return (
    <>
      {formattedTyped ? (
        <View style={smartInputStyles.formattedChip}>
          <Text style={smartInputStyles.formattedChipLabel}>
            {t("components.transactionForm.amountInput.entered")}:{" "}
          </Text>
          <Text style={smartInputStyles.formattedChipValue}>
            {formattedTyped}
          </Text>
        </View>
      ) : null}

      {displayPreview && !showMathToolbar ? (
        <Pressable
          style={smartInputStyles.previewContainer}
          onPress={onPreviewPress}
          accessibilityLabel={t(
            "components.transactionForm.amountInput.applyResult",
          )}
          accessibilityHint={t(
            "components.transactionForm.amountInput.applyResultHint",
          )}
        >
          <IconSymbol
            name="equal"
            size={18}
            style={smartInputStyles.previewIconLeft}
          />
          <Text style={smartInputStyles.previewLabel}>
            {t("components.transactionForm.amountInput.resultLabel")}{" "}
          </Text>
          <Text style={smartInputStyles.previewValue}>{displayPreview}</Text>
          <IconSymbol
            name="chevron-right"
            size={16}
            color={smartInputStyles.semiColor.color}
            style={smartInputStyles.previewIconRight}
          />
        </Pressable>
      ) : displayPreview ? (
        <View style={smartInputStyles.previewContainer}>
          <Text style={smartInputStyles.previewLabel}>
            {t("components.transactionForm.amountInput.resultLabel")}{" "}
          </Text>
          <Text style={smartInputStyles.previewValue}>{displayPreview}</Text>
        </View>
      ) : null}

      {previewError ? (
        <View
          style={[
            smartInputStyles.previewContainer,
            smartInputStyles.previewErrorContainer,
          ]}
        >
          <Text style={smartInputStyles.previewError}>{previewError}</Text>
        </View>
      ) : null}
    </>
  )
}
