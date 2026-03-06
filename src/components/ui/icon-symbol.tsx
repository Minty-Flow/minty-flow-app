/**
 * TODO: migrate to svg icons instead like
 * https://iconoir.com/ or https://lucide.dev/guide/packages/lucide-react-native
 */
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import type { ComponentProps } from "react"
import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native"
import { useUnistyles } from "react-native-unistyles"

type MaterialName = ComponentProps<typeof MaterialCommunityIcons>["name"]

/**
 * Helper function to ensure all icon names are valid MaterialCommunityIcons names.
 * This provides type safety at compile time.
 */
export function defineValidIcons<T extends readonly MaterialName[]>(
  icons: T,
): T {
  return icons
}

/**
 * Valid MaterialCommunityIcons names that can be used in the app.
 * Add new icon names here as needed.
 *
 * TypeScript will ensure all names are valid MaterialCommunityIcons names.
 */
export const VALID_ICON_NAMES = defineValidIcons([
  // UI & Navigation
  "arrow-bottom-left",
  "arrow-left",
  "arrow-right",
  "arrow-top-right",
  "chevron-down",
  "chevron-up",
  "chevron-left",
  "chevron-right",
  "close",
  "close-circle",
  "magnify",
  "swap-vertical",
  "swap-horizontal",

  "eye",
  "eye-off",
  // Status & Alerts
  "alert",
  "alert-circle",
  "check",
  "check-circle",
  "information",
  // Shapes & Layout
  "circle",
  "shape",
  "shape-plus",
  "triangle",
  "chart-box",
  "chart-line",
  "chart-pie",
  "chart-timeline",
  "chart-timeline-variant",
  "format-page-split",
  // Media & Visual
  "camera",
  "image",
  "image-multiple",
  // File types
  "file",
  "file-document",
  "file-image",
  "file-video",
  "file-chart",
  "file-pdf-box",
  "file-presentation-box",
  "palette",
  "palette-swatch",
  // Text & Editing
  "clipboard",
  "pencil",
  "eraser",
  "puzzle-edit",
  // Math & Calculator
  "calculator",
  "plus",
  "minus",
  "percent",
  "division",
  "equal",
  "plus-minus-variant",
  // Finance & Commerce
  "wallet",
  "wallet-bifold",
  "credit-card",
  "currency-usd",
  "piggy-bank",
  "tag",
  "tag-multiple",
  "pound",
  "shopping",
  "gift",
  "basket",
  // Devices & System
  "server",
  "dialpad",
  "toaster",
  "cog",
  // Security
  "lock",
  "lock-open",
  "fingerprint",
  // People & Social
  "handshake",
  "heart",
  "pulse",
  // Places
  "map-marker",
  "crosshairs-gps",
  "office-building",
  "school",
  "car",
  // Misc
  "backspace",
  "bell",
  "trash-can",
  "target",
  "clock",
  "clock-fast",
  "calendar",
  "calendar-sync",
  "progress-clock",
  "anchor",
  "archive",
  "archive-arrow-up",
  "archive-arrow-down",
  "star",
  "trending-up",
  "trending-down",
  "filter-variant",
  "filter-variant-remove",
  "account-details",
  "map",
  "account",
  "open-in-new",
  "asterisk",
  "shield-alert",
  "vibrate",
  "vibrate-off",
  "tag-plus",
  "adjust",
  "dots-triangle",
  "attachment",
  "delete-restore",
  "check-all",
  "repeat",
  "arrow-up",
  "arrow-down",
  "chevron-double-down",
  "chevron-double-up",
  "translate",
  "cellphone-lock",
  "playlist-remove",
  "format-list-bulleted",
  "restore",
  "dots-triangle",
] as const)

/**
 * Type representing valid MaterialCommunityIcons names.
 * Only icons present in the VALID_ICON_NAMES array can be used.
 * The defineValidIcons function ensures all names are valid MaterialName types.
 */
export type IconSymbolName = (typeof VALID_ICON_NAMES)[number]

export type IconSize =
  | 12
  | 14
  | 16
  | 18
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 88
  | 96
  | 104
  | 112
  | 120
  | 128
  | 136
  | 144
  | 152
  | 160
  | 168
  | 176
  | 184
  | 192
  | 200
  | 208
  | 216
  | 224
  | 232
  | 240
  | 248
  | 256

/**
 * Props for the IconSymbol component.
 */
type IconSymbolProps = {
  /**
   * The name of the MaterialCommunityIcons icon to display.
   * Must be a valid icon name from VALID_ICON_NAMES.
   */
  name: IconSymbolName
  /**
   * Use outline style
   */
  outline?: boolean
  /**
   * The size of the icon in pixels.
   * @default 24
   */
  size?: IconSize
  /**
   * The color of the icon. Can be a string or an OpaqueColorValue.
   */
  color?: string | OpaqueColorValue
  /**
   * Additional styles to apply to the icon.
   */
  style?: StyleProp<TextStyle>
}

/**
 * An icon component that uses MaterialCommunityIcons.
 *
 * **Important:** Only icons that have been added to the VALID_ICON_NAMES array can be used.
 * If you need a new icon, add it to the VALID_ICON_NAMES constant above.
 *
 * @example
 * ```tsx
 * <IconSymbol name="cog" outline size={32} color="#007AFF" />
 * ```
 *
 * @param props - The component props
 * @returns A React component that renders a MaterialCommunityIcon
 *
 * @see {@link https://icons.expo.fyi | Material Icons Directory}
 * @see {@link https://docs.expo.dev/versions/latest/sdk/vector-icons/ | Expo Vector Icons Documentation}
 */
export function IconSymbol({
  name,
  outline,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  const { theme } = useUnistyles()

  // Normalize the icon name based on the outline flag
  const iconName = (
    outline
      ? name.endsWith("-outline")
        ? name
        : `${name}-outline`
      : name.replace("-outline", "")
  ) as IconSymbolName

  // Verify the icon exists in Expo's MaterialCommunityIcons set
  //const exists = MaterialCommunityIcons.glyphMap[iconName] !== undefined;

  return (
    <MaterialCommunityIcons
      color={color ?? theme.colors.primary}
      size={size}
      name={iconName || "anchor"}
      style={style}
    />
  )
}
