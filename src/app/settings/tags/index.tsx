import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { TagCard } from "~/components/tags/tag-card"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { observeTags } from "~/database/services/tag-service"
import { NewEnum } from "~/types/new"
import type { Tag } from "~/types/tags"

interface TagsScreenInnerProps {
  tags: Tag[]
}

const TagsScreenInner = ({ tags }: TagsScreenInnerProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()

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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder={t("screens.settings.tags.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.newTagButton} onPress={handleAddTag}>
          <IconSvg name="plus" size={24} />
          <Text variant="default" style={styles.newTagText}>
            {t("screens.settings.tags.newTag")}
          </Text>
        </Pressable>

        {filteredModels.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon={searchQuery.trim() ? "search" : "tags"}
              title={
                searchQuery.trim()
                  ? t("screens.settings.tags.empty.noResults")
                  : t("screens.settings.tags.empty.noTags")
              }
            />
          </View>
        ) : (
          <View style={styles.list}>
            {filteredModels.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const enhance = withObservables([], () => ({
  tags: observeTags(),
}))

export default enhance(TagsScreenInner)

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
  list: {
    // gap: 12,
  },
  newTagButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  newTagText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
}))
