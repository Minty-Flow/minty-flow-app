import { StyleSheet } from "react-native-unistyles"

import { H_PAD } from "./form.styles"

export const formItemsStyles = StyleSheet.create((theme) => ({
  // Rows carry the side padding so their press ripple reaches the screen edges.
  list: {
    gap: 4,
    // Extra room so the recent chips don't run into the category chips.
    marginBottom: 20,
  },
  swipeContainer: {
    overflow: "hidden",
  },
  // Opaque, so the delete action stays hidden until the row slides.
  row: {
    paddingHorizontal: H_PAD,
    backgroundColor: theme.colors.surface,
  },
  // The divider sits on the inner row so it lines up with the content.
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 52,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.semantic.semi,
  },
  rowMain: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    gap: 2,
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
  sheetStepper: {
    gap: 8,
  },
  stepCount: {
    minWidth: 24,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  lineTotal: {
    minWidth: 72,
    fontWeight: "600",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  entry: {
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    gap: 12,
  },
  recents: {
    gap: 8,
  },
  recentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Pulled out by its padding so the text lines up with the chips' edge.
  recentsEdit: {
    marginEnd: -12,
  },
  recentsEditText: {
    fontWeight: "600",
    color: theme.colors.primary,
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
    maxWidth: 180,
    paddingStart: 6,
  },
  chipTile: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
  },
  chipTileAdded: {
    backgroundColor: theme.colors.primary,
  },
  chipCount: {
    fontWeight: "700",
    color: theme.colors.onPrimary,
    fontVariant: ["tabular-nums"],
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
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  entryName: {
    flex: 1,
  },
  entryPrice: {
    width: 128,
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
    paddingTop: 12,
    paddingHorizontal: H_PAD,
  },
  noAccount: {
    paddingHorizontal: H_PAD,
    marginBottom: 12,
    color: theme.colors.onSecondary,
  },
  totalLabel: {
    fontWeight: "600",
    color: theme.colors.onSecondary,
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
    width: 72,
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
