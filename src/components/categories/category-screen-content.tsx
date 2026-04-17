import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { TabsMinty } from "../tabs-minty"
import { CategoryList } from "./category-list"

interface CategoryScreenContentProps {
  subtitle: string
  initialType?: TransactionType
  searchPlaceholder?: string
  extraListProps?: {
    createdCategory?: string
    updatedCategory?: string
    deletedCategory?: string
  }
}

export function CategoryScreenContent({
  subtitle,
  initialType,
  searchPlaceholder,
  extraListProps,
}: CategoryScreenContentProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>(
    initialType || TransactionTypeEnum.EXPENSE,
  )

  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState("")

  const clearSearch = () => {
    setSearchQuery("")
  }

  const currentSearchPlaceholder =
    searchPlaceholder ||
    t("components.categories.search.placeholder", {
      tab: t(
        `components.categories.types.${activeTab.toLowerCase()}` as TranslationKey,
      ),
    })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="small" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      {/* Tabs */}
      <TabsMinty<TransactionType>
        items={[
          {
            value: TransactionTypeEnum.EXPENSE,
            label: t("components.categories.types.expense"),
            icon: "chevrons-up",
          },
          {
            value: TransactionTypeEnum.INCOME,
            label: t("components.categories.types.income"),
            icon: "chevrons-down",
          },
        ]}
        activeValue={activeTab}
        onValueChange={setActiveTab}
        variant="segmented"
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder={currentSearchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={clearSearch}
        />
      </View>

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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
}))
