import { useCallback, useMemo, useRef, useState } from "react"
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
  type ParseResult,
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

  const previewResult = useMemo<ParseResult | null>(() => {
    if (!hasMathOperation(displayValue)) return null
    const normalized = normalizeMajorUnitInput(displayValue)
    return normalized === null
      ? { error: "invalidExpression" }
      : parseScaledMathExpression(normalized, maximumFractionDigits)
  }, [displayValue, maximumFractionDigits])

  const isInMathOperation = hasMathOperation(displayValue)
  const previewMinor =
    previewResult && "value" in previewResult ? previewResult.value : null
  const previewErrorCode =
    previewResult && "error" in previewResult ? previewResult.error : null
  const previewError = previewErrorCode
    ? t(
        `components.transactionForm.amountInput.errors.${previewErrorCode}` as const,
      )
    : null

  const handleFocus = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true)
      setInputValue(
        valueMinor === 0
          ? ""
          : minorUnitsToDecimalString(valueMinor, currencyCode),
      )
    }
  }, [isEditing, valueMinor, currencyCode])

  const handleTextChange = useCallback(
    (text: string) => {
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
    },
    [showMathToolbar, onChangeMinor, currencyCode, maximumFractionDigits],
  )

  const handleOperatorPress = useCallback(
    (op: string) => {
      setIsEditing(true)
      setInputValue((prev) => {
        const cur = isEditing
          ? prev
          : valueMinor === 0
            ? ""
            : minorUnitsToDecimalString(valueMinor, currencyCode)
        if (cur.length === 0) return op === "-" ? "-" : ""
        const last = cur.slice(-1)
        if (isOperator(last)) return cur.slice(0, -1) + op
        return cur + op
      })
    },
    [isEditing, valueMinor, currencyCode],
  )

  const commitValue = useCallback((): boolean => {
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
  }, [displayValue, previewMinor, previewError, onChangeMinor, currencyCode])

  const handleSubmit = useCallback(() => {
    if (!commitValue()) return
    if (!isInMathOperation) {
      setShowMathToolbar(false)
    }
    Keyboard.dismiss()
  }, [commitValue, isInMathOperation])

  const handleBackspace = useCallback(() => {
    setIsEditing(true)
    setInputValue((prev) => {
      const cur = isEditing
        ? prev
        : valueMinor === 0
          ? ""
          : minorUnitsToDecimalString(valueMinor, currencyCode)
      const newValue = cur.slice(0, -1)
      if (!showMathToolbar) {
        try {
          onChangeMinor(newValue ? parseMajorUnits(newValue, currencyCode) : 0)
        } catch {
          // Keep the incomplete editing value until it becomes valid.
        }
      }
      return newValue
    })
  }, [isEditing, valueMinor, showMathToolbar, onChangeMinor, currencyCode])

  const handleClear = useCallback(() => {
    setIsEditing(true)
    setInputValue("")
    if (!showMathToolbar) {
      onChangeMinor(0)
    }
  }, [showMathToolbar, onChangeMinor])

  const handleBlur = useCallback(() => {
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
  }, [showMathToolbar, previewMinor, previewError, isEditing, onChangeMinor])

  const handleToggleMathToolbar = useCallback(() => {
    if (showMathToolbar) {
      if (!commitValue()) return
      setInputValue("")
      setShowMathToolbar(false)
      return
    }

    setShowMathToolbar(true)
    scrollIntoView()
  }, [showMathToolbar, commitValue, scrollIntoView])

  const displayPreview =
    previewMinor !== null
      ? formatMoney(previewMinor, currencyCode, {
          hideSign: true,
        })
      : null

  const formattedExpression = useMemo(() => {
    if (!isEditing || displayValue.trim() === "") return null
    return displayValue
      .replace(/\d+(?:\.\d*)?/g, formatEditableNumber)
      .replaceAll("*", " × ")
      .replaceAll("/", " ÷ ")
      .replaceAll("+", " + ")
      .replaceAll("-", " − ")
      .replace(/\s+/g, " ")
      .trim()
  }, [displayValue, isEditing])

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
