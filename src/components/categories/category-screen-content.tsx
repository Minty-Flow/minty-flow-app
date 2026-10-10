import { useNavigation } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { FilterToggleButton } from "~/components/filter-toggle-button"
import { SearchInput } from "~/components/search-input"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { type CategoryType, CategoryTypeEnum } from "~/types/categories"

import { TabsMinty } from "../tabs-minty"
import { CategoryList } from "./category-list"

interface CategoryScreenContentProps {
  initialType?: CategoryType
  searchPlaceholder?: string
  extraListProps?: {
    createdCategory?: string
    updatedCategory?: string
    deletedCategory?: string
  }
}

export function CategoryScreenContent({
  initialType,
  searchPlaceholder,
  extraListProps,
}: CategoryScreenContentProps) {
  const [activeTab, setActiveTab] = useState<CategoryType>(
    initialType || CategoryTypeEnum.EXPENSE,
  )
  const navigation = useNavigation()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState("")

  const clearSearch = () => {
    setSearchQuery("")
  }

  const [showSearch, setShowSearch] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FilterToggleButton
          variant="search"
          active={showSearch}
          onPress={() => setShowSearch((v) => !v)}
        />
      ),
    })
  }, [navigation, showSearch])

  const currentSearchPlaceholder =
    searchPlaceholder ||
    t("components.categories.search.placeholder", {
      tab: t(
        `components.categories.types.${activeTab.toLowerCase()}` as TranslationKey,
      ),
    })

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <TabsMinty<CategoryType>
        items={[
          {
            value: CategoryTypeEnum.EXPENSE,
            label: t("components.categories.types.expense"),
            icon: "chevrons-up-outline",
          },
          {
            value: CategoryTypeEnum.INCOME,
            label: t("components.categories.types.income"),
            icon: "chevrons-down-outline",
          },
        ]}
        activeValue={activeTab}
        onValueChange={setActiveTab}
        variant="segmented"
      />

      {/* Search Bar */}

      {showSearch && (
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={currentSearchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={clearSearch}
          />
        </View>
      )}

      {/* Category List */}
      <CategoryList
        type={activeTab}
        searchQuery={searchQuery}
        {...extraListProps}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  searchContainer: {
    paddingHorizontal: 20,
    // marginBottom: 8,
  },
}))
