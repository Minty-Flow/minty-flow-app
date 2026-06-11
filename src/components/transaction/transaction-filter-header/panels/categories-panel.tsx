import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import type { Category } from "~/types/categories"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk, inferInitialCategoryType } from "../utils"

interface CategoriesPanelProps {
  categoriesByType: Record<TransactionType, Category[]>
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
  onDone: () => void
}

export function CategoriesPanel({
  categoriesByType,
  selectedIds,
  onToggle,
  onClear,
  onDone,
}: CategoriesPanelProps) {
  const { t } = useTranslation()
  const initialType = useMemo(
    () => inferInitialCategoryType(selectedIds, categoriesByType),
    [selectedIds, categoriesByType],
  )
  const [selectedType, setSelectedType] = useState<TransactionType | null>(
    () => initialType,
  )

  const categories =
    selectedType !== null ? (categoriesByType[selectedType] ?? []) : []

  const categoryRows = chunk(categories, CHIPS_PER_ROW)

  const typeOptions: { id: TransactionType; label: string }[] = [
    {
      id: TransactionTypeEnum.EXPENSE,
      label: t("components.categories.types.expense"),
    },
    {
      id: TransactionTypeEnum.INCOME,
      label: t("components.categories.types.income"),
    },
    {
      id: TransactionTypeEnum.TRANSFER,
      label: t("components.categories.types.transfer"),
    },
  ]

  const renderCategoryRow = (items: Category[], rowKey: string) => (
    <ScrollView
      key={rowKey}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={filterHeaderStyles.chipScrollRow}
      style={filterHeaderStyles.categoryRow}
    >
      {items.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          selected={selectedIds.includes(category.id)}
          onPress={() => onToggle(category.id)}
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
    </ScrollView>
  )

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
        <View style={filterHeaderStyles.categorySection}>
          {categoryRows.map((row) =>
            renderCategoryRow(row, row.map((c) => c.id).join(",")),
          )}
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
    </View>
  )
}
