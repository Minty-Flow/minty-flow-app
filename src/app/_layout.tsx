import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles"

import { AppLockGate } from "~/components/app-lock-gate"
import { ToastManager } from "~/components/ui/toast"
import { TooltipProvider } from "~/components/ui/tooltip"
import "react-native-reanimated"

import { setStyle } from "expo-navigation-bar"
import * as Notifications from "expo-notifications"
import { useEffect } from "react"
import { Platform } from "react-native"

import { useNotificationSync } from "~/hooks/use-notification-sync"
import { useRecurringTransactionSync } from "~/hooks/use-recurring-transaction-sync"
import { useRetentionCleanup } from "~/hooks/use-retention-cleanup"
import { DirectionEnum, useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { NewEnum } from "~/types/new"

export default function RootLayout() {
  const { theme } = useUnistyles()
  const { t } = useTranslation()

  UnistylesRuntime.setRootViewBackgroundColor(theme.colors.surface)

  if (Platform.OS === "android") {
    setStyle(theme.isDark ? "dark" : "light")
  }

  const isRTL = useLanguageStore((s) => s.isRTL)

  // Ports to reality: retention cleanup and recurring sync (effects live in domain hooks)
  // Rehydrate shake listener on app start if mask-on-shake was enabled (store-owned subscription)
  useEffect(() => {
    const { maskOnShake, _startShakeListener } =
      useMoneyFormattingStore.getState()
    if (maskOnShake) _startShakeListener()

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("transaction-reminders", {
        name: "Transaction Reminders",
        importance: Notifications.AndroidImportance.HIGH,
      }).catch(() => {})
    }
  }, [])

  useRetentionCleanup()
  useRecurringTransactionSync()
  useNotificationSync()

  return (
    <GestureHandlerRootView
      key={isRTL ? "rtl-root" : "ltr-root"}
      style={{
        flex: 1,
        direction: isRTL ? DirectionEnum.RTL : DirectionEnum.LTR,
      }}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <TooltipProvider>
            <Stack
              key={isRTL ? "rtl-stack" : "ltr-stack"}
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.primary,
                headerTitleStyle: {
                  color: theme.colors.onSurface,
                  fontWeight: "600",
                },
                headerShadowVisible: false,
                statusBarStyle: theme.isDark ? "light" : "dark",

                contentStyle: {
                  paddingBottom: UnistylesRuntime.insets.bottom, // Global horizontal gutter
                  backgroundColor: theme.colors.surface, // Ensure background matches
                },
                // animation: "fade",

                // if you decided to use this some screens wont have the edit pen in them so be careful
                // header: (props) =>   <ScreenSharedHeader props={props} />,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* settings screens */}
              <Stack.Screen
                name="settings/edit-profile"
                options={{ title: t("profile.edit.title") }}
              />
              <Stack.Screen
                name="settings/loans"
                options={{ title: t("screens.settings.loans.title") }}
              />
              <Stack.Screen
                name="settings/all-accounts"
                options={{ title: t("screens.accounts.title") }}
              />
              <Stack.Screen
                name="settings/categories/index"
                options={{ title: t("components.categories.title") }}
              />
              <Stack.Screen
                name="settings/categories/archived"
                options={{
                  title: t("components.categories.form.title.archived"),
                }}
              />

              <Stack.Screen
                name="settings/categories/[categoryId]/index"
                options={{
                  title: t("components.categories.form.title.edit"),
                }}
              />

              <Stack.Screen
                name="settings/categories/presets"
                options={{
                  title: t("components.categories.actions.addFromPresets"),
                }}
              />
              <Stack.Screen
                name="settings/categories/[categoryId]/modify"
                options={({ route }) => {
                  const params = route.params as
                    | { categoryId?: string }
                    | undefined
                  return {
                    title:
                      params?.categoryId === NewEnum.NEW
                        ? t("components.categories.form.title.create")
                        : t("components.categories.form.title.edit"),
                  }
                }}
              />
              <Stack.Screen
                name="settings/tags/index"
                options={{ title: t("screens.settings.tags.title") }}
              />
              <Stack.Screen
                name="settings/trash"
                options={{ title: t("screens.settings.trash.title") }}
              />
              <Stack.Screen
                name="settings/preferences/index"
                options={{ title: t("screens.settings.preferences.title") }}
              />
              <Stack.Screen
                name="settings/data-management"
                options={{
                  title: t("screens.settings.dataManagement.title"),
                }}
              />
              <Stack.Screen
                name="settings/budgets"
                options={{ title: t("screens.settings.budgets.title") }}
              />
              <Stack.Screen
                name="settings/pending-transactions"
                options={{ title: t("screens.settings.pending.title") }}
              />
              <Stack.Screen
                name="settings/bill-splitter"
                options={{ title: t("screens.settings.billSplitter.title") }}
              />
              <Stack.Screen
                name="settings/goals"
                options={{ title: t("screens.settings.goals.title") }}
              />

              {/* settings screens preferences */}
              <Stack.Screen
                name="settings/preferences/language"
                options={{
                  title: t("screens.settings.preferences.language.title"),
                }}
              />
              <Stack.Screen
                name="settings/preferences/theme"
                options={{
                  title: t(
                    "screens.settings.preferences.appearance.theme.title",
                  ),
                }}
              />
              <Stack.Screen
                name="settings/preferences/toast-style"
                options={{
                  title: t(
                    "screens.settings.preferences.appearance.toast.title",
                  ),
                }}
              />
              <Stack.Screen
                name="settings/preferences/exchange-rates"
                options={{ title: t("screens.settings.exchangeRates.title") }}
              />
              <Stack.Screen
                name="settings/preferences/trash-bin"
                options={{ title: t("screens.settings.trash.title") }}
              />
              <Stack.Screen
                name="settings/preferences/reminder"
                options={{ title: t("screens.settings.reminders.title") }}
              />
              <Stack.Screen
                name="settings/preferences/pending-transactions"
                options={{ title: t("screens.settings.pending.title") }}
              />
              <Stack.Screen
                name="settings/preferences/privacy"
                options={{ title: t("screens.settings.privacy.title") }}
              />
              <Stack.Screen
                name="settings/preferences/money-formatting"
                options={{
                  title: t(
                    "screens.settings.preferences.appearance.moneyFormatting.title",
                  ),
                }}
              />
              <Stack.Screen
                name="settings/preferences/transaction-location"
                options={{
                  title: t(
                    "screens.settings.preferences.transactionLocation.title",
                  ),
                }}
              />
              <Stack.Screen
                name="settings/preferences/button-placement"
                options={{
                  title: t(
                    "screens.settings.preferences.appearance.buttonPlacement.title",
                  ),
                }}
              />
              <Stack.Screen
                name="settings/preferences/transfers"
                options={{ title: t("screens.settings.transfers.title") }}
              />
              <Stack.Screen
                name="settings/preferences/transaction-appearance"
                options={{
                  title: t(
                    "screens.settings.preferences.appearance.transactionStyle.title",
                  ),
                }}
              />
              <Stack.Screen
                name="accounts/[accountId]/index"
                options={{
                  title: t("screens.accounts.detail.title"),
                }}
              />
              <Stack.Screen
                name="accounts/[accountId]/modify"
                options={({ route }) => {
                  const params = route.params as
                    | { accountId?: string }
                    | undefined
                  return {
                    title:
                      params?.accountId === NewEnum.NEW
                        ? t("screens.accounts.form.title.create")
                        : t("screens.accounts.form.title.edit"),
                  }
                }}
              />
              <Stack.Screen
                name="settings/tags/[tagId]"
                options={({ route }) => {
                  const params = route.params as { tagId?: string } | undefined
                  return {
                    title:
                      params?.tagId === NewEnum.NEW
                        ? t("screens.settings.tags.form.title.create")
                        : t("screens.settings.tags.form.title.edit"),
                  }
                }}
              />

              <Stack.Screen
                name="transaction/[id]"
                options={({ route }) => {
                  const params = route.params as { id?: string } | undefined
                  return {
                    title:
                      params?.id === NewEnum.NEW
                        ? t("components.transactionForm.title.create")
                        : t("components.transactionForm.title.edit"),
                    presentation: "fullScreenModal",
                  }
                }}
              />
            </Stack>

            <AppLockGate />
            <ToastManager />
          </TooltipProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
