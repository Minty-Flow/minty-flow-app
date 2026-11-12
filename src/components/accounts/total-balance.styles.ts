import { StyleSheet } from "react-native-unistyles"

export const totalBalanceStyles = StyleSheet.create((theme) => ({
  label: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
    letterSpacing: 0.8,
  },
  labelCompact: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  rows: { gap: 5 },
  rowsCompact: { gap: 4, marginTop: 12 },
  currencyCompact: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currency: {
    fontSize: theme.typography.labelLarge.fontSize,
  },
  amount: {
    ...theme.typography.displaySmall,
    fontWeight: "600",
  },
}))
