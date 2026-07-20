import { useNavigation } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { SearchInput } from "~/components/search-input"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { TabsMinty } from "../tabs-minty"
import { Button } from "../ui/button"
import { CategoryList } from "./category-list"

interface CategoryScreenContentProps {
  initialType?: TransactionType
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
  const [activeTab, setActiveTab] = useState<TransactionType>(
    initialType || TransactionTypeEnum.EXPENSE,
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
      <TabsMinty<TransactionType>
        items={[
          {
            value: TransactionTypeEnum.EXPENSE,
            label: t("components.categories.types.expense"),
            icon: "chevrons-up-outline",
          },
          {
            value: TransactionTypeEnum.INCOME,
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
