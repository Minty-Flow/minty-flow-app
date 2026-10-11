import "react-native-reanimated"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { NavigationBar } from "expo-navigation-bar"
import * as Notifications from "expo-notifications"
import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles"

import { AppLockGate } from "~/components/app-lock-gate"
import {
  ForcedMigrationGate,
  MigrationState,
} from "~/components/forced-migration-gate"
import { RouteErrorBoundary } from "~/components/route-error-boundary"
import { ToastManager } from "~/components/ui/toast"
import { TooltipProvider } from "~/components/ui/tooltip"
import { drizzleDb, expoDb } from "~/database/drizzle/db"
import { useImportRecovery } from "~/hooks/use-import-recovery"
import { useNotificationSync } from "~/hooks/use-notification-sync"
import { useRetentionCleanup } from "~/hooks/use-retention-cleanup"
import { useShakeListener } from "~/hooks/use-shake-listener"
import { useTransactionLifecycleSync } from "~/hooks/use-transaction-lifecycle-sync"
import { DirectionEnum } from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { useOnboardingStore } from "~/stores/onboarding.store"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"

import migrations from "../../drizzle/migrations"

// TODO: code of conduct to be added alongside contributions rules

export default function RootLayout() {
  return (
    <ForcedMigrationGate>
      <DrizzleMigratedApp />
    </ForcedMigrationGate>
  )
}

function DrizzleMigratedApp() {
  const migration = useMigrations(drizzleDb, migrations)
  useDrizzleStudio(__DEV__ && Platform.OS !== "web" ? expoDb : null)

  useEffect(() => {
    if (migration.error) {
      logger.error("Database migration failed", {
        error: migration.error.message,
      })
    }
  }, [migration.error])

  if (migration.error) {
    return (
      <MigrationState message="Database migration failed. Restart the app or recover from backup." />
    )
  }

  if (!migration.success) {
    return <MigrationState message="Preparing database..." />
  }

  return <AppRootLayout />
}

