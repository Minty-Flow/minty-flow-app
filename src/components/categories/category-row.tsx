import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Category } from "~/types/categories"

interface CategoryRowProps {
  category: Category
  transactionCount: number
}

export const CategoryRow = ({
  category,
  transactionCount,
}: CategoryRowProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleView = () => {
    router.push({
      pathname: "/settings/categories/[categoryId]",
      params: {
        categoryId: category.id,
      },
    })
  }

  return (
    <Pressable style={styles.row} onPress={handleView}>
      <View style={styles.rowContent}>
        {/* Icon/Color indicator */}
        <DynamicIcon
          icon={category.icon}
          size={32}
          colorScheme={category.colorScheme}
        />

        {/* Category name */}
        <View style={styles.nameContainer}>
          <Text variant="default" style={styles.name}>
            {category.name}
          </Text>
          {transactionCount > 0 && (
            <Text variant="small" style={styles.count}>
              {t("components.categoryRow.transactionCount", {
                count: transactionCount,
              })}
            </Text>
          )}
        </View>
      </View>

      <ChevronIcon direction="trailing" size={20} style={styles.chevron} />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    marginHorizontal: 20,
  },
  rowContent: {
    backgroundColor: theme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  nameContainer: {
    backgroundColor: theme.colors.secondary,
    flex: 1,
  },
  name: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  count: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  chevron: {
    color: theme.colors.onSecondary,
    opacity: 0.5,
  },
}))
