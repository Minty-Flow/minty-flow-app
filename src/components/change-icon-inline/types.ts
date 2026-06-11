import type { IconSize } from "~/components/ui/icon-svg"
import type { MintyColorScheme } from "~/styles/theme/types"

export interface ChangeIconInlineProps {
  /** Currently selected icon (name, emoji, or image uri). */
  currentIcon?: string | null
  /** Called when user selects an icon from any source. */
  onIconSelected?: (icon: string | null) => void
  /** Color scheme for the icon box and icon picker. */
  colorScheme?: MintyColorScheme | null
  /** Icon box size in px. Default 96. Must be a valid IconSize. */
  iconSize?: IconSize
}

export type InlineMode = null | "emoji" | "image"
