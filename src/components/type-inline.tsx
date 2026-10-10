/**
 * Inline type selector: a trigger row showing the current type that expands
 * into a list of options (select and close). Used for account and category type.
 */
import { useState } from "react"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"

interface TypeInlineProps<T extends string> {
  icon: IconSvgName
  /** Row label, e.g. "Type". */
  label: string
  options: { type: T; label: string }[]
  /** Currently selected type. */
  selectedType: T
  /** Called when user selects a type (select and close). */
  onTypeSelected: (type: T) => void
  /** When false, the row is not tappable and no chevron is shown (e.g. edit mode). */
  editable?: boolean
}

export function TypeInline<T extends string>({
  icon,
  label,
  options,
  selectedType,
  onTypeSelected,
  editable = true,
}: TypeInlineProps<T>) {
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => {
    if (!editable) return

    setExpanded((v) => {
      const next = !v
      if (next) scrollIntoView()
      return next
    })
  }

  const handleSelect = (type: T) => {
    onTypeSelected(type)

    setExpanded(false)
  }

  const displayLabel =
    options.find((o) => o.type === selectedType)?.label ?? selectedType

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      <ListItem
        style={styles.triggerRow}
        onPress={handleToggle}
        disabled={!editable}
      >
        <View style={styles.triggerLeft}>
          <IconSvg name={icon} size={24} />
          <Text variant="default" style={styles.triggerLabel}>
            {label}
          </Text>
        </View>
        <View style={styles.triggerRight}>
          <Text variant="default" style={styles.triggerValue}>
            {displayLabel}
          </Text>
          {editable && (
            <ChevronIcon
              direction={expanded ? "up" : "trailing"}
              size={20}
              style={styles.chevronIconOpacity}
              color={styles.chevronIconColor.color}
            />
          )}
        </View>
      </ListItem>

      {editable && expanded && (
        <View style={styles.panel}>
          {options.map((opt) => (
            <Pressable
              key={opt.type}
              style={[
                styles.option,
                selectedType === opt.type && styles.optionActive,
              ]}
              onPress={() => handleSelect(opt.type)}
            >
              <Text
                variant="default"
                style={[
                  styles.optionText,
                  selectedType === opt.type && styles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {selectedType === opt.type && (
                <IconSvg
                  name="check-outline"
                  size={20}
                  color={styles.optionCheck.color}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
  },
  triggerRow: {
    justifyContent: "space-between",
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerValue: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.7,
  },
  chevronIconOpacity: {
    opacity: 0.4,
  },
  chevronIconColor: {
    color: theme.colors.onSecondary,
  },
  panel: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginTop: 10,
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius,
    backgroundColor: `${theme.colors.onSurface}10`,
  },
  optionActive: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  optionTextActive: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  optionCheck: {
    color: theme.colors.primary,
  },
}))
