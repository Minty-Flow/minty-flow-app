import { StyleSheet } from "react-native-unistyles"

/**
 * Layout shared by every create / edit form (account, budget, category, goal,
 * loan). Form-specific styles live next to each form and only add to these.
 */
export const modifyFormStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  form: {
    gap: 4,
  },
  label: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
    letterSpacing: 0.5,
  },
  errorText: {
    ...theme.typography.labelMedium,
    color: theme.colors.error,
    marginTop: 4,
    textAlign: "center",
  },
  nameSection: {
    gap: 10,
    paddingHorizontal: 20,
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
