/**
 * Category field: a wrapping row of quick-pick chips (most used first, full
 * names, never truncated) followed by an "All" chip that opens the searchable
 * category sheet. A choice made in the sheet joins the chips as the first one.
 */
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { CategoryPickerSheet } from "~/components/category-picker/category-picker-sheet"
import { getMostUsedCategories } from "~/components/category-picker/most-used"
import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Category, CategoryType } from "~/types/categories"

import { transactionFormStyles } from "./form.styles"

/** How many quick-pick chips sit in the form before "All". */
const QUICK_COUNT = 5

type Props = {
  categories: Category[]
  categoryId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
  /** Type used by the sheet's "New category" shortcut. */
  categoryType?: CategoryType
}

export function FormCategoryPicker({
  categories,
  categoryId,
  onSelect,
  onClear,
  categoryType,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [sheetVisible, setSheetVisible] = useState(false)
  // True while the create-category screen is open: reopen the sheet on return.
  const reopenOnFocusRef = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (reopenOnFocusRef.current) {
        reopenOnFocusRef.current = false
        setSheetVisible(true)
      }
    }, []),
  )

  if (categories.length === 0) {
    return (
      <View style={transactionFormStyles.fieldBlock}>
        <View style={transactionFormStyles.tagsWrapGrid}>
          <Chip
            label={t("components.transactionForm.fields.addCategories")}
            leading="plus-outline"
            onPress={() => router.push("/settings/categories")}
            accessibilityLabel={t(
              "components.transactionForm.a11y.addCategories",
            )}
          />
        </View>
      </View>
    )
  }

  // Quick picks stay in a stable order; a selection from the sheet that isn't
  // among them takes the first slot so the current choice is always visible.
  const top = getMostUsedCategories(categories, QUICK_COUNT)
  const selected = categories.find((c) => c.id === categoryId)
  const quick =
    selected && !top.some((c) => c.id === selected.id)
      ? [selected, ...top.slice(0, QUICK_COUNT - 1)]
      : top
  const hasMore = categories.length > quick.length

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {quick.map((category) => {
          const isSelected = category.id === categoryId
          return (
            <Chip
              key={category.id}
              label={category.name}
              selected={isSelected}
              hideCheck
              onPress={() => (isSelected ? onClear() : onSelect(category.id))}
              accessibilityRole="radio"
              accessibilityLabel={t(
                "components.transactionForm.a11y.selectCategory",
                { name: category.name },
              )}
              accessibilityState={{ checked: isSelected }}
              leading={
                <DynamicIcon
                  icon={category.icon || "category-outline"}
                  size={16}
                  colorScheme={getThemeStrict(category.colorSchemeName)}
                  variant="badge"
                />
              }
            />
          )
        })}
        {hasMore ? (
          <Chip
            label={t("components.categoryPicker.allChip", {
              count: categories.length,
            })}
            onPress={() => setSheetVisible(true)}
            trailing={<IconSvg name="chevron-down-outline" size={16} />}
          />
        ) : null}
      </View>

      <CategoryPickerSheet
        visible={sheetVisible}
        categories={categories}
        mode="single"
        selectedIds={categoryId ? [categoryId] : []}
        onApply={(ids) => (ids[0] ? onSelect(ids[0]) : onClear())}
        onClose={() => setSheetVisible(false)}
        newCategoryType={categoryType}
        onNewCategory={() => {
          reopenOnFocusRef.current = true
        }}
      />
    </View>
  )
}
