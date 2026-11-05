import { useState } from "react"
import { useTranslation } from "react-i18next"

import { CategoryPickerSheet } from "~/components/category-picker/category-picker-sheet"
import { IconSvg } from "~/components/icons"
import { modifyFormStyles } from "~/components/modify-form/modify-form.styles"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Category } from "~/types/categories"

import { categoryMoveRowStyles as styles } from "./category-move-row.styles"

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
  const label = t("components.categories.form.move.label")
  const value =
    selected?.name ?? t("components.categories.form.move.placeholder")

  return (
    <View style={styles.container}>
      <Text variant="small" style={modifyFormStyles.label}>
        {label}
      </Text>
      <Button
        variant="secondary"
        style={modifyFormStyles.actionButton}
        accessibilityLabel={`${label} ${value}`}
        onPress={() => setOpen(true)}
      >
        <IconSvg
          name="category-outline"
          size={20}
          color={styles.triggerIcon.color}
        />
        <Text numberOfLines={1} style={styles.triggerText}>
          {value}
        </Text>
        <ChevronIcon
          direction="trailing"
          size={20}
          color={styles.triggerIcon.color}
        />
      </Button>
      <Text variant="muted">
        {t(
          selected
            ? "components.categories.form.move.hintSelected"
            : "components.categories.form.move.hintNone",
        )}
      </Text>
      {selected ? (
        <Button
          variant="link"
          style={styles.clear}
          onPress={() => onChange(null)}
        >
          <Text>{t("components.categories.form.move.clear")}</Text>
        </Button>
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
