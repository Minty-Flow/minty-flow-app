/**
 * InlineCategoryPicker
 * Reusable inline (no modal) multi-select category picker.
 * Trigger row toggles a wrapping grid panel — same cell style as FormCategoryPicker.
 */

import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Category } from "~/types/categories"
import { NewEnum } from "~/types/new"

import { Button } from "../ui/button"

// Mirror the constants from transaction-form-v3/form.styles.ts
const H_PAD = 20
const SMALL_GAP = 4
const CATEGORY_CELL_SIZE = 74
const CATEGORY_GAP = 10
const ROW_PADDING_V = 10
const TRIGGER_PAD = 6

interface InlineCategoryPickerProps {
  categories: Category[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  label?: string
  icon?: IconSvgName
}

export function InlineCategoryPicker({
  categories,
  selectedIds,
  onSelectionChange,
  label,
  icon = "category",
}: InlineCategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()

  const handleCreateCategory = () => {
    router.push({
      pathname: "/settings/categories/[categoryId]/modify",
      params: { categoryId: NewEnum.NEW },
    })
  }

  const selectedNames = selectedIds.length

  const allSelected =
    categories.length > 0 && categories.every((c) => selectedIds.includes(c.id))

  const toggleItem = (id: string) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id],
    )
  }
  const handleSelectAll = () => {
    onSelectionChange(allSelected ? [] : categories.map((c) => c.id))
  }

  return (
    <View style={styles.container}>
      {/* ---- Trigger row ---- */}
      <Pressable
        style={styles.triggerRow}
        onPress={() => setOpen((v) => !v)}
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.triggerLeft}>
          <IconSvg name={icon} size={24} />
          <Text variant="default" style={styles.label}>
            {label}
          </Text>
        </View>
        <View style={styles.triggerRight}>
          <Text
            variant="default"
            style={[
              styles.value,
              selectedIds.length === 0 && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {selectedNames}
          </Text>
          <ChevronIcon direction={open ? "up" : "trailing"} size={18} />
        </View>
      </Pressable>

      {/* ---- Grid panel ---- */}
      {open &&
        (categories.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyText}>
              {t("components.inlineCategoryPicker.noCategories")}
            </Text>
            <Pressable
              style={styles.createButton}
              onPress={handleCreateCategory}
            >
              <IconSvg
                name="plus"
                size={16}
                color={styles.createButtonIcon.color}
              />
              <Text style={styles.createButtonText}>
                {t("components.inlineCategoryPicker.createCategory")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.gridContent}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Select all / Deselect all */}
            <Button
              variant="ghost"
              style={styles.selectAllRow}
              onPress={handleSelectAll}
            >
              <IconSvg name={allSelected ? "checks" : "check"} size={18} />
              <Text style={styles.selectAllText}>
                {allSelected ? "Deselect all" : "Select all"}
              </Text>
            </Button>

            {/* Category grid */}
            <View style={styles.grid}>
              {categories.map((category) => {
                const isSelected = selectedIds.includes(category.id)
                return (
                  <Pressable
                    key={category.id}
                    style={[styles.cell, isSelected && styles.cellSelected]}
                    onPress={() => toggleItem(category.id)}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <DynamicIcon
                      icon={category.icon || "tag"}
                      size={32}
                      colorScheme={getThemeStrict(category.colorSchemeName)}
                      variant="badge"
                    />
                    <Text style={styles.cellLabel} numberOfLines={1}>
                      {category.name}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </ScrollView>
        ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {},

  // ---- Trigger ----
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: H_PAD,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  value: {
    fontSize: 15,
    color: theme.colors.onSecondary,
    maxWidth: 200,
    textAlign: "right",
  },
  placeholder: {
    opacity: 0.5,
  },

  // ---- Grid panel ----
  // ScrollView must NOT have flex:1 — let content drive the height, cap with maxHeight
  gridScroll: {
    maxHeight: 300,
  },
  gridContent: {
    paddingHorizontal: H_PAD,
    paddingVertical: SMALL_GAP,
    paddingBottom: H_PAD,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CATEGORY_GAP,
  },
  cell: {
    width: CATEGORY_CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: TRIGGER_PAD,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.secondary,
  },
  cellSelected: {
    borderStyle: "solid",
    borderColor: theme.colors.primary,
  },
  cellLabel: {
    fontSize: 11,
    color: theme.colors.onSurface,
    marginTop: SMALL_GAP,
    textAlign: "center",
  },

  // ---- Select all ----
  selectAllRow: {
    // flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "flex-end",
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },

  // ---- Empty state ----
  emptyPanel: {
    paddingVertical: 24,
    paddingHorizontal: H_PAD,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.onSecondary,
    opacity: 0.6,
    textAlign: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.radius,
  },
  createButtonIcon: {
    color: theme.colors.primary,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}))
