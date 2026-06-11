import { StyleSheet } from "react-native-unistyles"

export const dateRangePresetModalStyles = StyleSheet.create((theme) => {
  const muted = theme.colors.customColors?.semi ?? theme.colors.onSurface
  const primary = theme.colors.primary
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
      paddingVertical: 12,
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
    presetButtonSelected: {
      borderColor: primary,
      backgroundColor: `${primary}20`,
    },
    presetButtonText: {
      color: theme.colors.onSurface,
      fontWeight: "400",
    },
    presetButtonTextSelected: {
      color: primary,
      fontWeight: "600",
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
    monthYearRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    monthYearInput: {
      flex: 1,
      minWidth: 72,
      marginHorizontal: 8,
      textAlign: "center",
    },
    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    monthCell: {
      width: "30%",
      paddingVertical: 10,
      borderRadius: radius,
      backgroundColor: "transparent",
      alignItems: "center",
    },
    monthCellSelected: {
      backgroundColor: `${primary}20`,
    },
    monthCellText: {
      color: theme.colors.onSurface,
      fontWeight: "400",
    },
    monthCellTextSelected: {
      color: primary,
      fontWeight: "600",
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
