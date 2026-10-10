import type { ReactNode } from "react"
import type { AccessibilityRole } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

/**
 * Shared building blocks for settings screens. Every section/row gap and margin
 * lives here so all settings screens stay identical — change it once here.
 * Spacing mirrors the main Settings screen (`src/app/settings/index.tsx`).
 */

type SectionProps = {
  /** Uppercase section label. Omit for an unlabelled group. */
  title?: string
  /** Optional muted line under the label. */
  description?: string
  children: ReactNode
}

export function SettingsSection({
  title,
  description,
  children,
}: SectionProps) {
  return (
    <View native style={title ? settingsStyles.labelledSection : undefined}>
      {title ? <Text style={settingsStyles.sectionTitle}>{title}</Text> : null}
      {description ? (
        <Text variant="small" style={settingsStyles.sectionDescription}>
          {description}
        </Text>
      ) : null}
      {children}
    </View>
  )
}

type RowProps = {
  label: string
  description?: string
  onPress?: () => void
  /** Rendered at the end of the row (check, switch, chevron…). */
  trailing?: ReactNode
  /** Extra content under the description (e.g. a small preview). */
  children?: ReactNode
  accessibilityRole?: AccessibilityRole
  accessibilityState?: { checked?: boolean; disabled?: boolean }
}

export function SettingsRow({
  label,
  description,
  onPress,
  trailing,
  children,
  accessibilityRole,
  accessibilityState,
}: RowProps) {
  return (
    <ListItem
      style={settingsStyles.row}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
    >
      <View native style={settingsStyles.rowContent}>
        <Text style={settingsStyles.rowLabel}>{label}</Text>
        {description ? (
          <Text variant="small" style={settingsStyles.rowDescription}>
            {description}
          </Text>
        ) : null}
        {children}
      </View>
      {trailing}
    </ListItem>
  )
}

type OptionRowProps = Omit<RowProps, "trailing" | "accessibilityRole"> & {
  selected: boolean
}

/** A single-choice row: tap to select, a check marks the current choice. */
export function SettingsOptionRow({ selected, ...props }: OptionRowProps) {
  const { theme } = useUnistyles()
  return (
    <SettingsRow
      {...props}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      trailing={
        selected ? (
          <IconSvg
            name="check-outline"
            size={20}
            color={theme.colors.primary}
          />
        ) : null
      }
    />
  )
}

type SwitchRowProps = Omit<
  RowProps,
  "trailing" | "onPress" | "accessibilityRole"
> & {
  value: boolean
  onValueChange: (value: boolean) => void
}

/** An on/off row: tapping anywhere on the row flips the switch. */
export function SettingsSwitchRow({
  value,
  onValueChange,
  ...props
}: SwitchRowProps) {
  return (
    <SettingsRow
      {...props}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      trailing={<Switch value={value} onValueChange={onValueChange} />}
    />
  )
}

export const settingsStyles = StyleSheet.create((theme) => ({
  /** ScrollView `style` for a settings screen. */
  screen: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  /** ScrollView `contentContainerStyle` for a settings sub-screen. */
  content: {
    paddingTop: 12,
    paddingBottom: 48,
  },
  labelledSection: {
    marginTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
  },
  sectionDescription: {
    paddingHorizontal: 20,
    color: theme.colors.semantic.semi,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
    minHeight: 56,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  rowDescription: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.semantic.semi,
  },
}))
