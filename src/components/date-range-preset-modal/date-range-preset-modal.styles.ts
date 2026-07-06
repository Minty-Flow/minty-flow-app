import { StyleSheet } from "react-native-unistyles"

export const dateRangePresetModalStyles = StyleSheet.create((theme) => {
  const muted = theme.colors.semantic?.semi ?? theme.colors.onSurface
  const radius = theme.radius
  const borderColor = `${muted}40`

  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    header: {
      paddingHorizontal: 20,
    },
    headerTitle: {
      color: muted,
      marginTop: 10,
    },
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 24,
    },
    sectionLabelCommonOptions: {
      color: muted,
      marginBottom: 8,
      marginHorizontal: 20,
    },
    sectionLabel: {
      color: muted,
    },
    presetsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    presetButton: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: radius,
      borderWidth: 1,
      borderColor,
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 0,
    },
    presetButtonText: {
      color: theme.colors.onSurface,
      fontWeight: "400",
    },
    collapsibleSection: {
      marginBottom: 8,
    },
    rowBase: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.surface,
    },
    rowText: {
      color: theme.colors.onSurface,
    },
    expandedContent: {
      padding: 20,
      paddingTop: 0,
      backgroundColor: theme.colors.surface,
      gap: 16,
    },
    expandedContentCompact: {
      gap: 0,
      paddingTop: 0,
      backgroundColor: theme.colors.surface,
    },
    customRangeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    customRangeValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    customRangeValueText: {
      color: muted,
    },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 12,
    },
    bottomBar: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: theme.colors.surface,
    },
  }
})
