import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"

import { CategoryPickerSheet } from "~/components/category-picker/category-picker-sheet"
import { getMostUsedCategories } from "~/components/category-picker/most-used"
import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import type { Category, CategoryType } from "~/types/categories"
import { CategoryTypeEnum } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { inferInitialCategoryType } from "../utils"

/** Chips shown inline before the rest move behind "All (N)". */
const INLINE_LIMIT = 12

interface CategoriesPanelProps {
  categoriesByType: Record<TransactionType, Category[]>
  selectedIds: string[]
  onToggle: (id: string) => void
  /** Replaces the whole category selection (used by the "All" sheet). */
  onSetSelection: (ids: string[]) => void
  onClear: () => void
  onDone: () => void
}
export function CategoriesPanel({
  categoriesByType,
  selectedIds,
  onToggle,
  onSetSelection,
  onClear,
  onDone,
}: CategoriesPanelProps) {
  const { t } = useTranslation()
  const [sheetVisible, setSheetVisible] = useState(false)
  const selectedIdSet = new Set(selectedIds)
  const initialType = inferInitialCategoryType(selectedIds, categoriesByType)
  const [selectedType, setSelectedType] = useState<CategoryType | null>(
    () => initialType,
  )
  const categories =
    selectedType !== null ? (categoriesByType[selectedType] ?? []) : []

  // Most used first, wrapping instead of scrolling sideways. Past the limit,
  // the rest sit behind "All (N)", but a selected one always stays visible.
  const overLimit = categories.length > INLINE_LIMIT
  const top = overLimit
    ? getMostUsedCategories(categories, INLINE_LIMIT)
    : getMostUsedCategories(categories, categories.length)
  const topIds = new Set(top.map((c) => c.id))
  const visible = [
    ...categories.filter((c) => selectedIdSet.has(c.id) && !topIds.has(c.id)),
    ...top,
  ]

  // The sheet edits this type only; selections of the other type are kept.
  const applyFromSheet = (idsOfType: string[]) => {
    const typeIds = new Set(categories.map((c) => c.id))
    onSetSelection([
      ...selectedIds.filter((id) => !typeIds.has(id)),
      ...idsOfType,
    ])
  }

  const typeOptions: {
    id: CategoryType
    label: string
  }[] = [
    {
      id: CategoryTypeEnum.EXPENSE,
      label: t("components.categories.types.expense"),
    },
    {
      id: CategoryTypeEnum.INCOME,
      label: t("components.categories.types.income"),
    },
  ]
  return (
    <View>
      <View style={filterHeaderStyles.chipWrap}>
        {typeOptions.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={selectedType === opt.id}
            onPress={() => setSelectedType(opt.id)}
          />
        ))}
      </View>
      {selectedType !== null && categories.length > 0 ? (
        <View
          style={[
            filterHeaderStyles.categorySection,
            filterHeaderStyles.chipWrap,
          ]}
        >
          {visible.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              selected={selectedIdSet.has(category.id)}
              onPress={() => onToggle(category.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selectedIdSet.has(category.id) }}
              leading={
                category.icon ? (
                  <DynamicIcon
                    icon={category.icon}
                    size={18}
                    colorScheme={category.colorScheme}
                    variant="raw"
                  />
                ) : undefined
              }
            />
          ))}
          {overLimit ? (
            <Chip
              label={t("components.categoryPicker.allChip", {
                count: categories.length,
              })}
              onPress={() => setSheetVisible(true)}
              trailing={<IconSvg name="chevron-down-outline" size={16} />}
            />
          ) : null}
        </View>
      ) : selectedType !== null && categories.length === 0 ? (
        <EmptyState
          variant="compact"
          icon="category-outline"
          title={t("components.filters.noCategoriesForType")}
        />
      ) : null}

      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelClearButton
            onPress={onClear}
            disabled={selectedIds.length === 0}
          />
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>

      <CategoryPickerSheet
        visible={sheetVisible}
        categories={categories}
        mode="multi"
        selectedIds={categories
          .filter((c) => selectedIdSet.has(c.id))
          .map((c) => c.id)}
        onApply={applyFromSheet}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  )
}
