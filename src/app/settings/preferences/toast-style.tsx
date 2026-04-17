import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type ToastPosition,
  useToastStyleStore,
} from "~/stores/toast-style.store"
import { Toast } from "~/utils/toast"

export default function ToastStyleScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
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
  const [resetModalVisible, setResetModalVisible] = useState(false)
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

  const handleResetToDefaults = () => setResetModalVisible(true)
  const handleConfirmReset = () => resetToDefaults()

  return (
    <>
      <ConfirmModal
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
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
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Position */}
        <View native style={[styles.sectionLabel, styles.sectionLabelFirst]}>
          <Text variant="small" style={styles.sectionLabelText}>
            {t("screens.settings.preferences.appearance.toast.position.label")}
          </Text>
        </View>
        <View native style={styles.card}>
          {positionOptions.map((option, index) => {
            const isSelected = position === option.value
            const isLast = index === positionOptions.length - 1
            return (
              <View key={option.value} native>
                <Pressable
                  style={styles.row}
                  onPress={() => setPosition(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View native style={styles.rowContent}>
                    <Text style={styles.rowLabel}>{option.label}</Text>
                    <Text variant="small" style={styles.rowDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected ? (
                    <IconSvg
                      name="check"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
                {!isLast ? <View native style={styles.divider} /> : null}
              </View>
            )
          })}
        </View>

        {/* Options */}
        <View native style={styles.sectionLabel}>
          <Text variant="small" style={styles.sectionLabelText}>
            {t("screens.settings.preferences.appearance.toast.optionsLabel")}
          </Text>
        </View>
        <View native style={styles.toggleCard}>
          <Pressable
            style={styles.toggleRow}
            onPress={() => setShowProgressBar(!showProgressBar)}
          >
            <View native style={styles.toggleRowContent}>
              <Text style={styles.toggleLabel}>
                {t(
                  "screens.settings.preferences.appearance.toast.progressBar.label",
                )}
              </Text>
              <Text variant="small" style={styles.toggleDescription}>
                {t(
                  "screens.settings.preferences.appearance.toast.progressBar.description",
                )}
              </Text>
            </View>
            <Switch
              value={showProgressBar}
              onValueChange={setShowProgressBar}
            />
          </Pressable>
          <View native style={styles.divider} />
          <Pressable
            style={styles.toggleRow}
            onPress={() => setShowCloseIcon(!showCloseIcon)}
          >
            <View native style={styles.toggleRowContent}>
              <Text style={styles.toggleLabel}>
                {t(
                  "screens.settings.preferences.appearance.toast.closeIcon.label",
                )}
              </Text>
              <Text variant="small" style={styles.toggleDescription}>
                {t(
                  "screens.settings.preferences.appearance.toast.closeIcon.description",
                )}
              </Text>
            </View>
            <Switch value={showCloseIcon} onValueChange={setShowCloseIcon} />
          </Pressable>
        </View>

        {/* Preview */}
        <View native style={styles.sectionLabel}>
          <Text variant="small" style={styles.sectionLabelText}>
            {t("screens.settings.preferences.appearance.toast.preview.label")}
          </Text>
          <Text variant="small" style={styles.previewDescription}>
            {t(
              "screens.settings.preferences.appearance.toast.preview.description",
            )}
          </Text>
        </View>

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
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 48,
  },

  sectionLabel: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 28,
  },
  sectionLabelFirst: {
    marginTop: 8,
  },
  sectionLabelText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: theme.colors.customColors?.semi,
  },

  card: {
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  rowDescription: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors?.semi,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.customColors?.semi,
    opacity: 0.4,
  },

  toggleCard: {
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  toggleRowContent: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  toggleDescription: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors.semi,
  },

  previewDescription: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.customColors?.semi,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
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
