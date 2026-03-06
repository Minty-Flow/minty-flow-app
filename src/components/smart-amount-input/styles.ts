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
    color: t.colors.customColors.semi,
    fontSize: 12,
    fontWeight: "bold",
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
    fontSize: 30,
    lineHeight: 44,
    color:
      type === TransactionTypeEnum.EXPENSE
        ? t.colors.customColors.expense
        : type === TransactionTypeEnum.INCOME
          ? t.colors.customColors.income
          : t.colors.onSurface,
    fontWeight: "500",
  }),
  mainInput: {
    flex: 1,
    fontSize: 30,
    color: t.colors.onSurface,
    fontWeight: "bold",
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
    fontSize: 22,
    fontWeight: "600",
  },
  okBtn: {
    backgroundColor: t.colors.primary,
    width: 80,
  },
  okBtnText: {
    color: t.colors.onPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  formattedChip: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${t.colors.onSurface}10`,
  },
  formattedChipLabel: {
    color: t.colors.customColors.semi,
    fontSize: 13,
  },
  formattedChipValue: {
    color: t.colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  previewContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.colors.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewErrorContainer: {
    backgroundColor: `${t.colors.error}20`,
  },
  previewIconLeft: {
    marginRight: 6,
  },
  previewIconRight: {
    marginLeft: 4,
  },
  previewLabel: {
    color: t.colors.customColors.semi,
    fontSize: 14,
  },
  previewValue: {
    color: t.colors.onSurface,
    fontSize: 16,
    fontWeight: "bold",
  },
  previewError: {
    color: t.colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  fieldError: {
    color: t.colors.error,
    fontSize: 12,
    marginTop: 6,
  },
  semiColor: {
    color: t.colors.customColors.semi,
  },
  onSurface: {
    color: t.colors.onSurface,
  },
  onPrimary: {
    color: t.colors.onPrimary,
  },
}))
