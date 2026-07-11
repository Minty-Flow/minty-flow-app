import { StyleSheet } from "react-native-unistyles"

export const upcomingSectionStyles = StyleSheet.create((theme) => ({
  wrapper: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeText: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  collapsedPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniPillText: {
    ...theme.typography.labelMedium,
    fontWeight: "700",
  },
  headerDivider: {
    height: 1,
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
    marginHorizontal: 16,
  },
  seeAllRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  seeAllButton: {
    alignSelf: "flex-end",
  },
  seeAllText: {
    ...theme.typography.labelLarge,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
  },
  pillRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    marginTop: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  pillText: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 4,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subHeaderText: {
    ...theme.typography.labelXSmall,
    fontWeight: "700",
    color: theme.colors.semantic.semi,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  subHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.secondary,
    opacity: 0.5,
  },
  confirmAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confirmAllText: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
  },
}))
