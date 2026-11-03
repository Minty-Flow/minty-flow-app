import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { FilterToggleButton } from "~/components/filter-toggle-button"
import { RouteLoadingState } from "~/components/route-load-state"
import { SearchInput } from "~/components/search-input"
import { TagCard } from "~/components/tags/tag-card"
import { EmptyState } from "~/components/ui/empty-state"
import { Fab } from "~/components/ui/fab"
import { View } from "~/components/ui/view"
import { useTagsQuery } from "~/database/drizzle/read-models/tag-read-model"
import { NewEnum } from "~/types/new"

export default function TagsScreen() {
  const { data: tags, status } = useTagsQuery()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()

  const navigation = useNavigation()
  const [showSearch, setShowSearch] = useState(false)
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return tags
    const lower = searchQuery.toLowerCase()
    return tags.filter((model) => model.name.toLowerCase().includes(lower))
  }, [searchQuery, tags])

  const handleAddTag = () => {
    router.push({
      pathname: "/settings/tags/[tagId]",
      params: { tagId: NewEnum.NEW },
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FilterToggleButton
          variant="search"
          active={showSearch}
          onPress={() => setShowSearch((v) => !v)}
          filtersApplied={searchQuery.trim().length > 0}
        />
      ),
    })
  }, [navigation, showSearch, searchQuery])

  if (status === "loading") return <RouteLoadingState />

  return (
    <View style={styles.container}>
      {showSearch && (
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={t("screens.settings.tags.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredModels}
        keyExtractor={(tag) => tag.id}
        renderItem={({ item: tag }) => <TagCard tag={tag} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon={searchQuery.trim() ? "search-outline" : "tags-outline"}
              title={
                searchQuery.trim()
                  ? t("screens.settings.tags.empty.noResults")
                  : t("screens.settings.tags.empty.noTags")
              }
            />
          </View>
        }
      />
      <Fab
        onPress={handleAddTag}
        accessibilityLabel={t("screens.settings.tags.newTag")}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  emptyWrapper: {
    marginHorizontal: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    // Room for the floating add button below the last tag.
    paddingTop: 12,
    paddingBottom: 96,
  },
}))
