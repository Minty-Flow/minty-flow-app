import { StyleSheet } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

interface TransactionTopTabsProps {
  labels: [string, string, string]
  /** Per-slot icon override (e.g. lent/borrowed kinds); falls back to SLOT_ICONS. */
  icons?: [IconSvgName, IconSvgName, IconSvgName]
  value: TransactionType
  onChange: (type: TransactionType) => void
  hiddenSlots?: number[]
  lockedTo?: number | null
}

// Slot index → transaction type (0 expense, 1 income, 2 transfer).
const SLOT_TYPES: [TransactionType, TransactionType, TransactionType] = [
  TransactionTypeEnum.EXPENSE,
  TransactionTypeEnum.INCOME,
  TransactionTypeEnum.TRANSFER,
]

// Icon stays mapped by slot index even when the label changes.
const SLOT_ICONS: [IconSvgName, IconSvgName, IconSvgName] = [
  "chevrons-up-outline",
  "chevrons-down-outline",
  "arrows-right-left-outline",
]

export const TransactionTopTabs = ({
  labels,
  icons = SLOT_ICONS,
  value,
  onChange,
  hiddenSlots = [],
  lockedTo = null,
}: TransactionTopTabsProps) => {
  const locked = lockedTo != null
  const slots = locked
    ? [lockedTo]
    : [0, 1, 2].filter((slot) => !hiddenSlots.includes(slot))

  return (
    <View style={styles.segmented}>
      {slots.map((slot) => {
        const type = SLOT_TYPES[slot]
        const isSelected = locked || value === type
        return (
          <Pressable
            key={slot}
            onPress={locked ? undefined : () => onChange(type)}
            disabled={locked}
            style={[styles.segment, isSelected && styles.active]}
          >
            <IconSvg
              name={icons[slot]}
              color={isSelected ? styles.activeText.color : undefined}
              size={18}
            />
            <Text
              style={[styles.segmentLabel, isSelected && styles.activeText]}
            >
              {labels[slot]}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  segmented: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
    padding: 4,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius,
  },

  segmentLabel: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },

  active: {
    backgroundColor: theme.colors.primary,
  },
  activeText: {
    color: theme.colors.onPrimary,
  },
}))
