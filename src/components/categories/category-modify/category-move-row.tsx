import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { CategoryPickerSheet } from "~/components/category-picker/category-picker-sheet"
import { SelectorTrigger } from "~/components/selectors/selector-parts"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Category } from "~/types/categories"

interface CategoryMoveRowProps {
  /** Categories that can take over: same type, not the one being deleted. */
  targets: Category[]
  selectedId: string | null
  onChange: (id: string | null) => void
}

/**
 * Chooses where a category's transactions go when it is deleted. With nothing
 * chosen they are left uncategorized.
 */
export function CategoryMoveRow({
  targets,
  selectedId,
  onChange,
}: CategoryMoveRowProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const selected = targets.find((c) => c.id === selectedId)

  return (
    <View>
      <SelectorTrigger
        icon="category-outline"
        label={t("components.categories.form.move.label")}
        value={selected?.name ?? t("components.categories.form.move.none")}
        editable
        onPress={() => setOpen(true)}
      />
      {selected ? (
        <Pressable style={styles.clear} onPress={() => onChange(null)}>
          <Text variant="small" style={styles.clearText}>
            {t("components.categories.form.move.clear")}
          </Text>
        </Pressable>
      ) : null}

      <CategoryPickerSheet
        visible={open}
        categories={targets}
        mode="single"
        selectedIds={selectedId ? [selectedId] : []}
        onApply={(ids) => onChange(ids[0] ?? null)}
        onClose={() => setOpen(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  clear: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  clearText: {
    color: theme.colors.primary,
  },
}))
