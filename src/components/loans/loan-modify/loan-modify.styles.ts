import { StyleSheet } from "react-native-unistyles"

export const loanModifyStyles = StyleSheet.create((theme) => ({
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
    fontSize: 12,
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
  amountSection: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
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
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  errorText: {
    fontSize: 12,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
  // Date picker modal styles — same pattern as goal/budget modify styles
  datePickerOverlay: {
    flex: 1,
  },
  datePickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  datePickerCancel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  datePickerDone: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  datePickerCancelText: {
    fontSize: 16,
  },
  datePickerDoneText: {
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerBody: {},
  // Due date row inside settings list
  dueDateSettingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  dueDateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dueDateRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dueDateText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  dueDatePlaceholder: {
    fontSize: 16,
    color: theme.colors.onSecondary,
    opacity: 0.6,
  },
}))
