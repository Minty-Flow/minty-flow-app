// account-modify.styles.ts

import { StyleSheet } from "react-native-unistyles"

export const accountModifyStyles = StyleSheet.create((theme) => ({
  balanceSection: {
    marginHorizontal: 20,
  },
  settingsList: {
    gap: 0,
  },
  switchesSection: {
    gap: 0,
  },
  switchRow: {
    justifyContent: "space-between",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  archiveIcon: {
    color: theme.colors.onSurface,
  },
  archiveText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  primaryAccountBlock: {
    gap: 4,
  },
  primaryAccountHintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  primaryAccountHintIcon: {
    color: theme.colors.semantic.semi,
  },
  primaryAccountHint: {
    flex: 1,
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
  },
}))
