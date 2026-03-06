import { useTranslation } from "react-i18next"

// import { TextInput } from "react-native"

import type { RefObject } from "react"
import { TextInput } from "react-native"

import type { TransactionType } from "~/types/transactions"
import { CALCULATOR_CONFIG } from "~/utils/number-format"

import { Text } from "../ui/text"
import { View } from "../ui/view"
import { smartInputStyles } from "./styles"

interface AmountInputRowProps {
  currencySymbol: string
  type?: TransactionType
  displayValue: string
  placeholder: string
  inputRef: RefObject<TextInput | null>
  onChangeText: (text: string) => void
  onSubmitEditing: () => void
  onFocus: () => void
  onBlur: () => void
}

export const AmountInputRow = ({
  currencySymbol,
  type,
  displayValue,
  placeholder,
  inputRef,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
}: AmountInputRowProps) => {
  const { t } = useTranslation()
  return (
    <View style={smartInputStyles.inputContainer}>
      <View style={smartInputStyles.currencyWrap}>
        <Text style={smartInputStyles.currencySymbol(type)} numberOfLines={1}>
          {currencySymbol}
        </Text>
      </View>
      <TextInput
        ref={inputRef}
        style={smartInputStyles.mainInput}
        value={displayValue}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={smartInputStyles.semiColor.color}
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
        textAlignVertical="center"
        accessibilityLabel={t("components.transactionForm.a11y.amountInput")}
        accessibilityHint={t("components.transactionForm.amountInput.hint")}
        accessibilityValue={{ text: displayValue || placeholder }}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={CALCULATOR_CONFIG.MAX_DIGITS}
      />
    </View>
  )
}
