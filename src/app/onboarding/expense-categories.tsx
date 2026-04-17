import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useState, useTransition } from "react"
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
} from "~/constants/pre-sets-categories"
import {
  createCategory,
  observeCategoriesByType,
} from "~/database/services/category-service"
import type { TranslationKey } from "~/i18n/config"
import type { Category } from "~/types/categories"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

interface ExpenseCategoriesInnerProps {
  categories: Category[]
}

function ExpenseCategoriesInner({ categories }: ExpenseCategoriesInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [saving, startTransition] = useTransition()

  const addedKeys = new Set<string>()
  for (const preset of ExpensePresets) {
    if (
      categories.some((c) => c.icon === preset.icon && c.type === preset.type)
    ) {
      addedKeys.add(`${preset.icon}:${preset.type}`)
    }
  }

  const availableKeys = ExpensePresets.filter(
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
      const toCreate = ExpensePresets.filter((p) =>
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
      router.push("/onboarding/income-categories")
    })
  }

  const renderItem = ({ item }: { item: CategoryPreset }) => {
    const key = `${item.icon}:${item.type}`
    const isAdded = addedKeys.has(key)
    const isSelected = selectedKeys.has(key)
    return (
      <Pressable
        style={styles.presetItem}
        onPress={() => togglePreset(key)}
        disabled={isAdded}
      >
        <DynamicIcon icon={item.icon} size={24} />
        <View style={styles.presetTextContainer}>
          <Text style={styles.presetName}>
            {t(item.name as TranslationKey)}
          </Text>
        </View>
        {isAdded ? (
          <View style={styles.addedBadge}>
            <Text style={styles.addedText}>
              {t("components.categories.presets.added")}
            </Text>
          </View>
        ) : isSelected ? (
          <View style={styles.checkmark}>
            <IconSvg
              name="check"
              size={16}
              color={styles.checkmarkIconColor.color}
            />
          </View>
        ) : (
          <View style={styles.plusCircle}>
            <IconSvg name="plus" size={20} />
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.title}>
          {t("onboarding.expenseCategories.title")}
        </Text> */}
        <Text style={styles.subtitle}>
          {t("onboarding.expenseCategories.subtitle")}
        </Text>
      </View>

      <Pressable style={styles.selectAllRow} onPress={toggleSelectAll}>
        <Text style={styles.selectAllText}>
          {allSelected
            ? t("components.categories.presets.deselectAll")
            : t("components.categories.presets.selectAll")}
        </Text>

        <IconSvg name={allSelected ? "checks" : "check"} size={20} />

        {/* {allSelected ? (
          <View style={styles.checkmark}>
            <IconSvg
              name="check"
              size={16}
              color={styles.checkmarkIconColor.color}
            />
          </View>
        ) : (
          <View style={styles.plusCircle}>
            <IconSvg name="plus" size={20} />
          </View>
        )} */}
      </Pressable>

      <FlatList
        data={ExpensePresets}
        keyExtractor={(item) => `${item.icon}:${item.type}`}
        renderItem={renderItem}
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

const EnhancedExpenseCategories = withObservables([], () => ({
  categories: observeCategoriesByType(TransactionTypeEnum.EXPENSE),
}))(ExpenseCategoriesInner)

export default function OnboardingExpenseCategoriesScreen() {
  return <EnhancedExpenseCategories />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    fontSize: theme.typography.displaySmall.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  selectAllText: {
    flex: 1,
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  list: {
    flex: 1,
  },
  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  presetTextContainer: {
    flex: 1,
  },
  presetName: {
    fontSize: theme.typography.titleSmall.fontSize,
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
  checkmarkIconColor: {
    color: theme.colors.onPrimary,
  },
  plusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.onSecondary,
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
