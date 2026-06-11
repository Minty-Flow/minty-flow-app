import { useTranslation } from "react-i18next"

import { IconSvg } from "../ui/icon-svg"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"
import { smartInputStyles } from "./styles"

interface AmountLabelRowProps {
  label: string
  showMathToolbar: boolean
  onToggle: () => void
}

export const AmountLabelRow = ({
  label,
  showMathToolbar,
  onToggle,
}: AmountLabelRowProps) => {
  const { t } = useTranslation()
  return (
    <View style={smartInputStyles.labelRow}>
      <Text style={smartInputStyles.label}>{label}</Text>
      <Pressable
        style={[
          smartInputStyles.calcIconBtn,
          showMathToolbar && smartInputStyles.calcIconBtnActive,
        ]}
        onPress={onToggle}
        accessibilityLabel={
          showMathToolbar
            ? t("components.transactionForm.amountInput.hideMathActions")
            : t("components.transactionForm.amountInput.showMathActions")
        }
        accessibilityHint={t(
          "components.transactionForm.amountInput.mathToolbarHint",
        )}
      >
        <IconSvg name="calculator" size={24} />
      </Pressable>
    </View>
  )
}
