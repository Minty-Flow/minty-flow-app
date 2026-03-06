import { useTranslation } from "react-i18next"
import Animated, { FadeInDown } from "react-native-reanimated"

import { IconSymbol } from "../ui/icon-symbol"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"
import { smartInputStyles } from "./styles"

interface MathToolbarProps {
  isInMathOperation: boolean
  previewError: string | null
  onOperatorPress: (op: string) => void
  onBackspace: () => void
  onClear: () => void
  onSubmit: () => void
}

export const MathToolbar = ({
  isInMathOperation,
  previewError,
  onOperatorPress,
  onBackspace,
  onClear,
  onSubmit,
}: MathToolbarProps) => {
  const { t } = useTranslation()
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={smartInputStyles.mathToolbar}
    >
      <View style={smartInputStyles.mathToolbarRow}>
        {["+", "-", "*", "/"].map((op) => (
          <Pressable
            key={op}
            style={smartInputStyles.mathBtn}
            onPress={() => onOperatorPress(op)}
            accessibilityLabel={t(
              "components.transactionForm.amountInput.insertOperator",
              {
                op:
                  op === "*"
                    ? t("components.transactionForm.amountInput.operatorTimes")
                    : op,
              },
            )}
          >
            <Text style={smartInputStyles.mathBtnText}>
              {op === "*" ? "×" : op}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={smartInputStyles.mathToolbarRow}>
        <Pressable
          style={smartInputStyles.mathBtn}
          onPress={onBackspace}
          accessibilityLabel={t(
            "components.transactionForm.amountInput.backspace",
          )}
        >
          <IconSymbol
            name="backspace"
            size={24}
            color={smartInputStyles.onSurface.color}
          />
        </Pressable>
        <Pressable
          style={smartInputStyles.mathBtn}
          onPress={onClear}
          accessibilityLabel={t("common.actions.clear")}
        >
          <Text style={smartInputStyles.mathBtnText}>C</Text>
        </Pressable>
        <Pressable
          style={[smartInputStyles.mathBtn, smartInputStyles.okBtn]}
          onPress={onSubmit}
          accessibilityLabel={
            isInMathOperation
              ? t("components.transactionForm.amountInput.applyResult")
              : t("components.transactionForm.amountInput.confirmAmount")
          }
          accessibilityState={{ disabled: !!previewError }}
        >
          {isInMathOperation ? (
            <IconSymbol
              name="equal"
              size={24}
              color={smartInputStyles.onPrimary.color}
            />
          ) : (
            <Text style={smartInputStyles.okBtnText}>OK</Text>
          )}
        </Pressable>
      </View>
    </Animated.View>
  )
}
