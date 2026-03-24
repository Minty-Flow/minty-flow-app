import * as Notifications from "expo-notifications"
import { useTranslation } from "react-i18next"
import { Linking, Platform, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ChoiceChips } from "~/components/ui/chips"
import { InfoBanner } from "~/components/ui/info-banner"
import { PermissionBanner } from "~/components/ui/permission-banner"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useNotificationPermissionStatus } from "~/hooks/use-notification-permission-status"
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

function ToggleRow({
  title,
  description,
  value,
  onToggle,
}: {
  title: string
  description?: string
  value: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  return (
    <View style={styles.toggleSection}>
      <View style={styles.toggleHeader}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Pressable
          onPress={onToggle}
          style={[
            styles.togglePill,
            value ? styles.togglePillOn : styles.togglePillOff,
          ]}
          accessibilityLabel={
            value ? t("common.states.toggleOn") : t("common.states.toggleOff")
          }
          accessibilityRole="switch"
          accessibilityState={{ checked: value }}
        >
          <Text
            style={[styles.togglePillText, value && styles.togglePillTextOn]}
          >
            {value ? "On" : "Off"}
          </Text>
        </Pressable>
      </View>
      {description && (
        <Text style={styles.toggleDescription}>{description}</Text>
      )}
    </View>
  )
}

export default function PendingTransactionsPreferencesScreen() {
  const requireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const setRequireConfirmation = usePendingTransactionsStore(
    (s) => s.setRequireConfirmation,
  )
  const homeTimeframe = usePendingTransactionsStore((s) => s.homeTimeframe)
  const setHomeTimeframe = usePendingTransactionsStore(
    (s) => s.setHomeTimeframe,
  )
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )
  const setUpdateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.setUpdateDateUponConfirmation,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InfoBanner text={t("screens.settings.pending.caption")} />

      <ChoiceChips
        title={t("screens.settings.pending.settings.showOnHome")}
        choices={choiceLabels}
        selectedValue={selectedLabel}
        onSelect={handleShowOnHomeSelect}
        style={styles.choiceSection}
      />

      <ToggleRow
        title={t("screens.settings.pending.settings.requireConfirmation.label")}
        description={t(
          "screens.settings.pending.settings.requireConfirmation.description",
        )}
        value={requireConfirmation}
        onToggle={() => setRequireConfirmation(!requireConfirmation)}
      />

      {requireConfirmation && (
        <ToggleRow
          title={t(
            "screens.settings.pending.settings.updateDateOnConfirm.label",
          )}
          description={t(
            "screens.settings.pending.settings.updateDateOnConfirm.description",
          )}
          value={updateDateUponConfirmation}
          onToggle={() =>
            setUpdateDateUponConfirmation(!updateDateUponConfirmation)
          }
        />
      )}

      {requireConfirmation && <PermissionWarnings />}

      <ToggleRow
        title={t("screens.settings.pending.settings.notify.label")}
        description={t("screens.settings.pending.settings.notify.description")}
        value={notify}
        onToggle={handleNotifyToggle}
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: 40,
  },
  choiceSection: {
    padding: 20,
  },
  toggleSection: {
    padding: 20,
  },
  toggleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.onSurface,
    flex: 1,
  },
  togglePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius,
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  togglePillOff: {
    backgroundColor: theme.colors.secondary,
  },
  togglePillOn: {
    backgroundColor: theme.colors.primary,
  },
  togglePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  togglePillTextOn: {
    color: theme.colors.onPrimary,
  },
  toggleDescription: {
    fontSize: 14,
    color: theme.colors.customColors.semi,
    lineHeight: 20,
    marginTop: 6,
    paddingRight: 60,
  },
}))
