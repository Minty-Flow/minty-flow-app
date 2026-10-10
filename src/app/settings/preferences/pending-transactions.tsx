import * as Notifications from "expo-notifications"
import { useTranslation } from "react-i18next"
import { Linking, Platform, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import {
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { ChoiceChips } from "~/components/ui/chips"
import { InfoBanner } from "~/components/ui/info-banner"
import { PermissionBanner } from "~/components/ui/permission-banner"
import { useNotificationPermissionStatus } from "~/hooks/use-permission-status"
import type { TranslationKey } from "~/i18n/config"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"

const SHOW_ON_HOME_DAYS = [1, 2, 3, 5, 7, 14, 30] as const

const EARLY_REMINDER_OPTIONS = [
  { seconds: 1800, key: "30min" },
  { seconds: 3600, key: "1h" },
  { seconds: 10800, key: "3h" },
  { seconds: 86400, key: "1day" },
  { seconds: 172800, key: "2days" },
] as const

function PermissionWarnings() {
  const { permissionStatus, refreshPermissionStatus } =
    useNotificationPermissionStatus()
  const { t } = useTranslation()

  const handleRequestPermission = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
      })
    }
    const { status } = await Notifications.requestPermissionsAsync()
    await refreshPermissionStatus()
    if (status !== Notifications.PermissionStatus.GRANTED) {
      await Linking.openSettings()
    }
  }

  const showNotificationsRow =
    permissionStatus !== null &&
    permissionStatus !== Notifications.PermissionStatus.GRANTED

  return (
    <PermissionBanner
      message={t("screens.settings.reminders.a11y.permissionWarning")}
      onPress={handleRequestPermission}
      accessibilityLabel={t(
        "screens.settings.reminders.a11y.grantNotifications",
      )}
      showBanner={showNotificationsRow}
    />
  )
}

export default function PendingTransactionsPreferencesScreen() {
  const autoPaySubscriptions = usePendingTransactionsStore(
    (s) => s.autoPaySubscriptions,
  )
  const setAutoPaySubscriptions = usePendingTransactionsStore(
    (s) => s.setAutoPaySubscriptions,
  )
  const autoPayRepetitive = usePendingTransactionsStore(
    (s) => s.autoPayRepetitive,
  )
  const setAutoPayRepetitive = usePendingTransactionsStore(
    (s) => s.setAutoPayRepetitive,
  )
  const autoPayUpcoming = usePendingTransactionsStore((s) => s.autoPayUpcoming)
  const setAutoPayUpcoming = usePendingTransactionsStore(
    (s) => s.setAutoPayUpcoming,
  )
  const homeTimeframe = usePendingTransactionsStore((s) => s.homeTimeframe)
  const setHomeTimeframe = usePendingTransactionsStore(
    (s) => s.setHomeTimeframe,
  )
  const notify = usePendingTransactionsStore((s) => s.notify)
  const setNotify = usePendingTransactionsStore((s) => s.setNotify)
  const earlyReminderInSeconds = usePendingTransactionsStore(
    (s) => s.earlyReminderInSeconds,
  )
  const setEarlyReminderInSeconds = usePendingTransactionsStore(
    (s) => s.setEarlyReminderInSeconds,
  )

  const { permissionStatus, refreshPermissionStatus } =
    useNotificationPermissionStatus()

  const { t } = useTranslation()

  const choicesMapping = SHOW_ON_HOME_DAYS.map((d) => ({
    value: d,
    label: t("screens.home.upcoming.chips.daysCount", {
      count: d,
    }),
  }))
  const choiceLabels = choicesMapping.map((c) => c.label)
  const selectedLabel =
    choicesMapping.find((c) => c.value === homeTimeframe)?.label ||
    choicesMapping[0].label
  const handleShowOnHomeSelect = (label: string) => {
    const selected = choicesMapping.find((c) => c.label === label)
    if (selected) {
      setHomeTimeframe(selected.value)
    }
  }

  const handleNotifyToggle = async () => {
    const next = !notify
    setNotify(next)
    if (next && permissionStatus !== Notifications.PermissionStatus.GRANTED) {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
        })
      }
      const { status } = await Notifications.requestPermissionsAsync()
      await refreshPermissionStatus()
      if (status !== Notifications.PermissionStatus.GRANTED) {
        await Linking.openSettings()
      }
    }
  }

  const earlyReminderChoicesMapping = EARLY_REMINDER_OPTIONS.map((o) => ({
    seconds: o.seconds,
    label: t(
      `screens.settings.pending.settings.earlyReminder.${o.key}` as TranslationKey,
    ),
  }))
  const earlyChoiceLabels = earlyReminderChoicesMapping.map((c) => c.label)
  const selectedEarlyLabel =
    earlyReminderChoicesMapping.find(
      (c) => c.seconds === earlyReminderInSeconds,
    )?.label || earlyReminderChoicesMapping[3].label
  const handleEarlyReminderSelect = (label: string) => {
    const selected = earlyReminderChoicesMapping.find((c) => c.label === label)
    if (selected) setEarlyReminderInSeconds(selected.seconds)
  }

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      <InfoBanner text={t("screens.settings.pending.caption")} />

      <ChoiceChips
        title={t("screens.settings.pending.settings.showOnHome")}
        choices={choiceLabels}
        selectedValue={selectedLabel}
        onSelect={handleShowOnHomeSelect}
        style={styles.choiceSection}
      />

      <SettingsSwitchRow
        label={t(
          "screens.settings.pending.settings.autoPaySubscriptions.label",
        )}
        description={t(
          "screens.settings.pending.settings.autoPaySubscriptions.description",
        )}
        value={autoPaySubscriptions}
        onValueChange={setAutoPaySubscriptions}
      />

      <SettingsSwitchRow
        label={t("screens.settings.pending.settings.autoPayRepetitive.label")}
        description={t(
          "screens.settings.pending.settings.autoPayRepetitive.description",
        )}
        value={autoPayRepetitive}
        onValueChange={setAutoPayRepetitive}
      />

      <SettingsSwitchRow
        label={t("screens.settings.pending.settings.autoPayUpcoming.label")}
        description={t(
          "screens.settings.pending.settings.autoPayUpcoming.description",
        )}
        value={autoPayUpcoming}
        onValueChange={setAutoPayUpcoming}
      />

      <SettingsSwitchRow
        label={t("screens.settings.pending.settings.notify.label")}
        description={t("screens.settings.pending.settings.notify.description")}
        value={notify}
        onValueChange={handleNotifyToggle}
      />

      {notify && (
        <>
          {permissionStatus !== Notifications.PermissionStatus.GRANTED && (
            <PermissionWarnings />
          )}
          <ChoiceChips
            title={t("screens.settings.pending.settings.earlyReminder.label")}
            choices={earlyChoiceLabels}
            selectedValue={selectedEarlyLabel}
            onSelect={handleEarlyReminderSelect}
            style={styles.choiceSection}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create(() => ({
  choiceSection: {
    padding: 20,
  },
}))
