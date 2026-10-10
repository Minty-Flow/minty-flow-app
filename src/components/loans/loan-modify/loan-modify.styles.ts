import { StyleSheet } from "react-native-unistyles"

export const loanModifyStyles = StyleSheet.create((theme) => ({
  descriptionSection: {
    gap: 10,
    paddingHorizontal: 20,
  },
  amountSection: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  settingsList: {},
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  // Due date row inside settings list
  dueDateSettingsRow: {
    justifyContent: "space-between",
  },
  dueDateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dueDateRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dueDateText: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  dueDatePlaceholder: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.6,
  },
}))
