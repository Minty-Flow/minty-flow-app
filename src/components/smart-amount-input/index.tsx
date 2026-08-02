import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Keyboard, type TextInput } from "react-native"

import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { currencyRegistryService } from "~/services/currency-registry"
import type { TransactionType } from "~/types/transactions"
import {
  getMinorUnitDigits,
  minorUnitsToDecimalString,
  normalizeMajorUnitInput,
  parseMajorUnits,
} from "~/utils/money"
import { formatEditableNumber, formatMoney } from "~/utils/number-format"
import {
  exceedsFractionDigits,
  type MathErrorCode,
  parseScaledMathExpression,
  sanitizeAmountInput,
} from "~/utils/parse-math-expression"

import { Text } from "../ui/text"
import { View } from "../ui/view"
import { AmountInputRow } from "./amount-input-row"
import { AmountLabelRow } from "./amount-label-row"
import { AmountLivePreview } from "./amount-preview-chip"
import { MathToolbar } from "./math-toolbar"
import {
  hasMathOperation,
  isOperator,
  MAX_AMOUNT_INPUT_LENGTH,
} from "./math-utils"
import { smartInputStyles } from "./styles"

interface SmartAmountInputProps {
  valueMinor: number
  onChangeMinor: (valueMinor: number) => void
  currencyCode: string
  /** Error message to show below input (e.g. form validation) */
  error?: string
  /** Label above input (e.g. "AMOUNT") */
  label?: string
  /** Placeholder when empty */
  placeholder?: string
  /** Transaction type (affects currency color) */
  type?: TransactionType
}
export const SmartAmountInput = ({
  valueMinor,
  onChangeMinor,
  currencyCode,
  error,
  label,
  placeholder = "0",
  type,
}: SmartAmountInputProps) => {
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showMathToolbar, setShowMathToolbar] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { t } = useTranslation()
  const maximumFractionDigits = getMinorUnitDigits(currencyCode)
  const resolvedLabel =
    label ?? t("components.transactionForm.fields.amountLabel")
  const currencySymbol =
    currencyRegistryService.getCurrencySymbol(currencyCode) ?? currencyCode
  const displayValue = isEditing
    ? inputValue
    : valueMinor === 0
      ? ""
      : formatMoney(valueMinor, currencyCode, {
          hideSign: true,
          hideSymbol: true,
        })
  const previewResult = (() => {
    if (!hasMathOperation(displayValue)) return null
    const normalized = normalizeMajorUnitInput(displayValue)
    return normalized === null
      ? { error: "invalidExpression" }
      : parseScaledMathExpression(normalized, maximumFractionDigits)
  })()
  const isInMathOperation = hasMathOperation(displayValue)
  const previewMinor =
    previewResult && "value" in previewResult ? previewResult.value : null
  const previewErrorCode =
    previewResult && "error" in previewResult
      ? (previewResult.error as MathErrorCode)
      : null
  const previewErrorKeys = {
    invalidExpression:
      "components.transactionForm.amountInput.errors.invalidExpression",
    divisionByZero:
      "components.transactionForm.amountInput.errors.divisionByZero",
    invalidResult:
      "components.transactionForm.amountInput.errors.invalidResult",
  } as const satisfies Record<MathErrorCode, string>
  const previewError = previewErrorCode
    ? t(previewErrorKeys[previewErrorCode])
    : null
  const handleFocus = () => {
    if (!isEditing) {
      setIsEditing(true)
      setInputValue(
        valueMinor === 0
          ? ""
          : minorUnitsToDecimalString(valueMinor, currencyCode),
      )
    }
  }
  const handleTextChange = (text: string) => {
    const normalized = normalizeMajorUnitInput(text)
    if (normalized === null) return
    const sanitized = sanitizeAmountInput(normalized)
    if (exceedsFractionDigits(sanitized, maximumFractionDigits)) return
    if (sanitized.length <= MAX_AMOUNT_INPUT_LENGTH) {
      setIsEditing(true)
      setInputValue(sanitized)
      if (!showMathToolbar) {
        try {
          onChangeMinor(
            sanitized ? parseMajorUnits(sanitized, currencyCode) : 0,
          )
        } catch {
          // Keep the incomplete editing value until it becomes valid.
        }
      }
    }
  }
  const handleOperatorPress = (op: string) => {
    setIsEditing(true)
    const currentValue = isEditing
      ? inputValue
      : valueMinor === 0
        ? ""
        : minorUnitsToDecimalString(valueMinor, currencyCode)
    if (currentValue.length === 0) {
      setInputValue(op === "-" ? "-" : "")
      return
    }
    const last = currentValue.slice(-1)
    setInputValue(
      isOperator(last) ? currentValue.slice(0, -1) + op : currentValue + op,
    )
  }
  const commitValue = (): boolean => {
    if (previewError) return false
    let finalValue = previewMinor ?? 0
    try {
      if (previewMinor === null && displayValue) {
        finalValue = parseMajorUnits(displayValue, currencyCode)
      }
    } catch {
      return false
    }
    onChangeMinor(finalValue)
    setIsEditing(false)
    setInputValue("")
    return true
  }
  const handleSubmit = () => {
    if (!commitValue()) return
    if (!isInMathOperation) {
      setShowMathToolbar(false)
    }
    Keyboard.dismiss()
  }
  const handleBackspace = () => {
    setIsEditing(true)
    const currentValue = isEditing
      ? inputValue
      : valueMinor === 0
        ? ""
        : minorUnitsToDecimalString(valueMinor, currencyCode)
    const newValue = currentValue.slice(0, -1)
    setInputValue(newValue)
    if (!showMathToolbar) {
      try {
        onChangeMinor(newValue ? parseMajorUnits(newValue, currencyCode) : 0)
      } catch {
        // Keep the incomplete editing value until it becomes valid.
      }
    }
  }
  const handleClear = () => {
    setIsEditing(true)
    setInputValue("")
    if (!showMathToolbar) {
      onChangeMinor(0)
    }
  }
  const handleBlur = () => {
    if (
      !showMathToolbar &&
      previewMinor !== null &&
      !previewError &&
      isEditing
    ) {
      onChangeMinor(previewMinor)
      setIsEditing(false)
      setInputValue("")
    }
  }
  const handleToggleMathToolbar = () => {
    if (showMathToolbar) {
      if (!commitValue()) return
      setInputValue("")
      setShowMathToolbar(false)
      return
    }
    setShowMathToolbar(true)
    scrollIntoView()
  }
  const displayPreview =
    previewMinor !== null
      ? formatMoney(previewMinor, currencyCode, {
          hideSign: true,
        })
      : null
  const formattedExpression = (() => {
    if (!isEditing || displayValue.trim() === "") return null
    return displayValue
      .replace(/\d+(?:\.\d*)?/g, formatEditableNumber)
      .replaceAll("*", " × ")
      .replaceAll("/", " ÷ ")
      .replaceAll("+", " + ")
      .replaceAll("-", " − ")
      .replace(/\s+/g, " ")
      .trim()
  })()
  return (
    <View ref={wrapperRef} style={smartInputStyles.container}>
      <AmountLabelRow
        label={resolvedLabel}
        showMathToolbar={showMathToolbar}
        onToggle={handleToggleMathToolbar}
      />
      <AmountInputRow
        currencySymbol={currencySymbol}
        type={type}
        displayValue={displayValue}
        placeholder={placeholder}
        inputRef={inputRef}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showMathToolbar ? (
        <MathToolbar
          isInMathOperation={isInMathOperation}
          previewError={previewError}
          onOperatorPress={handleOperatorPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
      ) : null}
      <AmountLivePreview
        expression={formattedExpression}
        result={isInMathOperation ? displayPreview : null}
        error={previewError}
        onPress={handleSubmit}
      />
      {error ? <Text style={smartInputStyles.fieldError}>{error}</Text> : null}
    </View>
  )
}
