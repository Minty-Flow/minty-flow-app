import "react-native-reanimated"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { NavigationBar } from "expo-navigation-bar"
import * as Notifications from "expo-notifications"
import { Stack, useRouter, useSegments } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles"

import { AppLockGate } from "~/components/app-lock-gate"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { ToastManager } from "~/components/ui/toast"
import { TooltipProvider } from "~/components/ui/tooltip"
import { View } from "~/components/ui/view"
import { drizzleDb, expoDb } from "~/database/drizzle/db"
import {
  exportLegacyDbForForcedMigration,
  getDatabaseState,
  upgradeLegacyDbToDrizzle,
} from "~/database/forced-migration"
import { useImportRecovery } from "~/hooks/use-import-recovery"
import { useNotificationSync } from "~/hooks/use-notification-sync"
import { useRecurringTransactionSync } from "~/hooks/use-recurring-transaction-sync"
import { useRetentionCleanup } from "~/hooks/use-retention-cleanup"
import { useShakeListener } from "~/hooks/use-shake-listener"
import { DirectionEnum } from "~/i18n/language.constants"
import { useDbMigrationStore } from "~/stores/db-migration.store"
import { useLanguageStore } from "~/stores/language.store"
import { useOnboardingStore } from "~/stores/onboarding.store"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"

import migrations from "../../drizzle/migrations"

// TODO: code of conduct to be added alongside contributions rules

export default function RootLayout() {
  return <ForcedMigrationGate />
}

function ForcedMigrationGate() {
  const phase = useDbMigrationStore((s) => s.phase)
  const backupUri = useDbMigrationStore((s) => s.backupUri)
  const error = useDbMigrationStore((s) => s.error)
  const setPhase = useDbMigrationStore((s) => s.setPhase)
  const markExported = useDbMigrationStore((s) => s.markExported)
  const markComplete = useDbMigrationStore((s) => s.markComplete)
  const markFailed = useDbMigrationStore((s) => s.markFailed)
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const upgradeNoticeShownRef = useRef(false)

  // TODO(remove-after-drizzle-rollout): old SQLite -> Drizzle compatibility gate.
  // Once every supported install has this marker, delete this wrapper and render AppRootLayout directly.

  const showUpgradeNotice = useCallback(() => {
    if (upgradeNoticeShownRef.current) return
    upgradeNoticeShownRef.current = true
    Alert.alert(
      "Data upgrade complete",
      "Minty Flow switched to the new local data layer. Your existing data stayed in place and an internal backup was created first.",
      [{ text: "OK" }],
    )
  }, [])

  const runInPlaceUpgrade = useCallback(
    async (createBackup: boolean): Promise<boolean> => {
      setBusy(true)
      try {
        if (createBackup) {
          setPhase("exporting")
          const backup = await exportLegacyDbForForcedMigration()
          markExported(backup)
        }
        setPhase("migrating")
        upgradeLegacyDbToDrizzle(migrations)
        markComplete()
        showUpgradeNotice()
        return true
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        logger.error("Forced DB migration in-place upgrade failed", {
          error: message,
        })
        markFailed(message)
        return false
      } finally {
        setBusy(false)
      }
    },
    [markComplete, markExported, markFailed, setPhase, showUpgradeNotice],
  )

  const resumeInPlaceUpgrade = useCallback(async () => {
    setBusy(true)
    try {
      const state = getDatabaseState(migrations)
      if (state === "legacy") {
        const createBackup = phase === "exporting" && !backupUri
        if (createBackup) {
          setPhase("exporting")
          const backup = await exportLegacyDbForForcedMigration()
          markExported(backup)
        }
        setPhase("migrating")
        upgradeLegacyDbToDrizzle(migrations)
      }
      markComplete()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logger.error("Forced DB migration in-place upgrade failed", {
        error: message,
      })
      markFailed(message)
    } finally {
      setBusy(false)
    }
  }, [backupUri, markComplete, markExported, markFailed, phase, setPhase])

  useEffect(() => {
    if (phase === "failed") {
      setChecked(true)
      return
    }
    try {
      const state = getDatabaseState(migrations)
      if (state === "legacy") {
        void runInPlaceUpgrade(true).finally(() => setChecked(true))
        return
      }
      if (phase !== "complete") markComplete()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logger.error("Forced DB migration detection failed", { error: message })
      markFailed(message)
    } finally {
      setChecked(true)
    }
  }, [markComplete, markFailed, phase, runInPlaceUpgrade])

  useEffect(() => {
    if (!checked || busy) return
    if (
      phase === "exporting" ||
      phase === "exported" ||
      phase === "migrating"
    ) {
      void resumeInPlaceUpgrade()
    }
  }, [busy, checked, phase, resumeInPlaceUpgrade])

  if (!checked) return <MigrationState message="Checking database..." />

  if (phase === "idle" || phase === "complete") return <DrizzleMigratedApp />

  if (
    phase === "needs_backup" ||
    phase === "exporting" ||
    phase === "exported" ||
    phase === "migrating"
  ) {
    return (
      <MigrationState
        message={
          phase === "exporting"
            ? "Backing up your data..."
            : "Switching database layer..."
        }
      />
    )
  }

  if (phase === "failed") {
    return (
      <ForcedMigrationState
        message="Database upgrade paused."
        detail={error ?? "Unknown error"}
        actionLabel="Try again"
        onAction={() => {
          void runInPlaceUpgrade(true)
        }}
      />
    )
  }

  return (
    <ForcedMigrationState
      message={
        phase === "needs_backup"
          ? "Waiting to start database upgrade..."
          : "Backing up your data..."
      }
      detail="Keep Minty Flow open until this finishes."
    />
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

function MigrationState({ message }: { message: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicatorMinty />
      <Text>{message}</Text>
    </View>
  )
}

function ForcedMigrationState({
  message,
  detail,
  actionLabel,
  onAction,
}: {
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
      }}
    >
      {!onAction && <ActivityIndicatorMinty />}
      <Text>{message}</Text>
      {detail && <Text variant="small">{detail}</Text>}
      {actionLabel && (
        <Button disabled={!onAction} onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      )}
    </View>
  )
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

  useShakeListener()
  useRetentionCleanup()
  useRecurringTransactionSync()
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
                options={({ route }) => {
                  const params = route.params as { loanId?: string } | undefined
                  return {
                    title:
                      params?.loanId === NewEnum.NEW
                        ? t("screens.settings.loans.addNew")
                        : t("screens.settings.loans.title"),
                  }
                }}
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
                options={({ route }) => {
                  const params = route.params as
                    | { budgetId?: string }
                    | undefined
                  return {
                    title:
                      params?.budgetId === NewEnum.NEW
                        ? t("screens.settings.budgets.form.title.create")
                        : t("screens.settings.budgets.form.title.edit"),
                  }
                }}
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
                options={({ route }) => {
                  const params = route.params as { goalId?: string } | undefined
                  return {
                    title:
                      params?.goalId === NewEnum.NEW
                        ? t("screens.settings.goals.form.title.create")
                        : t("screens.settings.goals.form.title.edit"),
                  }
                }}
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
                name="settings/preferences/week-start"
                options={{
                  title: t("screens.settings.preferences.weekStart.label"),
                }}
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
                    presentation: "fullScreenModal",
                    title:
                      params?.id === NewEnum.NEW
                        ? t("components.transactionForm.title.create")
                        : t("components.transactionForm.title.edit"),
                  }
                }}
              />
            </Stack>

            <AppLockGate />
            <ToastManager />

            <NavigationBar style="auto" />
          </TooltipProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