function AppRootLayout() {
  const { theme } = useUnistyles()
  const { t } = useTranslation()

  const isRTL = useLanguageStore((s) => s.isRTL)
  const isOnboardingCompleted = useOnboardingStore((s) => s.isCompleted)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (!isOnboardingCompleted && segments[0] !== "onboarding") {
      router.replace("/onboarding")
    }
  }, [isOnboardingCompleted, segments, router])

  // Ports to reality: retention cleanup and recurring sync (effects live in domain hooks)
  // Rehydrate shake listener on app start if mask-on-shake was enabled (store-owned subscription)
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("transaction-reminders", {
        name: "Transaction Reminders",
        importance: Notifications.AndroidImportance.HIGH,
      }).catch(() => {})
    }
  }, [])

  /** Header title for a create / edit route: `newTitle` when the id param is "new". */
  const modifyTitle =
    (param: string, newTitle: string, editTitle: string) =>
    ({ route }: { route: { params?: object } }) => ({
      title:
        (route.params as Record<string, unknown> | undefined)?.[param] ===
        NewEnum.NEW
          ? newTitle
          : editTitle,
    })

  useShakeListener()
  useRetentionCleanup()
  useTransactionLifecycleSync()
  useNotificationSync()
  useImportRecovery()

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
            <RouteErrorBoundary>
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
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false }}
                />

                {/* stats detail screens */}
                <Stack.Screen
                  name="stats/cash-flow"
                  options={{ title: t("screens.stats.cashFlow.title") }}
                />
                <Stack.Screen
                  name="stats/categories"
                  options={{ title: t("screens.stats.categories.title") }}
                />
                <Stack.Screen
                  name="stats/insights"
                  options={{ title: t("screens.settings.insights.title") }}
                />
                <Stack.Screen
                  name="stats/wrapped"
                  options={{ title: t("screens.stats.wrapped.title") }}
                />
                <Stack.Screen
                  name="stats/net-worth"
                  options={{ title: t("screens.stats.netWorth.title") }}
                />
                <Stack.Screen
                  name="stats/calendar"
                  options={{ title: t("screens.stats.calendar.title") }}
                />

                {/* settings screens */}
                <Stack.Screen
                  name="settings/edit-profile"
                  options={{ title: t("profile.edit.title") }}
                />
                <Stack.Screen
                  name="settings/loans/index"
                  options={{ title: t("screens.settings.loans.title") }}
                />
                <Stack.Screen
                  name="settings/loans/[loanId]/index"
                  options={{ title: t("screens.settings.loans.detail.title") }}
                />
                <Stack.Screen
                  name="settings/loans/[loanId]/modify"
                  options={modifyTitle(
                    "loanId",
                    t("screens.settings.loans.addNew"),
                    t("screens.settings.loans.title"),
                  )}
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
                  options={modifyTitle(
                    "categoryId",
                    t("components.categories.form.title.create"),
                    t("components.categories.form.title.edit"),
                  )}
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
                  name="settings/data-management/index"
                  options={{
                    title: t("screens.settings.dataManagement.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/data-management/export-history"
                  options={{
                    title: t("screens.settings.dataManagement.history.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/budgets/index"
                  options={{ title: t("screens.settings.budgets.title") }}
                />
                <Stack.Screen
                  name="settings/budgets/[budgetId]/modify"
                  options={modifyTitle(
                    "budgetId",
                    t("screens.settings.budgets.form.title.create"),
                    t("screens.settings.budgets.form.title.edit"),
                  )}
                />
                <Stack.Screen
                  name="settings/pending-transactions"
                  options={{ title: t("screens.settings.pending.title") }}
                />
                <Stack.Screen
                  name="settings/bill-splitter/index"
                  options={{ title: t("screens.settings.billSplitter.title") }}
                />
                <Stack.Screen
                  name="settings/bill-splitter/names"
                  options={{
                    title: t("screens.settings.billSplitter.names.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/bill-splitter/add-item"
                  options={{
                    title: t("screens.settings.billSplitter.actions.addItem"),
                  }}
                />
                <Stack.Screen
                  name="settings/bill-splitter/summary"
                  options={{
                    title: t("screens.settings.billSplitter.summary.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/goals/index"
                  options={{ title: t("screens.settings.goals.title") }}
                />
                <Stack.Screen
                  name="settings/goals/[goalId]/index"
                  options={{
                    title: t("screens.settings.goals.detail.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/budgets/[budgetId]/index"
                  options={{
                    title: t("screens.settings.budgets.detail.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/goals/archived"
                  options={{
                    title: t("screens.settings.goals.archived.title"),
                  }}
                />
                <Stack.Screen
                  name="settings/goals/[goalId]/modify"
                  options={modifyTitle(
                    "goalId",
                    t("screens.settings.goals.form.title.create"),
                    t("screens.settings.goals.form.title.edit"),
                  )}
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
                  name="settings/preferences/sound"
                  options={{
                    title: t("screens.settings.preferences.sound.title"),
                  }}
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
                  name="settings/preferences/calendar-formatting"
                  options={{
                    title: t(
                      "screens.settings.preferences.calendarFormat.title",
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
                  options={modifyTitle(
                    "accountId",
                    t("screens.accounts.form.title.create"),
                    t("screens.accounts.form.title.edit"),
                  )}
                />
                <Stack.Screen
                  name="settings/tags/[tagId]"
                  options={modifyTitle(
                    "tagId",
                    t("screens.settings.tags.form.title.create"),
                    t("screens.settings.tags.form.title.edit"),
                  )}
                />

                <Stack.Screen
                  name="transaction/[id]"
                  options={({ route }) => {
                    const params = route.params as { id?: string } | undefined
                    return {
                      presentation: "fullScreenModal",
                      title:
                        params?.id === NewEnum.NEW
                          ? t("components.transactionForm.title.create")
                          : t("components.transactionForm.title.edit"),
                    }
                  }}
                />
              </Stack>
            </RouteErrorBoundary>

            <AppLockGate />
            <ToastManager />

            <NavigationBar style="auto" />
          </TooltipProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
