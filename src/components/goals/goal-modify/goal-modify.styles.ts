import { StyleSheet } from "react-native-unistyles"

export const goalModifyStyles = StyleSheet.create((theme) => ({
  descriptionSection: {
    gap: 10,
    paddingHorizontal: 20,
  },
  targetAmountSection: {
    gap: 10,
    paddingHorizontal: 20,
  },
  targetDateText: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  targetDatePlaceholder: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.6,
  },
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  archiveIcon: {
    color: theme.colors.onSecondary,
  },
  archiveText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  // Target date row inside settings list
  targetDateSettingsRow: {
    justifyContent: "space-between",
  },
  targetDateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  targetDateRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
}))
