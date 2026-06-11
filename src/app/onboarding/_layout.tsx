import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

export default function OnboardingLayout() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const headerStyles = {
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.primary,
    headerTitleStyle: {
      color: theme.colors.onSurface,
      fontWeight: "600" as const,
    },
    headerShadowVisible: false,
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="start"
        options={{ ...headerStyles, title: t("onboarding.start.title") }}
      />
      <Stack.Screen
        name="accounts"
        options={{ ...headerStyles, title: t("onboarding.accounts.title") }}
      />
      <Stack.Screen
        name="expense-categories"
        options={{
          ...headerStyles,
          title: t("onboarding.expenseCategories.title"),
        }}
      />
      <Stack.Screen
        name="income-categories"
        options={{
          ...headerStyles,
          title: t("onboarding.incomeCategories.title"),
        }}
      />
    </Stack>
  )
}
