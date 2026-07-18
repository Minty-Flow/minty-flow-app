import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { TagCard } from "~/components/tags/tag-card"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useTags } from "~/stores/db/tag.store"
import { NewEnum } from "~/types/new"

export default function TagsScreen() {
  const tags = useTags()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()

  const navigation = useNavigation()
  const [showSearch, setShowSearch] = useState(false)

  const filteredModels = tags.filter((model) => {
    if (!searchQuery.trim()) return true
    return model.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleAddTag = () => {
    router.push({
      pathname: "/settings/tags/[tagId]",
      params: { tagId: NewEnum.NEW },
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant={"ghost"}
          size="icon"
          onPress={() => setShowSearch((v) => !v)}
        >
          <IconSvg
            name={showSearch ? "filter-2-x-outline" : "filter-2-search-outline"}
            size={20}
          />
        </Button>
      ),
    })
  }, [navigation, showSearch])

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ListItem style={styles.newTagButton} onPress={handleAddTag}>
          <IconSvg name="plus-outline" size={24} />
          <Text variant="default" style={styles.newTagText}>
            {t("screens.settings.tags.newTag")}
          </Text>
        </ListItem>

        {filteredModels.length === 0 ? (
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
        ) : (
          filteredModels.map((tag) => <TagCard key={tag.id} tag={tag} />)
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  newTagButton: {
    gap: 12,
    marginVertical: 15,
  },
  newTagText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
}))
