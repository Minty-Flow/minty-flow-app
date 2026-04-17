/**
 * Shared styles for selector modals (currency, contact, etc.):
 * trigger row + modal shell (header, search, list area) + list item base.
 */

import { StyleSheet } from "react-native-unistyles"

/** Trigger row: same look for all selector modals (currency, contact). */
export const triggerStyles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerValue: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.7,
  },
  chevronIcon: {
    color: theme.colors.onSecondary,
    opacity: 0.4,
  },
}))

/** Modal shell and list: shared across currency and contact modals. */
export const modalStyles = StyleSheet.create((theme) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listWrapper: {
    flex: 1,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingContainer: {
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemPressed: {
    opacity: 0.8,
    backgroundColor: `${theme.colors.onSurface}10`,
  },
  itemSelected: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  itemLeft: {
    flex: 1,
    gap: 2,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
}))
