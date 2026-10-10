import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { SearchInput } from "~/components/search-input"
import { sheetHeaderStyles } from "~/components/selectors/styles"
import { filterHeaderStyles } from "~/components/transaction/transaction-filter-header/filter-header.styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Tag } from "~/types/tags"

type Props = {
  visible: boolean
  tags: Tag[]
  /** Currently applied tag ids; the sheet edits a draft and applies it on Done. */
  selectedIds: string[]
  onApply: (tagIds: string[]) => void
  /** Called with the current draft; the parent applies it and opens the create-tag screen. */
  onNewTag: (draft: string[]) => void
  onClose: () => void
}

export function TagPickerSheet(props: Props) {
  // Mounted only while open so the draft and search reset on every open.
  if (!props.visible) return null
  return <TagPickerSheetInner {...props} />
}

function TagPickerSheetInner({
  tags,
  selectedIds,
  onApply,
  onNewTag,
  onClose,
}: Omit<Props, "visible">) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<string[]>(selectedIds)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const visibleTags = q
    ? tags.filter((tag) => tag.name.toLowerCase().includes(q))
    : tags

  const toggle = (id: string) =>
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <BottomSheet
      isPresented
      onDismiss={onClose}
      contentPadding={0}
      heightFraction={0.5}
    >
      <View style={styles.container}>
        <View style={sheetHeaderStyles.header}>
          <Text style={sheetHeaderStyles.title}>
            {t("components.transactionForm.selectTags")}
          </Text>
        </View>

        <View style={styles.controls}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            placeholder={t("components.transactionForm.searchTags")}
          />
        </View>

        <View style={styles.newTagRow}>
          <Button
            variant="ghost"
            style={filterHeaderStyles.clearHit}
            onPress={() => onNewTag(draft)}
          >
            <IconSvg name="tag-plus-outline" size={18} />
            <Text style={filterHeaderStyles.addNewText}>
              {t("screens.settings.tags.newTag")}
            </Text>
          </Button>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.chips}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {visibleTags.length === 0 ? (
            <Text variant="default" style={styles.empty}>
              {t("components.transactionForm.a11y.noTagsFound")}
            </Text>
          ) : (
            visibleTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                selected={draft.includes(tag.id)}
                onPress={() => toggle(tag.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: draft.includes(tag.id) }}
                leading={
                  <DynamicIcon
                    icon={tag.icon || "tag-outline"}
                    size={16}
                    colorScheme={getThemeStrict(tag.colorSchemeName)}
                    variant="badge"
                  />
                }
              />
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => setDraft([])}
            disabled={draft.length === 0}
            style={styles.footerButton}
          >
            <Text variant="default">{t("common.actions.clear")}</Text>
          </Button>
          <Button
            variant="default"
            onPress={() => {
              onApply(draft)
              onClose()
            }}
            style={styles.footerButton}
          >
            <Text variant="default">{t("common.actions.done")}</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1 },
  controls: { paddingHorizontal: 20, paddingBottom: 8 },
  newTagRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  list: { flex: 1 },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerButton: { flex: 1 },
  empty: {
    width: "100%",
    textAlign: "center",
    paddingVertical: 24,
    color: theme.colors.semantic.semi,
  },
}))
