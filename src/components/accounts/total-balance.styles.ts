import { StyleSheet } from "react-native-unistyles"

export const totalBalanceStyles = StyleSheet.create((theme) => ({
  label: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
    letterSpacing: 0.8,
  },
  rows: { gap: 5 },
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
