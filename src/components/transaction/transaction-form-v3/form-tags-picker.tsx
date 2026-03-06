/**
 * Tags picker block for the transaction form: chips + inline dropdown with search.
 * Optional scroll-into-view when scroll refs are passed.
 */

import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { View as RNView, ScrollView } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { getThemeStrict } from "~/styles/theme/registry"
import { NewEnum } from "~/types/new"
import type { Tag } from "~/types/tags"

import { transactionFormStyles } from "./form.styles"

export interface FormTagsPickerProps {
  tags: Tag[]
  tagIds: string[] | undefined
  setValue: (
    name: "tags",
    value: string[],
    opts: { shouldDirty: boolean },
  ) => void
  addTag: (tagId: string) => void
  removeTag: (tagId: string) => void
}

export function FormTagsPicker({
  tags,
  tagIds,
  addTag,
  removeTag,
  setValue,
}: FormTagsPickerProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState("")

  const selectedTags = useMemo(
    () => tags.filter((t) => (tagIds ?? []).includes(t.id)),
    [tags, tagIds],
  )

  const filteredTagsForPicker = useMemo(() => {
    if (!tagSearchQuery.trim()) return tags
    const lower = tagSearchQuery.toLowerCase()
    return tags.filter((t) => t.name.toLowerCase().includes(lower))
  }, [tags, tagSearchQuery])

  const handleToggle = () => {
    setTagPickerOpen((o) => {
      const next = !o
      if (next) {
        scrollIntoView()
        setTagSearchQuery("")
      }
      return next
    })
  }

  return (
    <RNView ref={wrapperRef} style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.tags")}
        </Text>
        <Pressable
          onPress={() =>
            (tagIds ?? []).length > 0 &&
            setValue("tags", [], { shouldDirty: true })
          }
          style={[
            transactionFormStyles.clearButton,
            (tagIds ?? []).length === 0 &&
              transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={(tagIds ?? []).length > 0 ? "auto" : "none"}
          accessibilityLabel={t("components.transactionForm.a11y.clearAllTags")}
          accessibilityState={{
            disabled: (tagIds ?? []).length === 0,
          }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("common.actions.clear")}
          </Text>
        </Pressable>
      </View>
      <View style={transactionFormStyles.tagsWrapGrid}>
        <Pressable
          style={[
            transactionFormStyles.tagChipBase,
            transactionFormStyles.tagChipAdd,
            tagPickerOpen && transactionFormStyles.tagChipCancel,
          ]}
          onPress={handleToggle}
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            tagPickerOpen
              ? t("common.actions.cancel")
              : t("components.transactionForm.a11y.addTag")
          }
        >
          <Text
            variant="default"
            style={[
              transactionFormStyles.tagChipAddText,
              tagPickerOpen && { color: theme.colors.customColors.semi },
            ]}
          >
            {tagPickerOpen
              ? t("common.actions.cancel")
              : t("components.transactionForm.a11y.addTag")}
          </Text>
          <IconSymbol
            name={tagPickerOpen ? "close" : "plus"}
            size={16}
            style={tagPickerOpen && { color: theme.colors.customColors.semi }}
          />
        </Pressable>
        {selectedTags.map((tag) => (
          <Pressable
            key={tag.id}
            style={[
              transactionFormStyles.tagChipBase,
              transactionFormStyles.tagChip,
            ]}
            onPress={() => removeTag(tag.id)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={t("components.transactionForm.a11y.removeTag", {
              name: tag.name,
            })}
          >
            <DynamicIcon
              icon={tag.icon || "tag"}
              size={16}
              colorScheme={getThemeStrict(tag.colorSchemeName)}
              variant="badge"
            />
            <Text
              variant="default"
              style={transactionFormStyles.tagChipText}
              numberOfLines={1}
            >
              {tag.name}
            </Text>
            <IconSymbol
              name="close"
              size={14}
              style={transactionFormStyles.tagChipRemoveIcon}
            />
          </Pressable>
        ))}
      </View>

      {tagPickerOpen && (
        <View native style={transactionFormStyles.inlineTagPicker}>
          <Input
            placeholder="Search tags..."
            value={tagSearchQuery}
            onChangeText={setTagSearchQuery}
            placeholderTextColor={theme.colors.customColors.semi}
            style={transactionFormStyles.tagSearchInput}
          />
          <ScrollView
            style={transactionFormStyles.tagPickerList}
            contentContainerStyle={transactionFormStyles.pickerListContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {filteredTagsForPicker.map((tag) => {
              const isSelected = (tagIds ?? []).includes(tag.id)
              return (
                <Pressable
                  key={tag.id}
                  style={[
                    transactionFormStyles.tagPickerRow,
                    isSelected && transactionFormStyles.inlinePickerRowSelected,
                  ]}
                  onPress={() => {
                    if (isSelected) removeTag(tag.id)
                    else addTag(tag.id)
                  }}
                >
                  <DynamicIcon
                    icon={tag.icon || "tag"}
                    size={20}
                    colorScheme={getThemeStrict(tag.colorSchemeName)}
                    variant="badge"
                  />
                  <Text
                    variant="default"
                    style={transactionFormStyles.tagPickerRowText}
                    numberOfLines={1}
                  >
                    {tag.name}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
          <Pressable
            style={transactionFormStyles.createTagRow}
            onPress={() => {
              setTagPickerOpen(false)
              router.push({
                pathname: "/settings/tags/[tagId]",
                params: { tagId: NewEnum.NEW },
              })
            }}
          >
            <IconSymbol name="tag-plus" size={20} />
            <Text
              variant="default"
              style={transactionFormStyles.createTagRowText}
            >
              Create new tag
            </Text>
          </Pressable>
        </View>
      )}
    </RNView>
  )
}
