import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useCategoriesByType } from "~/stores/db/category.store"
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
          <IconSvg name="plus-outline" size={20} />
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
          <IconSvg name="category-plus-outline" size={20} />
          <Text variant="default" style={styles.headerButtonText}>
            {t("components.categories.actions.addFromPresets")}
          </Text>
        </Button>
      </View>
      <Separator />
    </>
  )
}

export const CategoryList = ({
  type,
  createdCategory,
  updatedCategory,
  deletedCategory,
  searchQuery = "",
}: CategoryListProps) => {
  const categories = useCategoriesByType(type)
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
          <EmptyState
            icon="search-outline"
            title={t("components.categories.empty.noResults.title", {
              query: searchQuery,
            })}
            description={t("components.categories.empty.noResults.description")}
          />
        </View>
      )
    }

    return (
      <View style={styles.emptyWrapper}>
        {header}
        <EmptyState
          icon="category-outline"
          title={t("components.categories.empty.noCategories.title", {
            type: typeLabel,
          })}
          description={t(
            "components.categories.empty.noCategories.description",
          )}
        />
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
    paddingVertical: 10,
    paddingHorizontal: 20,

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
}))
