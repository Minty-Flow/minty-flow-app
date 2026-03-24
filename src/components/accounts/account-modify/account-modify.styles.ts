import { StyleSheet } from "react-native-unistyles"

export const accountModifyStyles = StyleSheet.create((theme) => ({
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
  balanceSection: {
    marginHorizontal: 20,
  },
  balanceContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "600",
    color: theme.colors.onSurface,
    lineHeight: 60,
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  updateBalanceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSecondary,
    opacity: 0.7,
  },
  settingsList: {
    gap: 0,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  settingsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingsValue: {
    fontSize: 16,
    color: theme.colors.onSecondary,
    opacity: 0.7,
  },
  chevronIcon: {
    color: theme.colors.onSecondary,
    opacity: 0.4,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 16,
  },
  defaultColorText: {
    fontSize: 16,
    color: theme.colors.onSecondary,
    opacity: 0.6,
  },
  switchesSection: {
    gap: 0,
  },
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
    gap: 10,
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
    marginTop: 30,
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
  archiveIcon: {
    color: theme.colors.onSurface,
  },
  archiveText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
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
  primaryAccountBlock: {
    gap: 4,
  },
  primaryAccountHintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  primaryAccountHintIcon: {
    color: theme.colors.customColors.semi,
  },
  primaryAccountHint: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.customColors.semi,
  },
  archiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  archiveWarningIcon: {
    color: theme.colors.customColors.semi,
  },
  archiveWarning: {
    fontSize: 12,
    color: theme.colors.customColors.semi,
  },
}))
