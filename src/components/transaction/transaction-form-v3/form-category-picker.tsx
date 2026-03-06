import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, useWindowDimensions } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { MintyColorScheme } from "~/styles/theme/types"
import type { Category } from "~/types/categories"

import {
  CATEGORY_CELL_SIZE,
  CATEGORY_GAP,
  H_PAD,
  transactionFormStyles,
} from "./form.styles"

type Props = {
  categories: Category[]
  categoryId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
}

export function FormCategoryPicker({
  categories,
  categoryId,
  onSelect,
  onClear,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  const { width: windowWidth } = useWindowDimensions()

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.category")}
        </Text>
        <Pressable
          onPress={() => categoryId && onClear()}
          style={[
            transactionFormStyles.clearButton,
            !categoryId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={categoryId ? "auto" : "none"}
          accessibilityLabel={t(
            "components.transactionForm.a11y.clearCategory",
          )}
          accessibilityState={{ disabled: !categoryId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("components.transactionForm.fields.clear")}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={transactionFormStyles.categoryScrollContent}
      >
        {categories.length === 0 ? (
          <View
            style={[
              transactionFormStyles.categoryGrid,
              { width: CATEGORY_CELL_SIZE },
            ]}
          >
            <Pressable
              style={transactionFormStyles.categoryCell}
              onPress={() => router.push("/settings/categories")}
              accessible
              accessibilityRole="button"
              accessibilityLabel={t(
                "components.transactionForm.a11y.addCategories",
              )}
            >
              <DynamicIcon
                icon="plus"
                size={32}
                colorScheme={theme?.colors as MintyColorScheme}
                variant="badge"
              />
              <Text
                variant="small"
                style={transactionFormStyles.categoryCellLabel}
                numberOfLines={1}
              >
                {t("components.transactionForm.fields.addCategories")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              transactionFormStyles.categoryGrid,
              {
                width: Math.max(
                  windowWidth - H_PAD * 2,
                  Math.ceil(categories.length / 2) *
                    (CATEGORY_CELL_SIZE + CATEGORY_GAP) -
                    CATEGORY_GAP,
                ),
              },
            ]}
          >
            {categories.map((category) => {
              const isSelected = category.id === categoryId
              return (
                <Pressable
                  key={category.id}
                  style={[
                    transactionFormStyles.categoryCell,
                    isSelected && transactionFormStyles.categoryCellSelected,
                  ]}
                  onPress={() => onSelect(category.id)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "components.transactionForm.a11y.selectCategory",
                    { name: category.name },
                  )}
                  accessibilityState={{ selected: isSelected }}
                >
                  <DynamicIcon
                    icon={category.icon || "shape"}
                    size={32}
                    colorScheme={getThemeStrict(category.colorSchemeName)}
                    variant="badge"
                  />
                  <Text
                    variant="small"
                    style={transactionFormStyles.categoryCellLabel}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
