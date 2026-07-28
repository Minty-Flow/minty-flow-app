import { StyleSheet } from "react-native-unistyles"

import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

export const smartInputStyles = StyleSheet.create((t) => ({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: t.colors.surface,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: t.colors.semantic.semi,
    ...t.typography.labelMedium,
    fontWeight: "600",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
    marginBottom: 10,
  },
  currencyWrap: {
    // minWidth: 64,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  currencySymbol: (type?: TransactionType) => ({
    fontSize: t.typography.displaySmall.fontSize,
    lineHeight: 44,
    color:
      type === TransactionTypeEnum.EXPENSE
        ? t.colors.semantic.expense
        : type === TransactionTypeEnum.INCOME
          ? t.colors.semantic.income
          : t.colors.onSurface,
    fontWeight: t.typography.displaySmall.fontWeight,
  }),
  mainInput: {
    flex: 1,
    fontSize: t.typography.displaySmall.fontSize,
    color: t.colors.onSurface,
    fontWeight: t.typography.displaySmall.fontWeight,
    height: "100%",
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  calcIconBtn: {
    padding: 8,
    backgroundColor: `${t.colors.onSurface}10`,
    borderRadius: 8,
  },
  calcIconBtnActive: {
    backgroundColor: `${t.colors.primary}20`,
  },
  mathToolbar: {
    marginBottom: 20,
    gap: 10,
  },
  mathToolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mathBtn: {
    backgroundColor: `${t.colors.onSurface}10`,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mathBtnText: {
    color: t.colors.onSurface,
    ...t.typography.headlineMedium,
    fontWeight: "600",
  },
  okBtn: {
    backgroundColor: t.colors.primary,
    width: 80,
  },
  mathBtnDisabled: {
    opacity: 0.4,
  },
  okBtnText: {
    color: t.colors.onPrimary,
    fontWeight: "bold",
    fontSize: t.typography.bodyLarge.fontSize,
  },
  liveRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: `${t.colors.onSurface}12`,
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 8,
  },
  liveRowError: {
    borderTopColor: `${t.colors.error}30`,
  },
  liveExpression: {
    flex: 1,
    color: t.colors.onSecondary,
    fontSize: t.typography.bodyMedium.fontSize,
    fontVariant: ["tabular-nums"],
  },
  liveResult: {
    flexShrink: 1,
    color: t.colors.onSurface,
    fontSize: t.typography.bodyMedium.fontSize,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  previewError: {
    color: t.colors.error,
    fontSize: t.typography.labelLarge.fontSize,
    fontWeight: "500",
  },
  fieldError: {
    color: t.colors.error,
    fontSize: t.typography.labelMedium.fontSize,
    marginTop: 6,
  },
  semiColor: {
    color: t.colors.semantic.semi,
  },
  onSurface: {
    color: t.colors.onSurface,
  },
  onPrimary: {
    color: t.colors.onPrimary,
  },
}))
