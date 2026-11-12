import { StyleSheet } from "react-native-unistyles"

import { H_PAD } from "./form.styles"

export const formItemsStyles = StyleSheet.create((theme) => ({
  list: {
    paddingHorizontal: H_PAD,
    gap: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  rowName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  name: {
    flexShrink: 1,
    color: theme.colors.onSurface,
  },
  quantity: {
    color: theme.colors.semantic.semi,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: "600",
    color: theme.colors.semantic.semi,
  },
  sheet: {
    paddingVertical: 8,
    gap: 16,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  quantityInput: {
    minWidth: 80,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },
  deleteText: {
    color: theme.colors.error,
  },
}))
