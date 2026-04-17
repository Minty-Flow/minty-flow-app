import { StyleSheet } from "react-native-unistyles"

export const transactionItemStyles = StyleSheet.create((theme) => ({
  swipeableContainer: {
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: theme.colors.surface,
  },
  mainTouchable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  mainTouchableElevated: {
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  subtitle: {
    color: theme.colors.onSecondary,
    fontSize: theme.typography.labelMedium.fontSize,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amountBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {},
  secondaryAmount: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.customColors?.semi,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statusBadgeText: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
  },
  confirmButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
}))
