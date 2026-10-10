/**
 * Tags field for the transaction form: one horizontal row. "Add tag" is always
 * first and opens the tag picker sheet; the applied tags follow as chips
 * (tap one to drop it).
 */
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Chip } from "~/components/ui/chips"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import type { Tag } from "~/types/tags"

import { transactionFormStyles } from "./form.styles"
import { TagPickerSheet } from "./tag-picker-sheet"

interface FormTagsPickerProps {
  tags: Tag[]
  tagIds: string[] | undefined
  setTags: (tagIds: string[]) => void
  removeTag: (tagId: string) => void
}

export function FormTagsPicker({
  tags,
  tagIds,
  setTags,
  removeTag,
}: FormTagsPickerProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const [sheetVisible, setSheetVisible] = useState(false)
  // True while the create-tag screen is open: reopen the picker on return.
  const reopenOnFocusRef = useRef(false)
  const selectedIds = tagIds ?? []
  const selectedTags = tags.filter((tag) => selectedIds.includes(tag.id))
  const addLabel = t("components.transactionForm.a11y.addTag")

  const handleNewTag = (draft: string[]) => {
    setTags(draft)
    reopenOnFocusRef.current = true
    setSheetVisible(false)
    router.push({
      pathname: "/settings/tags/[tagId]",
      params: { tagId: NewEnum.NEW },
    })
  }

  // Back from the create-tag screen: reopen the picker.
  useFocusEffect(
    useCallback(() => {
      if (reopenOnFocusRef.current) {
        reopenOnFocusRef.current = false
        setSheetVisible(true)
      }
    }, []),
  )

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={transactionFormStyles.tagsRow}
      >
        <Pressable
          style={[
            transactionFormStyles.tagChipBase,
            transactionFormStyles.tagChipAdd,
          ]}
          onPress={() => setSheetVisible(true)}
          accessibilityLabel={addLabel}
        >
          <Text variant="default" style={transactionFormStyles.tagChipAddText}>
            {addLabel}
          </Text>
          <IconSvg name="plus-outline" size={16} />
        </Pressable>
        {selectedTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            selected
            onPress={() => removeTag(tag.id)}
            leading={
              <DynamicIcon
                icon={tag.icon || "tag-outline"}
                size={16}
                colorScheme={getThemeStrict(tag.colorSchemeName)}
                variant="badge"
              />
            }
            trailing={
              <IconSvg
                name="x-outline"
                size={16}
                color={theme.colors.semantic.semi}
              />
            }
          />
        ))}
      </ScrollView>

      <TagPickerSheet
        visible={sheetVisible}
        tags={tags}
        selectedIds={selectedIds}
        onApply={setTags}
        onNewTag={handleNewTag}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  )
}
