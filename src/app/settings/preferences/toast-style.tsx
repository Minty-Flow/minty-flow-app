import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import {
  SettingsOptionRow,
  SettingsSection,
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type ToastPosition,
  useToastStyleStore,
} from "~/stores/toast-style.store"
import { Toast } from "~/utils/toast"

export default function ToastStyleScreen() {
  const { t } = useTranslation()
  const positionOptions: Array<{
    value: ToastPosition
    label: string
    description: string
  }> = [
    {
      value: "top",
      label: t("screens.settings.preferences.appearance.toast.position.top"),
      description: t(
        "screens.settings.preferences.appearance.toast.position.topDescription",
      ),
    },
    {
      value: "bottom",
      label: t("screens.settings.preferences.appearance.toast.position.bottom"),
      description: t(
        "screens.settings.preferences.appearance.toast.position.bottomDescription",
      ),
    },
  ]
  const [resetSheetVisible, setResetSheetVisible] = useState(false)
  const {
    position,
    showProgressBar,
    showCloseIcon,
    setPosition,
    setShowProgressBar,
    setShowCloseIcon,
    resetToDefaults,
  } = useToastStyleStore()

  const handleShowDemoToasts = () => {
    Toast.success({
      title: t("common.toast.success"),
      description: t(
        "screens.settings.preferences.appearance.toast.demo.successDescription",
      ),
    })
    setTimeout(
      () =>
        Toast.error({
          title: t("common.toast.error"),
          description: t(
            "screens.settings.preferences.appearance.toast.demo.errorDescription",
          ),
        }),
      500,
    )
    setTimeout(
      () =>
        Toast.info({
          title: t("common.toast.info"),
          description: t(
            "screens.settings.preferences.appearance.toast.demo.infoDescription",
          ),
        }),
      1000,
    )
    setTimeout(
      () =>
        Toast.warn({
          title: t("common.toast.warning"),
          description: t(
            "screens.settings.preferences.appearance.toast.demo.warningDescription",
          ),
        }),
      1500,
    )
  }

  const handleResetToDefaults = () => setResetSheetVisible(true)
  const handleConfirmReset = () => resetToDefaults()

  return (
    <>
      <ConfirmSheet
        visible={resetSheetVisible}
        onRequestClose={() => setResetSheetVisible(false)}
        onConfirm={handleConfirmReset}
        title={t("screens.settings.preferences.appearance.toast.reset.title")}
        description={t(
          "screens.settings.preferences.appearance.toast.reset.description",
        )}
        confirmLabel={t(
          "screens.settings.preferences.appearance.toast.reset.confirmLabel",
        )}
        cancelLabel={t(
          "screens.settings.preferences.appearance.toast.reset.cancelLabel",
        )}
        variant="destructive"
      />

      <ScrollView
        style={settingsStyles.screen}
        contentContainerStyle={settingsStyles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection
          title={t(
            "screens.settings.preferences.appearance.toast.position.label",
          )}
        >
          {positionOptions.map((option) => (
            <SettingsOptionRow
              key={option.value}
              label={option.label}
              description={option.description}
              selected={position === option.value}
              onPress={() => setPosition(option.value)}
            />
          ))}
        </SettingsSection>

        <SettingsSection
          title={t(
            "screens.settings.preferences.appearance.toast.optionsLabel",
          )}
        >
          <SettingsSwitchRow
            label={t(
              "screens.settings.preferences.appearance.toast.progressBar.label",
            )}
            description={t(
              "screens.settings.preferences.appearance.toast.progressBar.description",
            )}
            value={showProgressBar}
            onValueChange={setShowProgressBar}
          />
          <SettingsSwitchRow
            label={t(
              "screens.settings.preferences.appearance.toast.closeIcon.label",
            )}
            description={t(
              "screens.settings.preferences.appearance.toast.closeIcon.description",
            )}
            value={showCloseIcon}
            onValueChange={setShowCloseIcon}
          />
        </SettingsSection>

        <SettingsSection
          title={t(
            "screens.settings.preferences.appearance.toast.preview.label",
          )}
          description={t(
            "screens.settings.preferences.appearance.toast.preview.description",
          )}
        >
          <View native style={styles.previewButtons}>
            <Button
              variant="default"
              style={styles.previewBtnPrimary}
              onPress={handleShowDemoToasts}
            >
              <Text style={styles.previewBtnPrimaryText}>
                {t(
                  "screens.settings.preferences.appearance.toast.preview.showDemo",
                )}
              </Text>
            </Button>
            <Button
              variant="outline"
              style={styles.previewBtnOutline}
              onPress={() => Toast.hideAll()}
            >
              <Text style={styles.previewBtnOutlineText}>
                {t(
                  "screens.settings.preferences.appearance.toast.preview.hideAll",
                )}
              </Text>
            </Button>
          </View>
        </SettingsSection>

        {/* Reset */}
        <View native style={styles.resetSection}>
          <Button
            variant="destructive"
            style={styles.resetButton}
            onPress={handleResetToDefaults}
          >
            <Text style={styles.resetButtonText}>
              {t("screens.settings.preferences.appearance.toast.resetButton")}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  previewButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  previewBtnPrimary: {
    flex: 1,
  },
  previewBtnPrimaryText: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
  },
  previewBtnOutline: {
    flex: 1,
  },
  previewBtnOutlineText: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
  },

  resetSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  resetButton: {
    borderRadius: theme.radius,
    paddingVertical: 2,
  },
  resetButtonText: {
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: "600",
  },
}))
