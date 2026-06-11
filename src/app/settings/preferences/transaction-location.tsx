import * as Location from "expo-location"
import { useTranslation } from "react-i18next"
import { Linking, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { InfoBanner } from "~/components/ui/info-banner"
import { PermissionBanner } from "~/components/ui/permission-banner"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PermissionBanner
        message={t(
          "screens.settings.preferences.transactionLocation.permissionWarning",
        )}
        onPress={handleRequestPermission}
        showBanner={showBanner}
      />

      <Pressable
        style={styles.settingRow}
        onPress={() => setIsEnabled(!isEnabled)}
      >
        <View style={styles.labelContainer}>
          <Text variant="p" style={styles.settingLabel}>
            {t("screens.settings.preferences.transactionLocation.enable.label")}
          </Text>
          <Text variant="small" style={styles.settingLabelDescription}>
            {t(
              "screens.settings.preferences.transactionLocation.enable.description",
            )}
          </Text>
        </View>
        <Switch value={isEnabled} onValueChange={setIsEnabled} />
      </Pressable>

      {isEnabled && (
        <Pressable
          style={styles.settingRow}
          onPress={() => setAutoAttach(!autoAttach)}
        >
          <View style={styles.labelContainer}>
            <Text variant="p" style={styles.settingLabel}>
              {t(
                "screens.settings.preferences.transactionLocation.autoAttach.label",
              )}
            </Text>
            <Text variant="small" style={styles.settingLabelDescription}>
              {t(
                "screens.settings.preferences.transactionLocation.autoAttach.description",
              )}
            </Text>
          </View>
          <Switch value={autoAttach} onValueChange={setAutoAttach} />
        </Pressable>
      )}

      <InfoBanner
        text={t(
          "screens.settings.preferences.transactionLocation.footerCaption",
        )}
      />
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
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
  },
  settingLabelDescription: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "400",
    color: theme.colors.customColors.semi,
  },
}))
