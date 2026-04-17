import { StyleSheet } from "react-native-unistyles"

export const datePickerModalStyles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.colors.shadow,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    minWidth: 70,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneButton: {
    minWidth: 70,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "flex-end",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  cancelText: {
    fontSize: theme.typography.bodyLarge.fontSize,
  },
  doneText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
  },
  titleText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
  },
  body: {
    paddingVertical: 8,
  },
}))
