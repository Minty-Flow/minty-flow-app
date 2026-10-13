import { StyleSheet } from "react-native-unistyles"

export const budgetModifyStyles = StyleSheet.create((theme) => ({
  amountSection: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // Inset of a validation message under a full-width row, so it lines up with
  // the row's text.
  rowError: {
    paddingHorizontal: 20,
  },
  periodSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
  periodLabel: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  periodChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  settingsList: {},
  switchRow: {
    justifyContent: "space-between",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
}))
