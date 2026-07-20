import type { FC } from "react"
import type { OpaqueColorValue, StyleProp, ViewStyle } from "react-native"
import type { SvgProps } from "react-native-svg"
import { useUnistyles } from "react-native-unistyles"

import { logger } from "~/utils/logger"

import type { IconSvgName } from "./icon-map"
import { ICON_MAP } from "./icon-map"

export type { IconSvgName }

export type IconSize =
  | 12
  | 14
  | 16
  | 18
  | 20
  | 22
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
  | 26

type IconStyle = StyleProp<Omit<ViewStyle, "color">>

type IconSymbolProps = Omit<SvgProps, "width" | "height"> & {
  name: IconSvgName
  /* default: 24 */
  size?: IconSize
  color?: string | OpaqueColorValue
  style?: IconStyle
}

export function IconSvg({
  name,
  size = 24,
  color,
  style,
  ...rest
}: IconSymbolProps) {
  const { theme } = useUnistyles()

  const resolved = ICON_MAP[name]

  if (!resolved && __DEV__) logger.warn(`IconSvg: unknown icon "${name}"`)

  const ResolvedIcon = (resolved ??
    ICON_MAP["question-mark-outline"]) as FC<SvgProps>

  const resolvedColor = color || theme.colors.primary

  return (
    <ResolvedIcon
      width={size}
      height={size}
      color={resolvedColor}
      style={style}
      {...rest}
    />
  )
}
