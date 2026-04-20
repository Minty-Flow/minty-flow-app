import { StyleSheet } from "react-native-unistyles"

export const filterHeaderStyles = StyleSheet.create((theme) => ({
  container: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  panel: {
    marginTop: 10,
    borderRadius: theme.radius,
    padding: 10,
    borderWidth: 1,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  panelHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  clearText: {
    ...theme.typography.bodyMedium,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  clearHit: {
    padding: 4,
  },
  doneText: {
    ...theme.typography.bodyMedium,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  doneHit: {
    padding: 4,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipScrollRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryRow: {
    marginBottom: 8,
  },
  categorySection: {
    marginTop: 14,
  },
  categoryEmptyHint: {
    marginTop: 14,
    ...theme.typography.bodyMedium,
    color: theme.colors.customColors.semi,
  },
  searchMatchScroll: {
    marginBottom: 10,
  },
  searchMatchRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderRadius: theme.radius,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    paddingVertical: 0,
  },
  includeNotesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  includeNotesLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
  },
}))
