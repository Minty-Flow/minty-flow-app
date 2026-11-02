import { useFocusEffect, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { RouteLoadingState } from "~/components/route-load-state"
import { EmptyState } from "~/components/ui/empty-state"
import { Fab } from "~/components/ui/fab"
import { View } from "~/components/ui/view"
import { useCategoriesByTypeQuery } from "~/database/drizzle/read-models/category-read-model"
import type { Category, CategoryType } from "~/types/categories"

import { CategoryRow } from "./category-row"

interface CategoryListProps {
  type: CategoryType
  createdCategory?: string
  updatedCategory?: string
  deletedCategory?: string
  searchQuery?: string
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
  const handleAdd = () =>
    router.push({
      pathname: "/settings/categories/add",
      params: { type },
    })
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
  const addControls = (
    <Fab
      onPress={handleAdd}
      accessibilityLabel={t("components.categories.actions.addNew")}
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
      <View style={styles.screen}>
        <View style={styles.emptyWrapper}>
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
        {addControls}
      </View>
    )
  }
  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredCategories}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      {addControls}
    </View>
  )
}
const styles = StyleSheet.create((theme) => ({
  listContent: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingHorizontal: 20,
    gap: 10,
  },
  screen: {
    flex: 1,
  },
  emptyWrapper: {
    flex: 1,
    marginHorizontal: 20,
  },
}))
