import { StyleSheet } from "react-native-unistyles"

export const categoryMoveRowStyles = StyleSheet.create((theme) => ({
  container: {
    gap: 8,
    marginBottom: 12,
  },
  triggerText: {
    flex: 1,
  },
  triggerIcon: {
    color: theme.colors.onSecondary,
  },
  clear: {
    alignSelf: "flex-start",
    paddingHorizontal: 0,
  },
}))
