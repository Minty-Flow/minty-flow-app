import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type CategoryPreset,
  ExpensePresets,
  IncomePresets,
} from "~/constants/pre-sets-categories"
import {
  createCategory,
  observeCategoriesByType,
} from "~/database/services/category-service"
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
  categories: Category[]
}

const CategoryPresetsScreenInner = ({
  type,
  categories,
}: CategoryPresetsScreenInnerProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set())

  const presets = PRESETS_BY_TYPE[type] ?? []
  const addedPresets = useMemo(
    () => alreadyAddedPresetKeys(categories, presets),
    [categories, presets],
  )

  const togglePreset = (presetName: string) => {
    setSelectedPresets((prev) => {
      const next = new Set(prev)
      if (next.has(presetName)) {
        next.delete(presetName)
      } else {
        next.add(presetName)
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
      name: t(preset.name), // resolve the translation at save time
      type: preset.type,
      icon: preset.icon,
      colorSchemeName: preset.colorSchemeName,
    }))

    // Only keep the side-effectful async work inside try/catch
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
    const isAdded = addedPresets.has(presetKey)
    const isSelected = selectedPresets.has(presetKey)

    return (
      <Pressable
        style={styles.presetItem}
        onPress={() => {
          if (!isAdded) {
            togglePreset(`${item.icon}:${item.type}`)
          }
        }}
        disabled={isAdded}
      >
        {/* Icon container - using DynamicIcon */}
        <DynamicIcon icon={item.icon} size={24} />

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text variant="default" style={styles.presetName}>
            {t(item.name)}
          </Text>
        </View>

        {/* Right side action */}
        {isAdded ? (
          <View style={styles.addedBadge}>
            <Text variant="small" style={styles.addedText}>
              {t("components.categories.presets.added")}
            </Text>
          </View>
        ) : isSelected ? (
          <View style={styles.checkmark}>
            <IconSvg
              name="check"
              size={16}
              color={styles.checkmarkColor.color}
            />
          </View>
        ) : (
          <View style={styles.plusButton}>
            <IconSvg name="plus" size={20} />
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={presets}
        keyExtractor={(item) => `${item.icon}:${item.type}`}
        renderItem={renderPresetItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View style={[styles.buttonContainer, { paddingBottom: 16 }]}>
        <Button
          variant="default"
          onPress={handleAddSelected}
          disabled={selectedPresets.size === 0}
          style={styles.addButton}
        >
          <Text variant="default" style={styles.addButtonText}>
            {t("components.categories.presets.addSelected", {
              count: selectedPresets.size,
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}

const EnhancedCategoryPresetsScreen = withObservables(
  ["type"],
  ({ type }: { type: TransactionType }) => ({
    categories: observeCategoriesByType(type),
  }),
)(CategoryPresetsScreenInner)

export default function CategoryPresetsScreen() {
  const params = useLocalSearchParams<{ type: TransactionType }>()
  const type = params.type || TransactionTypeEnum.EXPENSE
  return <EnhancedCategoryPresetsScreen type={type} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  list: {
    flex: 1,
  },

  listContent: {},

  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    borderBottomOpacity: 0.1,
  },
  textContainer: {
    flex: 1,
  },
  presetName: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkColor: {
    color: theme.colors.onPrimary,
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  addedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  addedText: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
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
