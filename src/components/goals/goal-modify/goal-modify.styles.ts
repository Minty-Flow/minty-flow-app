import { StyleSheet } from "react-native-unistyles"

export const goalModifyStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  form: {
    gap: 10,
  },
  label: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  nameSection: {
    gap: 10,
    paddingHorizontal: 20,
  },
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
  errorText: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.error,
    marginTop: 4,
    textAlign: "center",
  },
  deleteSection: {
    marginTop: 32,
    marginHorizontal: 20,
    gap: 10,
  },
  actionButton: {
    width: "100%",
  },
  deleteIcon: {
    color: theme.colors.error,
  },
  deleteText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.error,
  },
  archiveIcon: {
    color: theme.colors.onSecondary,
  },
  archiveText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  button: {
    flex: 1,
  },
  cancelText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
  // Target date row inside settings list
  targetDateSettingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
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
