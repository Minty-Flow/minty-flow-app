import { StyleSheet } from "react-native-unistyles"

export const budgetModifyStyles = StyleSheet.create((theme) => ({
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
  amountSection: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  periodSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
  periodLabel: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  periodChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  settingsList: {},
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  errorText: {
    ...theme.typography.labelMedium,
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
}))
