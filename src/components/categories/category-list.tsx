import { useFocusEffect, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { RouteLoadingState } from "~/components/route-load-state"
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useCategoriesByTypeQuery } from "~/database/drizzle/read-models/category-read-model"
import type { Category, CategoryType } from "~/types/categories"
import { NewEnum } from "~/types/new"

import { CategoryRow } from "./category-row"

interface CategoryListProps {
  type: CategoryType
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
    <View style={styles.headerContainer}>
      <Pressable style={styles.headerTile} onPress={onAddCategory}>
        <IconSvg name="plus-outline" size={28} />
        <Text variant="default" style={styles.headerTileText} numberOfLines={2}>
          {t("components.categories.actions.addNew")}
        </Text>
      </Pressable>
      <Pressable style={styles.headerTile} onPress={onAddFromPresets}>
        <IconSvg name="category-plus-outline" size={28} />
        <Text variant="default" style={styles.headerTileText} numberOfLines={2}>
          {t("components.categories.actions.addFromPresets")}
        </Text>
      </Pressable>
    </View>
  )
}
export const CategoryList = ({
  type,
  createdCategory,
  updatedCategory,
  deletedCategory,
  searchQuery = "",
}: CategoryListProps) => {
  const { data: categories, status } = useCategoriesByTypeQuery(type, true)
  const router = useRouter()
  const { t } = useTranslation()
  const typeLabel = t(`components.categories.types.${type}`)
  // Clear URL params when screen comes into focus
  // The reactive observe will automatically update the list
  useFocusEffect(() => {
    if (createdCategory) {
      router.setParams({ createdCategory: undefined })
    }
    if (updatedCategory) {
      router.setParams({ updatedCategory: undefined })
    }
    if (deletedCategory) {
      router.setParams({ deletedCategory: undefined })
    }
  })
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
  const filteredCategories = categories.filter((category) => {
    if (searchQuery.trim().length === 0) return true
    return category.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  })
  const renderItem = ({ item }: { item: Category }) => (
    <CategoryRow category={item} transactionCount={item.transactionCount} />
  )
  const keyExtractor = (item: Category) => item.id
  if (status === "loading") return <RouteLoadingState />
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
    paddingHorizontal: 20,
    gap: 10,
  },
  // Two equal square tiles side by side, icon over label.
  headerContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    gap: 10,
  },
  headerTile: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
  },
  headerTileText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    textAlign: "center",
    color: theme.colors.onSecondary,
  },
  emptyWrapper: {
    flex: 1,
    marginHorizontal: 20,
  },
}))
