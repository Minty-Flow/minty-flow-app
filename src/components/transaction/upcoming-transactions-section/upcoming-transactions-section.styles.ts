import { StyleSheet } from "react-native-unistyles"

export const upcomingSectionStyles = StyleSheet.create((theme) => ({
  wrapper: {
    marginBottom: 16,
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  seeAllButton: {
    alignSelf: "flex-end",
  },
  seeAllText: {
    ...theme.typography.labelLarge,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subHeaderText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
    letterSpacing: 0.5,
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
