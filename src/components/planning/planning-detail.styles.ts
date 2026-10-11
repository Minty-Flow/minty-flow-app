import { StyleSheet } from "react-native-unistyles"

/** Header card, progress bar and amount rows shared by the goal, loan and budget detail screens. */
export const planningDetailStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerCard: {
    padding: 20,
    gap: 14,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  description: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  remainingText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    flexShrink: 0,
    fontWeight: "600",
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
}))
