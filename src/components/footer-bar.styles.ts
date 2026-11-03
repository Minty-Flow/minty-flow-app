import { StyleSheet } from "react-native-unistyles"

/** One look for every screen's pinned action row. */
export const footerBarStyles = StyleSheet.create((theme) => ({
  bar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.semantic.semi,
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
