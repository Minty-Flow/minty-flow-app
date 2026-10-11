import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { SearchInput } from "~/components/search-input"
import { sheetHeaderStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Category, CategoryType } from "~/types/categories"
import { NewEnum } from "~/types/new"

import { getMostUsedCategories } from "./most-used"

/** Show a "Most used" section only once there are enough to browse. */
const MOST_USED_MIN_TOTAL = 7
const MOST_USED_COUNT = 5

type Props = {
  visible: boolean
  categories: Category[]
  /** "single" applies on tap; "multi" edits a draft and applies on Done. */
  mode: "single" | "multi"
  selectedIds: string[]
  onApply: (ids: string[]) => void
  onClose: () => void
  /** Type for the "New category" shortcut; omit to hide the shortcut. */
  newCategoryType?: CategoryType
  /** Called just before leaving for the create-category screen. */
  onNewCategory?: () => void
}

export function CategoryPickerSheet(props: Props) {
  // Mounted only while open so the draft and search reset on every open.
  if (!props.visible) return null
  return <CategoryPickerSheetInner {...props} />
}

function CategoryPickerSheetInner({
  categories,
  mode,
  selectedIds,
  onApply,
  onClose,
  newCategoryType,
  onNewCategory,
}: Omit<Props, "visible">) {
  const { t } = useTranslation()
  const router = useRouter()
  const [draft, setDraft] = useState<string[]>(selectedIds)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const filtered = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q))
    : categories
  const mostUsed =
    !q && categories.length >= MOST_USED_MIN_TOTAL
      ? getMostUsedCategories(categories, MOST_USED_COUNT, false)
      : []
  const allSelected =
    categories.length > 0 && categories.every((c) => draft.includes(c.id))

  const handlePress = (id: string) => {
    if (mode === "single") {
      // Tapping the current choice clears it, like the inline chips.
      onApply(selectedIds.includes(id) ? [] : [id])
      onClose()
      return
    }
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
  }

  const handleNewCategory = () => {
    // Keep a multi-select draft instead of dropping it on the way out.
    if (mode === "multi") onApply(draft)
    onNewCategory?.()
    onClose()
    router.push({
      pathname: "/settings/categories/[categoryId]/modify",
      params: { categoryId: NewEnum.NEW, initialType: newCategoryType },
    })
  }

  const isChecked = (id: string) =>
    mode === "single" ? selectedIds.includes(id) : draft.includes(id)

  const renderRow = (category: Category, keyPrefix: string) => (
    <CategoryRow
      key={`${keyPrefix}-${category.id}`}
      category={category}
      checked={isChecked(category.id)}
      multi={mode === "multi"}
      onPress={() => handlePress(category.id)}
    />
  )

  return (
    <BottomSheet
      isPresented
      onDismiss={onClose}
      contentPadding={0}
      heightFraction={0.75}
    >
      <View style={styles.container}>
        <View style={sheetHeaderStyles.header}>
          <Text style={sheetHeaderStyles.title}>
            {t(
              mode === "multi"
                ? "components.categoryPicker.titleMulti"
                : "components.categoryPicker.title",
            )}
          </Text>
        </View>

        <View style={styles.controls}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            placeholder={t("components.categoryPicker.search")}
          />
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {mostUsed.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {t("components.categoryPicker.mostUsed")}
              </Text>
              {mostUsed.map((c) => renderRow(c, "top"))}
              <Text style={[styles.sectionTitle, styles.sectionTitleGap]}>
                {t("components.categoryPicker.all")}
              </Text>
            </>
          ) : null}

          {filtered.length === 0 ? (
            <Text variant="default" style={styles.empty}>
              {t("components.categoryPicker.noResults")}
            </Text>
          ) : (
            filtered.map((c) => renderRow(c, "all"))
          )}

          {newCategoryType ? (
            <ListItem style={styles.row} onPress={handleNewCategory}>
              <View style={styles.newIcon}>
                <IconSvg name="plus-outline" size={20} />
              </View>
              <Text style={styles.newLabel}>
                {t("components.categoryPicker.newCategory")}
              </Text>
            </ListItem>
          ) : null}
        </ScrollView>

        {mode === "multi" ? (
          <View style={styles.footer}>
            <Button
              variant="outline"
              onPress={() =>
                setDraft(allSelected ? [] : categories.map((c) => c.id))
              }
              disabled={categories.length === 0}
              style={styles.footerButton}
            >
              <Text variant="default">
                {t(
                  allSelected
                    ? "components.categoryPicker.deselectAll"
                    : "components.categoryPicker.selectAll",
                )}
              </Text>
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
        ) : null}
      </View>
    </BottomSheet>
  )
}

function CategoryRow({
  category,
  checked,
  multi,
  onPress,
}: {
  category: Category
  checked: boolean
  multi: boolean
  onPress: () => void
}) {
  const { theme } = useUnistyles()
  return (
    <ListItem
      style={styles.row}
      onPress={onPress}
      accessibilityRole={multi ? "checkbox" : "radio"}
      accessibilityState={{ checked }}
    >
      <DynamicIcon
        icon={category.icon || "category-outline"}
        size={20}
        colorScheme={getThemeStrict(category.colorSchemeName)}
        variant="badge"
      />
      <Text style={styles.rowLabel} numberOfLines={2}>
        {category.name}
      </Text>
      {multi ? (
        <IconSvg
          name={checked ? "square-check-outline" : "square-outline"}
          size={22}
          color={checked ? theme.colors.primary : theme.colors.semantic.semi}
        />
      ) : checked ? (
        <IconSvg name="check-outline" size={20} color={theme.colors.primary} />
      ) : null}
    </ListItem>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1 },
  controls: { paddingHorizontal: 20, paddingBottom: 8 },
  list: { flex: 1 },
  listContent: { paddingBottom: 16 },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 4,
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
  },
  sectionTitleGap: { marginTop: 8 },
  row: {
    gap: 12,
    paddingVertical: 10,
  },
  rowLabel: {
    flex: 1,
    ...theme.typography.bodyLarge,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  newIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  newLabel: {
    flex: 1,
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.primary,
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
    textAlign: "center",
    paddingVertical: 24,
    color: theme.colors.semantic.semi,
  },
}))
