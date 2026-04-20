import type { ReactNode } from "react"
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import {
  type IconSize,
  IconSvg,
  type IconSvgName,
} from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

// --- helpers ---

function resolveSlot(
  slot: ReactNode | IconSvgName | undefined,
  size: IconSize = 14,
): ReactNode {
  if (typeof slot === "string") {
    return <IconSvg name={slot as IconSvgName} size={size} />
  }
  return slot ?? null
}

/** Convert hex → rgba with opacity (for subtle borders) */
function withOpacity(hex: string, opacity: number): string {
  const clean = hex.replace("#", "")

  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// --- Chip ---

interface ChipProps extends PressableProps {
  label?: string
  children?: ReactNode
  selected?: boolean
  leading?: ReactNode | IconSvgName
  trailing?: ReactNode | IconSvgName
  hideCheck?: boolean
  checkIcon?: ReactNode | IconSvgName
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}

export function Chip({
  label,
  children,
  selected = false,
  leading,
  trailing,
  hideCheck,
  checkIcon,
  style,
  labelStyle,
  ...rest
}: ChipProps) {
  const { theme } = useUnistyles()

  const idleBorder = withOpacity(theme.colors.onSurface, 0.4)
  const selectedBorder = theme.colors.primary

  const textColor = selected ? theme.colors.onSecondary : theme.colors.onSurface

  const selectedBg = theme.colors.secondary

  const content = children ?? (
    <Text
      style={[
        chipStyles.chipLabel,
        {
          color: textColor,
          fontWeight: selected ? "600" : "400",
        },
        labelStyle,
      ]}
      numberOfLines={1}
    >
      {label}
    </Text>
  )

  return (
    <Pressable
      {...rest}
      style={[
        chipStyles.chip,
        {
          backgroundColor: selected ? selectedBg : "transparent",
          borderWidth: 1,
          borderColor: selected ? selectedBorder : idleBorder,
        },
        style,
      ]}
    >
      {resolveSlot(leading)}

      {content}

      {trailing
        ? resolveSlot(trailing)
        : selected && !hideCheck
          ? resolveSlot(checkIcon ?? "check")
          : null}
    </Pressable>
  )
}

const chipStyles = StyleSheet.create((theme) => ({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius,
    gap: 6,
  },
  chipLabel: {
    fontSize: theme.typography.labelLarge.fontSize,
  },
}))

// --- ChoiceChips ---

interface ChoiceChipsProps<T extends string> {
  title: string
  description?: string
  style?: StyleProp<ViewStyle>
  choices: T[] | readonly T[]
  selectedValue: T
  onSelect: (value: T) => void
}

export const ChoiceChips = <T extends string>({
  title,
  description,
  style,
  choices,
  selectedValue,
  onSelect,
}: ChoiceChipsProps<T>) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{title}</Text>

        {description && (
          <Text style={styles.descriptionText}>{description}</Text>
        )}
      </View>

      <View style={styles.chipsWrapper}>
        {choices.map((item, index) => {
          const isSelected = selectedValue === item

          return (
            <Chip
              key={`${item}-${index.toString()}`}
              label={item}
              selected={isSelected}
              onPress={() => onSelect(item)}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
  },
  header: {
    marginBottom: 24,
  },
  titleText: {
    ...theme.typography.headlineSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSurface,
    opacity: 0.7,
    lineHeight: 20,
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
}))
