import { withObservables } from "@nozbe/watermelondb/react"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { observeCategoriesByType } from "~/database/services/category-service"
import type { Category } from "~/types/categories"
import { NewEnum } from "~/types/new"
import type { TransactionType } from "~/types/transactions"

import { Separator } from "../ui/separator"
import { CategoryRow } from "./category-row"

interface CategoryListProps {
  type: TransactionType
  createdCategory?: string
  updatedCategory?: string
  deletedCategory?: string
  searchQuery?: string
}

interface CategoryListInnerProps extends CategoryListProps {
  categories: Category[]
}

interface CategoryListHeaderProps {
  onAddCategory: () => void
  onAddFromPresets: () => void
}

function CategoryListHeader({
  onAddCategory,
  onAddFromPresets,
}: CategoryListHeaderProps) {
  const { t } = useTranslation()

  return (
    <>
      <View style={styles.headerContainer}>
        <Button
          variant="secondary"
          size="default"
          onPress={onAddCategory}
          style={styles.headerButton}
        >
          <IconSvg name="plus" size={20} />
          <Text variant="default" style={styles.headerButtonText}>
            {t("components.categories.actions.addNew")}
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="default"
          onPress={onAddFromPresets}
          style={styles.headerButton}
        >
          <IconSvg name="category-plus" size={20} />
          <Text variant="default" style={styles.headerButtonText}>
            {t("components.categories.actions.addFromPresets")}
          </Text>
        </Button>
      </View>
      <Separator />
    </>
  )
}

const CategoryListInner = ({
  type,
  createdCategory,
  updatedCategory,
  deletedCategory,
  categories,
  searchQuery = "",
}: CategoryListInnerProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const typeLabel = t(`components.categories.types.${type}`)

  // Clear URL params when screen comes into focus
  // The reactive observe will automatically update the list
  useFocusEffect(
    useCallback(() => {
      if (createdCategory) {
        router.setParams({ createdCategory: undefined })
      }
      if (updatedCategory) {
        router.setParams({ updatedCategory: undefined })
      }
      if (deletedCategory) {
        router.setParams({ deletedCategory: undefined })
      }
    }, [createdCategory, updatedCategory, deletedCategory, router]),
  )

  const handleAddCategory = () => {
    router.push({
      pathname: "/settings/categories/[categoryId]/modify",
      params: {
        categoryId: NewEnum.NEW,
        initialType: type,
      },
    })
  }

  const handleAddFromPresets = () => {
    router.push({
      pathname: "/settings/categories/presets",
      params: {
        type,
      },
    })
  }

  const header = (
    <CategoryListHeader
      onAddCategory={handleAddCategory}
      onAddFromPresets={handleAddFromPresets}
    />
  )

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) => {
        if (searchQuery.trim().length === 0) return true
        return category.name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      }),
    [categories, searchQuery],
  )

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryRow category={item} transactionCount={item.transactionCount} />
    ),
    [],
  )

  const keyExtractor = useCallback((item: Category) => item.id, [])

  if (filteredCategories.length === 0) {
    if (searchQuery) {
      return (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyContainer}>
            <IconSvg name="search" size={40} style={styles.emptyIcon} />
            <Text variant="h4" style={styles.emptyTitle}>
              {t("components.categories.empty.noResults.title", {
                query: searchQuery,
              })}
            </Text>
            <Text variant="small" style={styles.emptyDescription}>
              {t("components.categories.empty.noResults.description")}
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.emptyWrapper}>
        {header}
        <View style={styles.emptyContainer}>
          <IconSvg name="category" size={40} style={styles.emptyIcon} />
          <Text variant="h4" style={styles.emptyTitle}>
            {t("components.categories.empty.noCategories.title", {
              type: typeLabel,
            })}
          </Text>
          <Text variant="small" style={styles.emptyDescription}>
            {t("components.categories.empty.noCategories.description")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <FlatList
      data={filteredCategories}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={header}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  listContent: {
    paddingBottom: 100,
    gap: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  headerButtonText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
  },
  emptyWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 20,
  },
  emptyTitle: {
    ...theme.typography.titleMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
}))

// Enhance component with WatermelonDB observables
// This follows WatermelonDB best practices: https://watermelondb.dev/docs/Query
export const CategoryList = withObservables(
  ["type"],
  ({ type }: CategoryListProps) => ({
    categories: observeCategoriesByType(type),
  }),
)(CategoryListInner)
