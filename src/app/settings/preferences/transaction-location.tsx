import * as Location from "expo-location"
import { useTranslation } from "react-i18next"
import { Linking, ScrollView } from "react-native"

import {
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { InfoBanner } from "~/components/ui/info-banner"
import { PermissionBanner } from "~/components/ui/permission-banner"
import { useLocationPermissionStatus } from "~/hooks/use-location-permission-status"
import { useTransactionLocationStore } from "~/stores/transaction-location.store"

export default function TransactionLocationScreen() {
  const { permissionStatus, refreshPermissionStatus } =
    useLocationPermissionStatus()
  const { isEnabled, autoAttach, setIsEnabled, setAutoAttach } =
    useTransactionLocationStore()
  const { t } = useTranslation()

  const isGranted = permissionStatus === Location.PermissionStatus.GRANTED
  const showBanner = permissionStatus !== null && !isGranted

  const handleRequestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    await refreshPermissionStatus()
    if (status !== Location.PermissionStatus.GRANTED) {
      await Linking.openSettings()
    }
  }

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      <PermissionBanner
        message={t(
          "screens.settings.preferences.transactionLocation.permissionWarning",
        )}
        onPress={handleRequestPermission}
        showBanner={showBanner}
      />

      <SettingsSwitchRow
        label={t(
          "screens.settings.preferences.transactionLocation.enable.label",
        )}
        description={t(
          "screens.settings.preferences.transactionLocation.enable.description",
        )}
        value={isEnabled}
        onValueChange={setIsEnabled}
      />

      {isEnabled && (
        <SettingsSwitchRow
          label={t(
            "screens.settings.preferences.transactionLocation.autoAttach.label",
          )}
          description={t(
            "screens.settings.preferences.transactionLocation.autoAttach.description",
          )}
          value={autoAttach}
          onValueChange={setAutoAttach}
        />
      )}

      <InfoBanner
        text={t(
          "screens.settings.preferences.transactionLocation.footerCaption",
        )}
      />
    </ScrollView>
  )
}
