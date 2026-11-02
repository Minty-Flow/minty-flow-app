/**
 * Add flow for Settings → Categories, as a full screen: "Create your own" on
 * top, then the same presets picker onboarding uses. The picker owns its scroll
 * area and the pinned add button.
 */
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { CategoryPresetsPicker } from "~/components/categories/category-presets-picker"
import { IconSvg } from "~/components/icons"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { type CategoryType, CategoryTypeEnum } from "~/types/categories"
import { NewEnum } from "~/types/new"

interface AddCategoryContentProps {
  type: CategoryType
}

export function AddCategoryContent({
  type: initialType,
}: AddCategoryContentProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  // Switching type reloads the picker, so a selection does not carry over.
  const [type, setType] = useState<CategoryType>(initialType)

  const header = (
    <View style={styles.header}>
      <View style={styles.segmentRow}>
        {[CategoryTypeEnum.EXPENSE, CategoryTypeEnum.INCOME].map((option) => (
          <Pressable
            key={option}
            style={[
              styles.segment,
              option === type ? styles.segmentActive : styles.segmentInactive,
            ]}
            onPress={() => setType(option)}
            accessibilityRole="tab"
            accessibilityState={{ selected: option === type }}
          >
            <Text
              style={
                option === type ? styles.segmentTextActive : styles.segmentText
              }
            >
              {t(`components.categories.types.${option}`)}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.createRow}
        // replace, so Back from the form returns to the list, not to this page.
        onPress={() =>
          router.replace({
            pathname: "/settings/categories/[categoryId]/modify",
            params: { categoryId: NewEnum.NEW, initialType: type },
          })
        }
      >
        <View style={styles.createIcon}>
          <IconSvg
            name="plus-outline"
            size={22}
            color={theme.colors.onPrimary}
          />
        </View>
        <Text style={styles.createLabel}>
          {t("components.categories.sheet.createOwn")}
        </Text>
        <ChevronIcon
          direction="trailing"
          size={20}
          color={theme.colors.onSecondary}
        />
      </Pressable>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>
          {t("components.categories.sheet.orPick")}
        </Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  )

  // The header sits outside the picker: the picker shows a loader while the
  // other type's categories load, and the type switch must not vanish with it.
  return (
    <View style={styles.screen}>
      {header}
      <CategoryPresetsPicker
        key={type}
        type={type}
        preselectCore={false}
        requireSelection
        buttonLabel={(count) =>
          t("components.categories.presets.addSelected", { count })
        }
        onDone={() => router.back()}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  segmentRow: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: theme.radius,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentInactive: {
    backgroundColor: "transparent",
  },
  segmentText: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  segmentTextActive: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  createIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  createLabel: {
    flex: 1,
    ...theme.typography.titleSmall,
    color: theme.colors.onSecondary,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.semantic.semi,
  },
  dividerText: {
    ...theme.typography.labelMedium,
    color: theme.colors.semantic.semi,
  },
}))
