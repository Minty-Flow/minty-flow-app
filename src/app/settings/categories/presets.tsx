import { useLocalSearchParams, useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { PresetListItem } from "~/components/preset-list-item"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type CategoryPreset,
  ExpensePresets,
  IncomePresets,
} from "~/constants/pre-sets-categories"
import { createCategory } from "~/database/services-sqlite/category-service"
import { useCategoriesByType } from "~/stores/db/category.store"
import type { Category } from "~/types/categories"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

const PRESETS_BY_TYPE: Record<TransactionType, readonly CategoryPreset[]> = {
  expense: ExpensePresets,
  income: IncomePresets,
  transfer: [],
}

function alreadyAddedPresetKeys(
  categories: Category[],
  presets: readonly CategoryPreset[],
): Set<string> {
  const added = new Set<string>()
  for (const preset of presets) {
    const match = categories.some(
      (c) => c.icon === preset.icon && c.type === preset.type,
    )
    if (match) added.add(`${preset.icon}:${preset.type}`)
  }
  return added
}

async function createCategories(
  toCreate: Parameters<typeof createCategory>[0][],
) {
  for (const payload of toCreate) {
    await createCategory(payload)
  }
}

interface CategoryPresetsScreenInnerProps {
  type: TransactionType
}

const CategoryPresetsScreenInner = ({
  type,
}: CategoryPresetsScreenInnerProps) => {
  const categories = useCategoriesByType(type)
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set())

  const presets = PRESETS_BY_TYPE[type] ?? []
  const addedPresets = useMemo(
    () => alreadyAddedPresetKeys(categories, presets),
    [categories, presets],
  )

  const availableKeys = presets
    .filter((p) => !addedPresets.has(`${p.icon}:${p.type}`))
    .map((p) => `${p.icon}:${p.type}`)

  const allSelected =
    availableKeys.length > 0 &&
    availableKeys.every((k) => selectedPresets.has(k))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedPresets(new Set())
    } else {
      setSelectedPresets(new Set(availableKeys))
    }
  }

  const togglePreset = (presetKey: string) => {
    setSelectedPresets((prev) => {
      const next = new Set(prev)
      if (next.has(presetKey)) {
        next.delete(presetKey)
      } else {
        next.add(presetKey)
      }
      return next
    })
  }

  const handleAddSelected = async () => {
    const selected = presets.filter((preset) =>
      selectedPresets.has(`${preset.icon}:${preset.type}`),
    )
    if (selected.length === 0) return

    const toCreate = selected.map((preset) => ({
      name: t(preset.name),
      type: preset.type,
      icon: preset.icon,
      colorSchemeName: preset.colorSchemeName,
    }))

    try {
      await createCategories(toCreate)
      setSelectedPresets(new Set())
      router.back()
    } catch (error) {
      logger.error("Error creating preset categories", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("components.categories.form.toast.createFailed"),
      })
    }
  }

  const renderPresetItem = ({ item }: { item: (typeof presets)[0] }) => {
    const presetKey = `${item.icon}:${item.type}`
    return (
      <PresetListItem
        icon={item.icon}
        label={t(item.name)}
        isSelected={selectedPresets.has(presetKey)}
        isAdded={addedPresets.has(presetKey)}
        onPress={() => togglePreset(presetKey)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.selectionBar}>
        <Text style={styles.selectionCount}>
          {selectedPresets.size > 0
            ? t("components.categories.presets.selectedCount", {
                count: selectedPresets.size,
              })
            : t("components.categories.presets.noneSelected")}
        </Text>
        <Pressable
          style={styles.selectAllButton}
          onPress={toggleSelectAll}
          hitSlop={8}
        >
          <Text style={styles.selectAllText}>
            {allSelected
              ? t("components.categories.presets.deselectAll")
              : t("components.categories.presets.selectAll")}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={presets}
        keyExtractor={(item) => `${item.icon}:${item.type}`}
        renderItem={renderPresetItem}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View style={styles.buttonContainer}>
        <Button
          variant="default"
          onPress={handleAddSelected}
          disabled={selectedPresets.size === 0}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>
            {t("components.categories.presets.addSelected", {
              count: selectedPresets.size,
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default function CategoryPresetsScreen() {
  const params = useLocalSearchParams<{ type: TransactionType }>()
  const type = params.type || TransactionTypeEnum.EXPENSE
  return <CategoryPresetsScreenInner type={type} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  selectionCount: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  selectAllButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}18`,
  },
  selectAllText: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  columnWrapper: {
    gap: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    width: "100%",
  },
  addButtonText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
