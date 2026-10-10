/**
 * Shared styles for the selectors (currency, contact, etc.):
 * trigger row + sheet shell (header, search, list area) + list item base.
 */

import { StyleSheet } from "react-native-unistyles"

/** Trigger row: same look for all selectors (currency, contact). */
export const triggerStyles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
  },
  triggerRow: {
    justifyContent: "space-between",
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

/** Sheet shell and list: shared across the currency and contact sheets. */
export const sheetStyles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
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
  loadingContainer: {
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    justifyContent: "space-between",
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

/** Header for selector sheets: centered title, no divider, tight top. */
export const sheetHeaderStyles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    paddingBottom: 8,
  },
  title: {
    ...theme.typography.headlineSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
    textAlign: "center",
  },
}))
