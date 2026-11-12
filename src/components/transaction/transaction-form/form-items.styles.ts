import { StyleSheet } from "react-native-unistyles"

import { H_PAD } from "./form.styles"

export const formItemsStyles = StyleSheet.create((theme) => ({
  // Rows carry the side padding so their press ripple reaches the screen edges.
  list: {
    gap: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: H_PAD,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  rowMain: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  name: {
    color: theme.colors.onSurface,
  },
  each: {
    color: theme.colors.onSecondary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCount: {
    minWidth: 24,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  lineTotal: {
    minWidth: 64,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  entry: {
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    gap: 8,
  },
  chips: {
    alignItems: "center",
    gap: 8,
  },
  chipsLabel: {
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  chip: {
    maxWidth: 160,
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  chipName: {
    flexShrink: 1,
    color: theme.colors.onSurface,
  },
  chipPrice: {
    color: theme.colors.onSecondary,
  },
  chipBadge: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  entryName: {
    flex: 1,
  },
  entryPrice: {
    width: 112,
  },
  priceInput: {
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  priceSymbol: {
    color: theme.colors.onSecondary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  addButtonIdle: {
    backgroundColor: theme.colors.secondary,
  },
  entryError: {
    color: theme.colors.error,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: H_PAD,
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
  quantityBox: {
    width: 96,
  },
  quantityInput: {
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
