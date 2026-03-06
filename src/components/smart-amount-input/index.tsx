import { useCallback, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Keyboard, type TextInput } from "react-native"

import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { currencyRegistryService } from "~/services"
import type { TransactionType } from "~/types/transactions"
import { CALCULATOR_CONFIG, formatDisplayValue } from "~/utils/number-format"
import {
  type ParseResult,
  parseMathExpression,
  sanitizeAmountInput,
} from "~/utils/parse-math-expression"

import { Text } from "../ui/text"
import { View } from "../ui/view"
import { AmountInputRow } from "./amount-input-row"
import { AmountLabelRow } from "./amount-label-row"
import { AmountPreviewChips } from "./amount-preview-chip"
import { MathToolbar } from "./math-toolbar"
import { hasMathOperation, isOperator } from "./math-utils"
import { smartInputStyles } from "./styles"

interface SmartAmountInputProps {
  /** Current amount (positive number; sign is applied by parent for display) */
  value: number
  /** Called when user commits (OK or =). Pass the final number. */
  onChange: (value: number) => void
  /** Currency code for symbol and formatting */
  currencyCode?: string
  /** Error message to show below input (e.g. form validation) */
  error?: string
  /** Label above input (e.g. "AMOUNT") */
  label?: string
  /** Placeholder when empty */
  placeholder?: string
  /** Transaction type (affects currency color) */
  type?: TransactionType
  /** Decimal places for preview and display (default from CALCULATOR_CONFIG) */
  decimalPlaces?: number
}

export const SmartAmountInput = ({
  value,
  onChange,
  currencyCode,
  error,
  label,
  placeholder = "0",
  type,
  decimalPlaces = CALCULATOR_CONFIG.MAX_DECIMALS,
}: SmartAmountInputProps) => {
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showMathToolbar, setShowMathToolbar] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { t } = useTranslation()
  const resolvedLabel =
    label ?? t("components.transactionForm.fields.amountLabel")

  const currencySymbol = currencyCode
    ? currencyRegistryService.getCurrencySymbol(currencyCode)
    : "#"

  const displayValue = isEditing
    ? inputValue
    : value === 0
      ? ""
      : value.toString()

  const previewResult = useMemo<ParseResult | null>(() => {
    if (!hasMathOperation(displayValue)) return null
    return parseMathExpression(displayValue)
  }, [displayValue])

  const isInMathOperation = hasMathOperation(displayValue)
  const previewValue =
    previewResult && "value" in previewResult ? previewResult.value : null
  const previewError =
    previewResult && "error" in previewResult ? previewResult.error : null

  const handleFocus = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true)
      setInputValue(value === 0 ? "" : value.toString())
    }
  }, [isEditing, value])

  const handleTextChange = useCallback(
    (text: string) => {
      const sanitized = sanitizeAmountInput(text)
      if (sanitized.length <= CALCULATOR_CONFIG.MAX_DIGITS) {
        setIsEditing(true)
        setInputValue(sanitized)
        if (!showMathToolbar) {
          const numericValue = parseFloat(sanitized) || 0
          onChange(numericValue)
        }
      }
    },
    [showMathToolbar, onChange],
  )

  const handleOperatorPress = useCallback(
    (op: string) => {
      setIsEditing(true)
      setInputValue((prev) => {
        const cur = isEditing ? prev : value === 0 ? "" : value.toString()
        if (cur.length === 0) return op === "-" ? "-" : ""
        const last = cur.slice(-1)
        if (isOperator(last)) return cur.slice(0, -1) + op
        return cur + op
      })
    },
    [isEditing, value],
  )

  const handleSubmit = useCallback(() => {
    if (previewError) return
    const finalValue =
      previewValue !== null ? previewValue : parseFloat(displayValue) || 0
    onChange(finalValue)
    setIsEditing(false)
    setInputValue(finalValue === 0 ? "" : finalValue.toString())
    Keyboard.dismiss()
  }, [displayValue, previewValue, previewError, onChange])

  const handleBackspace = useCallback(() => {
    setIsEditing(true)
    setInputValue((prev) => {
      const cur = isEditing ? prev : value === 0 ? "" : value.toString()
      const newValue = cur.slice(0, -1)
      if (!showMathToolbar) {
        onChange(parseFloat(newValue) || 0)
      }
      return newValue
    })
  }, [isEditing, value, showMathToolbar, onChange])

  const handleClear = useCallback(() => {
    setIsEditing(true)
    setInputValue("")
    if (!showMathToolbar) {
      onChange(0)
    }
  }, [showMathToolbar, onChange])

  const handleBlur = useCallback(() => {
    if (
      !showMathToolbar &&
      previewValue !== null &&
      !previewError &&
      isEditing
    ) {
      onChange(previewValue)
      setIsEditing(false)
      setInputValue("")
    }
  }, [showMathToolbar, previewValue, previewError, isEditing, onChange])

  const handlePreviewPress = useCallback(() => {
    if (previewValue !== null && !previewError) {
      onChange(previewValue)
      setIsEditing(false)
      setInputValue("")
      Keyboard.dismiss()
    }
  }, [previewValue, previewError, onChange])

  const handleToggleMathToolbar = useCallback(() => {
    setShowMathToolbar((v) => {
      const next = !v
      if (next) scrollIntoView()
      return next
    })
  }, [scrollIntoView])

  const displayPreview =
    previewValue !== null
      ? formatDisplayValue(previewValue.toFixed(decimalPlaces), {
          currency: currencyCode,
          hideSign: true,
        })
      : null

  const typedNumeric =
    !hasMathOperation(displayValue) && displayValue.trim() !== ""
      ? parseFloat(displayValue) || 0
      : null
  const formattedTyped =
    typedNumeric !== null
      ? formatDisplayValue(typedNumeric.toFixed(decimalPlaces), {
          currency: currencyCode,
        })
      : null

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
      <AmountPreviewChips
        formattedTyped={formattedTyped}
        displayPreview={displayPreview}
        previewError={previewError}
        showMathToolbar={showMathToolbar}
        onPreviewPress={handlePreviewPress}
      />
      {error ? <Text style={smartInputStyles.fieldError}>{error}</Text> : null}
    </View>
  )
}
