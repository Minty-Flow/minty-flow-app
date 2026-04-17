import { StyleSheet } from "react-native-unistyles"

export const themeScreenStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
    paddingBottom: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 8,
  },
  headerLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSurface,
    opacity: 0.6,
    marginBottom: 4,
  },
  headerTheme: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentSelected: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    opacity: 0.6,
  },
  segmentTextSelected: {
    color: theme.colors.onPrimary,
    opacity: 1,
  },
  variantPills: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
  },
  pillSelected: {
    backgroundColor: theme.colors.primary,
  },
  pillText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  pillTextSelected: {
    color: theme.colors.onPrimary,
    opacity: 1,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
  },
  colorOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  checkmark: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.onPrimary,
    bottom: 4,
    right: 4,
  },
  standaloneSection: {
    gap: 12,
  },
  sectionTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: "center",
  },
}))
