import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native"

import { useLanguageStore } from "~/stores/language.store"

import { type IconSize, IconSymbol } from "./icon-symbol"

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
  style?: StyleProp<TextStyle>
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
        ? "chevron-left"
        : "chevron-right"
      : direction === "leading"
        ? isRTL
          ? "chevron-right"
          : "chevron-left"
        : direction === "up"
          ? "chevron-up"
          : "chevron-down"

  return <IconSymbol name={name} size={size} color={color} style={style} />
}
