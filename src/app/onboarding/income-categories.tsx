import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { CategoryPresetsPicker } from "~/components/categories/category-presets-picker"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { CategoryTypeEnum } from "~/types/categories"

export default function OnboardingIncomeCategoriesScreen() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <CategoryPresetsPicker
      type={CategoryTypeEnum.INCOME}
      preselectCore
      requireSelection={false}
      buttonLabel={() => t("onboarding.actions.next")}
      onDone={() => router.push("/settings/edit-profile?fromOnboarding=true")}
      header={
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {t("onboarding.incomeCategories.subtitle")}
          </Text>
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
