import { type Href, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { CategoryPresetsPicker } from "~/components/categories/category-presets-picker"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { CategoryType } from "~/types/categories"

interface OnboardingCategoriesStepProps {
  type: CategoryType
  subtitle: string
  /** Onboarding step to open after this one. */
  next: Href
}

/** Onboarding step that pre-selects the essential categories of one type. */
export function OnboardingCategoriesStep({
  type,
  subtitle,
  next,
}: OnboardingCategoriesStepProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <CategoryPresetsPicker
      type={type}
      preselectCore
      requireSelection={false}
      buttonLabel={() => t("onboarding.actions.next")}
      onDone={() => router.push(next)}
      header={
        <View style={styles.header}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
}))
