import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"

interface FilterToggleButtonProps {
  /** Whether the filter (or search) panel is currently shown. */
  active: boolean
  onPress: () => void
  /** "search" shows the search-filter icon while closed. */
  variant?: "filter" | "search"
  accessibilityLabel?: string
}

/** Header button that shows / hides a screen's filter panel. */
export function FilterToggleButton({
  active,
  onPress,
  variant = "filter",
  accessibilityLabel,
}: FilterToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
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
    </Button>
  )
}
