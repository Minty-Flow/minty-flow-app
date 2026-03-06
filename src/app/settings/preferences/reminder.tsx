import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import * as Notifications from "expo-notifications"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Linking, Platform, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { InfoBanner } from "~/components/ui/info-banner"
import { PermissionBanner } from "~/components/ui/permission-banner"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useNotificationPermissionStatus } from "~/hooks/use-notification-permission-status"
import { useNotificationStore } from "~/stores/notification.store"
import { formatReadableTime } from "~/utils/time-utils"

const DAILY_REMINDER_ID = "daily-check-in-reminder"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function ReminderScreen() {
  const { permissionStatus, refreshPermissionStatus } =
    useNotificationPermissionStatus()

  const {
    isDailyReminderEnabled,
    dailyReminderTime,
    setDailyReminderEnabled,
    setDailyReminderTime,
  } = useNotificationStore()

  const { t } = useTranslation()

  const dailyReminderDate = (() => {
    const [hours, minutes] = dailyReminderTime.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  })()

  const [showIosPicker, setShowIosPicker] = useState(false)

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

  const scheduleDailyReminder = async (time: Date) => {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID)

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: t("screens.settings.reminders.notification.title"),
        body: t("screens.settings.reminders.notification.body"),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
    })
  }

  const handleToggleDailyReminder = async (value: boolean) => {
    setDailyReminderEnabled(value)
    if (value) {
      if (permissionStatus !== Notifications.PermissionStatus.GRANTED) {
        await handleRequestPermission()
      }
      await scheduleDailyReminder(dailyReminderDate)
    } else {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID)
    }
  }

  const handleTimeChange = async (newTime: Date) => {
    const timeStr = `${newTime.getHours().toString().padStart(2, "0")}:${newTime.getMinutes().toString().padStart(2, "0")}`
    setDailyReminderTime(timeStr)
    if (isDailyReminderEnabled) {
      await scheduleDailyReminder(newTime)
    }
  }

  const onIosTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      handleTimeChange(date)
    }
    setShowIosPicker(false)
  }

  const showTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dailyReminderDate,
        onChange: (event, date) => {
          if (event.type === "set" && date) {
            handleTimeChange(date)
          }
        },
        mode: "time",
        is24Hour: false,
      })
    } else {
      setShowIosPicker(true)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {permissionStatus !== null &&
        permissionStatus !== Notifications.PermissionStatus.GRANTED && (
          <PermissionBanner
            message={t("screens.settings.reminders.a11y.permissionWarning")}
            onPress={handleRequestPermission}
          />
        )}

      {/* Remind daily */}
      <Pressable
        style={styles.settingRow}
        onPress={() => handleToggleDailyReminder(!isDailyReminderEnabled)}
      >
        <View style={styles.labelContainer}>
          <Text variant="p" style={styles.settingLabel}>
            {t("screens.settings.reminders.remindDaily.label")}
          </Text>
          <Text variant="small" style={styles.settingLabelDescription}>
            {t("screens.settings.reminders.remindDaily.description")}
          </Text>
        </View>
        <Switch
          value={isDailyReminderEnabled === true}
          onValueChange={handleToggleDailyReminder}
        />
      </Pressable>

      {isDailyReminderEnabled && (
        <>
          <View style={styles.section}>
            <Text style={styles.headerLabel}>
              {t("screens.settings.reminders.remindAt")}
            </Text>

            {/* The Main Time Card */}
            <Pressable style={styles.timeCard} onPress={showTimePicker}>
              <Text style={styles.timeText}>
                {formatReadableTime(dailyReminderDate)}
              </Text>
            </Pressable>

            {/* iOS Native Picker Modal */}
            {Platform.OS === "ios" && showIosPicker && (
              <DateTimePicker
                value={dailyReminderDate}
                mode="time"
                display="spinner"
                onChange={onIosTimeChange}
              />
            )}

            {/* For Testing  */}
            {/* <Button
              variant="default"
              onPress={async () => await schedulePushNotification()}
              style={[styles.actionButton, { marginTop: 100 }]}
            >
              <Text variant="default">
                {t("screens.settings.reminders.testNotification")}
              </Text>
            </Button> */}
          </View>

          <InfoBanner text={t("screens.settings.reminders.footerCaption")} />
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
  section: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  labelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingLabelDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: theme.colors.customColors.semi,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  timeCard: {
    backgroundColor: theme.colors.boxShadow,
    borderRadius: theme.colors.radius,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "500",
    height: 64,
    textAlignVertical: "center",
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
}))
