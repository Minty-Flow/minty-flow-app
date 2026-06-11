import type { OpaqueColorValue, StyleProp, ViewStyle } from "react-native"

import { useLanguageStore } from "~/stores/language.store"

import { type IconSize, IconSvg } from "./icon-svg"

type ChevronDirection = "trailing" | "leading" | "up" | "down"

interface ChevronIconProps {
  /**
   * Logical direction of the chevron:
   * - `trailing` → chevron-right in LTR, chevron-left in RTL (go-forward / disclosure)
   * - `leading`  → chevron-left in LTR, chevron-right in RTL (go-back / previous)
   * - `up` / `down` → always up / down (not affected by RTL)
   */
  direction: ChevronDirection
  size?: IconSize
  color?: string | OpaqueColorValue
  style?: StyleProp<Omit<ViewStyle, "color">>
}

export function ChevronIcon({
  direction,
  size,
  color,
  style,
}: ChevronIconProps) {
  const isRTL = useLanguageStore((s) => s.isRTL)

  const name =
    direction === "trailing"
      ? isRTL
        ? "chevron-left-outline"
        : "chevron-right-outline"
      : direction === "leading"
        ? isRTL
          ? "chevron-right-outline"
          : "chevron-left-outline"
        : direction === "up"
          ? "chevron-up-outline"
          : "chevron-down-outline"

  return <IconSvg name={name} size={size} color={color} style={style} />
}
