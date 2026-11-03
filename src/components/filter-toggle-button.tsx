import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { View } from "~/components/ui/view"

interface FilterToggleButtonProps {
  /** Whether the filter (or search) panel is currently shown. */
  active: boolean
  onPress: () => void
  /** "search" shows the search-filter icon while closed. */
  variant?: "filter" | "search"
  accessibilityLabel?: string
  /** A filter or search is applied: keep a dot on the button while the panel is hidden. */
  filtersApplied?: boolean
}

/** Header button that shows / hides a screen's filter panel. */
export function FilterToggleButton({
  active,
  onPress,
  variant = "filter",
  accessibilityLabel,
  filtersApplied = false,
}: FilterToggleButtonProps) {
  const { t } = useTranslation()
  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? t("components.filters.toggle")}
      accessibilityState={{ expanded: active }}
    >
      <IconSvg
        name={
          active
            ? "filter-2-x-outline"
            : variant === "search"
              ? "filter-2-search-outline"
              : "filter-2-outline"
        }
        size={20}
      />
      {filtersApplied && !active ? <View style={styles.dot} /> : null}
    </Button>
  )
}

const styles = StyleSheet.create((theme) => ({
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
}))
