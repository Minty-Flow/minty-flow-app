import { type FC, useMemo } from "react"
import type { StyleProp, TextStyle } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Text, type TextVariant } from "~/components/ui/text"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"
import { formatDisplayValue } from "~/utils/number-format"

interface MoneyProps {
  value: string | number
  currency?: string
  compact?: boolean
  hideSign?: boolean
  showSign?: boolean
  hideSymbol?: boolean
  /** Controls sign behavior (+, -, or no sign). Used for signedValue and hideSign/showSign. */
  tone?: "auto" | TransactionType
  /** Controls color only. When "auto" or omitted, follows tone. Use when sign and color should differ (e.g. expense amount shown in neutral). */
  visualTone?: "auto" | TransactionType
  style?: StyleProp<TextStyle>
  addParentheses?: boolean
  disablePrivacyMode?: boolean
  variant?: TextVariant
  native?: boolean
}

export const Money: FC<MoneyProps> = ({
  value,
  currency,
  compact = false,
  hideSign = false,
  showSign = false,
  hideSymbol = false,
  tone = "auto",
  visualTone,
  style,
  addParentheses = false,
  disablePrivacyMode = false,
  variant = "p",
  native = false,
}) => {
  const stringValue = typeof value === "number" ? value.toString() : value

  // Preferences
  const privacyModeActive = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)

  // Numeric value (used only for inference)
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(stringValue || "0")

  // Sign behavior: tone controls + / - / no sign
  const resolvedSignTone: TransactionType =
    tone !== "auto"
      ? tone
      : numericValue < 0
        ? TransactionTypeEnum.EXPENSE
        : numericValue > 0
          ? TransactionTypeEnum.INCOME
          : TransactionTypeEnum.TRANSFER

  // Visual tone: color only; defaults to sign tone when "auto" or omitted
  const resolvedVisualTone: TransactionType =
    visualTone === "auto" || visualTone == null ? resolvedSignTone : visualTone

  /**
   * Enforce sign by tone:
   * - income   → +
   * - expense  → -
   * - transfer → no sign
   */
  const signedValue = useMemo(() => {
    const abs = Math.abs(numericValue)

    if (resolvedSignTone === TransactionTypeEnum.EXPENSE) {
      return -abs
    }

    if (resolvedSignTone === TransactionTypeEnum.INCOME) {
      return abs
    }

    // TRANSFER → no sign
    return abs
  }, [numericValue, resolvedSignTone])

  // Format
  const formatted = useMemo(() => {
    const opts = {
      currency,
      currencyDisplay: currencyLook,
      compact,
      hideSign: resolvedSignTone === TransactionTypeEnum.TRANSFER || hideSign,
      showSign: resolvedSignTone !== TransactionTypeEnum.TRANSFER && showSign,
      hideSymbol,
      addParentheses,
    }
    try {
      return formatDisplayValue(signedValue.toString(), opts)
    } catch {
      return formatDisplayValue(signedValue.toString(), {
        compact,
        hideSign,
        showSign,
      })
    }
  }, [
    signedValue,
    currency,
    currencyLook,
    compact,
    hideSign,
    showSign,
    hideSymbol,
    addParentheses,
    resolvedSignTone,
  ])

  // Privacy masking
  const privacyMasked = useMemo(
    () => formatted.replace(/[\d٠-٩۰-۹]/gu, "⁕"),
    [formatted],
  )

  const shouldHide = !disablePrivacyMode && privacyModeActive

  const toneStyles =
    resolvedVisualTone === TransactionTypeEnum.INCOME
      ? styles.income
      : resolvedVisualTone === TransactionTypeEnum.EXPENSE
        ? styles.expense
        : styles.transfer

  return (
    <Text
      variant={variant}
      style={[toneStyles, { fontWeight: "600" }, style]}
      native={native}
    >
      {shouldHide ? privacyMasked : formatted}
    </Text>
  )
}

const styles = StyleSheet.create((theme) => ({
  transfer: {
    color: theme.colors.onSurface,
  },
  income: {
    color: theme.colors.semantic.income,
  },
  expense: {
    color: theme.colors.semantic.expense,
  },
}))
