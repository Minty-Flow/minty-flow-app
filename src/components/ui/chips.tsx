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

// --- Chip (filter-header style) ---

/** Resolve a slot value: if a string is passed it is treated as an IconSvgName
 *  and rendered as <IconSvg>; otherwise the ReactNode is returned as-is. */
function resolveSlot(
  slot: ReactNode | IconSvgName | undefined,
  size: IconSize = 14,
): ReactNode {
  if (typeof slot === "string")
    return <IconSvg name={slot as IconSvgName} size={size} />
  return slot ?? null
}

interface ChipProps extends PressableProps {
  label?: string
  children?: ReactNode
  selected?: boolean
  /** Icon name string or any ReactNode */
  leading?: ReactNode | IconSvgName
  /** Icon name string or any ReactNode */
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

  const borderColor = theme.colors.customColors.semi
  const selectedBg = theme.colors.secondary

  const content = children ?? (
    <Text
      style={[
        chipStyles.chipLabel,
        {
          color: selected ? theme.colors.primary : theme.colors.onSurface,
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
          borderColor: selected ? "transparent" : borderColor,
          borderWidth: 1,
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
  textStyle?: StyleProp<TextStyle>
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
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
}))
