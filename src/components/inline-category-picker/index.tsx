/**
 * InlineCategoryPicker
 * Multi-select category field: a trigger row summarising the selection that
 * opens the shared category sheet (search, full names, select all).
 */
import { useFocusEffect } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { CategoryPickerSheet } from "~/components/category-picker/category-picker-sheet"
import { IconSvg, type IconSvgName } from "~/components/icons"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Category, CategoryType } from "~/types/categories"

interface InlineCategoryPickerProps {
  categories: Category[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  label?: string
  icon?: IconSvgName
  /** Type for the sheet's "New category" shortcut. */
  categoryType?: CategoryType
}

/** "Groceries, Dining +2" — the first two names, then how many more. */
function summarize(names: string[]): string {
  if (names.length <= 2) return names.join(", ")
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`
}

export function InlineCategoryPicker({
  categories,
  selectedIds,
  onSelectionChange,
  label,
  icon = "category-outline",
  categoryType = "expense",
}: InlineCategoryPickerProps) {
  const [open, setOpen] = useState(false)
  // True while the create-category screen is open: reopen the sheet on return.
  const reopenOnFocusRef = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (reopenOnFocusRef.current) {
        reopenOnFocusRef.current = false
        setOpen(true)
      }
    }, []),
  )

  const selectedNames = categories
    .filter((c) => selectedIds.includes(c.id))
    .map((c) => c.name)

  return (
    <View>
      <ListItem
        style={styles.triggerRow}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <View style={styles.triggerLeft}>
          <IconSvg name={icon} size={24} />
          <Text variant="default" style={styles.label}>
            {label}
          </Text>
        </View>
        <View style={styles.triggerRight}>
          <Text
            variant="default"
            style={[
              styles.value,
              selectedNames.length === 0 && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {selectedNames.length > 0 ? summarize(selectedNames) : "0"}
          </Text>
          <ChevronIcon direction="trailing" size={18} />
        </View>
      </ListItem>

      <CategoryPickerSheet
        visible={open}
        categories={categories}
        mode="multi"
        selectedIds={selectedIds}
        onApply={onSelectionChange}
        onClose={() => setOpen(false)}
        newCategoryType={categoryType}
        onNewCategory={() => {
          reopenOnFocusRef.current = true
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  triggerRow: {
    justifyContent: "space-between",
    gap: 12,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  label: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  value: {
    flexShrink: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    textAlign: "right",
  },
  placeholder: {
    opacity: 0.5,
  },
}))
