import { useRouter } from "expo-router"
import { useState, useTransition } from "react"
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
  IncomePresets,
} from "~/constants/pre-sets-categories"
import { createCategory } from "~/database/services-sqlite/category-service"
import type { TranslationKey } from "~/i18n/config"
import { useCategoriesByType } from "~/stores/db/category.store"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

export default function OnboardingIncomeCategoriesScreen() {
  const categories = useCategoriesByType(TransactionTypeEnum.INCOME)
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [saving, startTransition] = useTransition()

  const addedKeys = new Set<string>()
  for (const preset of IncomePresets) {
    if (
      categories.some((c) => c.icon === preset.icon && c.type === preset.type)
    ) {
      addedKeys.add(`${preset.icon}:${preset.type}`)
    }
  }

  const availableKeys = IncomePresets.filter(
    (p) => !addedKeys.has(`${p.icon}:${p.type}`),
  ).map((p) => `${p.icon}:${p.type}`)

  const allSelected =
    availableKeys.length > 0 && availableKeys.every((k) => selectedKeys.has(k))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set())
    } else {
      setSelectedKeys(new Set(availableKeys))
    }
  }

  const togglePreset = (key: string) => {
    if (addedKeys.has(key)) return
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleNext = () => {
    startTransition(async () => {
      const toCreate = IncomePresets.filter((p) =>
        selectedKeys.has(`${p.icon}:${p.type}`),
      )
      if (toCreate.length > 0) {
        try {
          await Promise.all(
            toCreate.map((preset) =>
              createCategory({
                name: t(preset.name as TranslationKey),
                type: preset.type,
                icon: preset.icon,
                colorSchemeName: preset.colorSchemeName,
              }),
            ),
          )
        } catch (error) {
          logger.error("Error creating preset categories", { error })
          Toast.error({
            title: t("common.toast.error"),
            description: t("components.categories.form.toast.createFailed"),
          })
          return
        }
      }
      router.push("/settings/edit-profile?fromOnboarding=true")
    })
  }

  const renderItem = ({ item }: { item: CategoryPreset }) => {
    const key = `${item.icon}:${item.type}`
    return (
      <PresetListItem
        icon={item.icon}
        label={t(item.name as TranslationKey)}
        isSelected={selectedKeys.has(key)}
        isAdded={addedKeys.has(key)}
        onPress={() => togglePreset(key)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {t("onboarding.incomeCategories.subtitle")}
        </Text>
      </View>

      <View style={styles.selectionBar}>
        <Text style={styles.selectionCount}>
          {selectedKeys.size > 0
            ? t("components.categories.presets.selectedCount", {
                count: selectedKeys.size,
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
        data={IncomePresets}
        keyExtractor={(item) => `${item.icon}:${item.type}`}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View style={styles.buttonRow}>
        <Button
          onPress={handleNext}
          disabled={saving}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {t("onboarding.actions.next")}
          </Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  buttonRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  nextButton: {
    width: "100%",
  },
  nextButtonText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
