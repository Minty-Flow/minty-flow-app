import * as LocalAuthentication from "expo-local-authentication"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import type { IconSvgName } from "~/components/icons"
import { IconSvg } from "~/components/icons"
import { InfoSheet } from "~/components/info-sheet"
import { settingsStyles } from "~/components/settings/settings-list"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import { useAppLockStore } from "~/stores/app-lock.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

interface PrivacySetting {
  id: string
  label: string
  icon: IconSvgName
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

export default function PrivacyScreen() {
  const hideOnStartup = useMoneyFormattingStore((s) => s.hideOnStartup)
  const setHideOnStartup = useMoneyFormattingStore((s) => s.setHideOnStartup)
  const maskOnShake = useMoneyFormattingStore((s) => s.maskOnShake)
  const setMaskOnShake = useMoneyFormattingStore((s) => s.setMaskOnShake)
  const [deviceLockInfoVisible, setDeviceLockInfoVisible] = useState(false)
  const lockAppEnabled = useAppLockStore((s) => s.lockAppEnabled)
  const setLockAppEnabled = useAppLockStore((s) => s.setLockAppEnabled)
  const lockAfterClosing = useAppLockStore((s) => s.lockAfterClosing)
  const setLockAfterClosing = useAppLockStore((s) => s.setLockAfterClosing)

  const handleLockAppChange = async (value: boolean) => {
    if (value) {
      // Allow when any device auth is enrolled: PIN, pattern, password, or biometric
      const level = await LocalAuthentication.getEnrolledLevelAsync()
      const hasDeviceAuth =
        level === LocalAuthentication.SecurityLevel.SECRET ||
        level === LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK ||
        level === LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG
      if (!hasDeviceAuth) {
        setDeviceLockInfoVisible(true)
        return
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("screens.settings.privacy.biometric.confirmEnable"),
      })
      if (result.success) {
        setLockAppEnabled(true)
      }
    } else {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("screens.settings.privacy.biometric.confirmDisable"),
      })
      if (result.success) {
        setLockAppEnabled(false)
        setLockAfterClosing(false)
      }
    }
  }

  const { t } = useTranslation()

  const settings: PrivacySetting[] = [
    {
      id: "maskNumber",
      label: t("screens.settings.privacy.settings.maskNumber"),
      icon: "asterisk-outline",
      value: hideOnStartup,
      onValueChange: setHideOnStartup,
    },
    {
      id: "maskNumberOnShake",
      label: t("screens.settings.privacy.settings.maskNumberOnShake"),
      icon: "activity-outline",
      value: maskOnShake,
      onValueChange: setMaskOnShake,
    },
    {
      id: "lockApp",
      label: t("screens.settings.privacy.settings.lockApp"),
      icon: "password-mobile-phone-outline",
      value: lockAppEnabled,
      onValueChange: handleLockAppChange,
    },
    {
      id: "lockAfterClosing",
      label: t("screens.settings.privacy.settings.lockAfterClosing"),
      icon: "lock-outline",
      value: lockAfterClosing,
      onValueChange: setLockAfterClosing,
      disabled: !lockAppEnabled,
    },
  ]

  return (
    <>
      <ScrollView
        style={settingsStyles.screen}
        contentContainerStyle={settingsStyles.content}
      >
        <View>
          {settings.map((setting) => (
            <ListItem
              key={setting.id}
              style={[
                styles.settingRow,
                setting.disabled && styles.settingRowDisabled,
              ]}
              onPress={() =>
                !setting.disabled && setting.onValueChange(!setting.value)
              }
              disabled={setting.disabled}
            >
              <View style={styles.iconContainer}>
                <IconSvg name={setting.icon} size={24} />
              </View>
              <View style={styles.labelContainer}>
                <Text variant="p" style={styles.settingLabel}>
                  {t(
                    `screens.settings.privacy.settings.${setting.id}` as TranslationKey,
                  )}
                </Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onValueChange}
                disabled={setting.disabled}
              />
            </ListItem>
          ))}
        </View>
      </ScrollView>

      <InfoSheet
        visible={deviceLockInfoVisible}
        onRequestClose={() => setDeviceLockInfoVisible(false)}
        icon="lock-outline"
        title={t("screens.settings.privacy.alert.deviceLockRequired.title")}
        description={t(
          "screens.settings.privacy.alert.deviceLockRequired.message",
        )}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  settingRow: {
    justifyContent: "space-between",
    gap: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
}))
