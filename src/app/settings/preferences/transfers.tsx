import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import {
  SettingsOptionRow,
  SettingsSection,
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { InfoBanner } from "~/components/ui/info-banner"
import { View } from "~/components/ui/view"
import {
  TransferLayoutEnum,
  type TransferLayoutType,
  useTransfersPreferencesStore,
} from "~/stores/transfers-preferences.store"

const layoutOptions: TransferLayoutType[] = [
  TransferLayoutEnum.COMBINE,
  TransferLayoutEnum.SEPARATE,
]

function LayoutPreview({ variant }: { variant: TransferLayoutType }) {
  const { theme } = useUnistyles()
  const successColor = theme.colors.semantic?.success ?? theme.colors.primary
  return (
    <View native style={styles.previewRow}>
      <IconSvg
        name="arrows-right-left-outline"
        size={18}
        color={theme.colors.semantic?.semi}
      />
      <View native style={styles.slidersPreview}>
        {variant === TransferLayoutEnum.COMBINE ? (
          <View
            native
            style={[styles.sliderBar, { backgroundColor: successColor }]}
          />
        ) : (
          <>
            <View
              native
              style={[styles.sliderBar, { backgroundColor: successColor }]}
            />
            <View
              native
              style={[
                styles.sliderBar,
                { backgroundColor: theme.colors.error },
              ]}
            />
          </>
        )}
      </View>
    </View>
  )
}

export default function TransfersPreferencesScreen() {
  const { t } = useTranslation()
  const layout = useTransfersPreferencesStore((s) => s.layout)
  const setLayout = useTransfersPreferencesStore((s) => s.setLayout)
  const excludeFromTotals = useTransfersPreferencesStore(
    (s) => s.excludeFromTotals,
  )
  const setExcludeFromTotals = useTransfersPreferencesStore(
    (s) => s.setExcludeFromTotals,
  )

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <SettingsSection title={t("screens.settings.transfers.layout.subtitle")}>
        {layoutOptions.map((value) => {
          const key =
            value === TransferLayoutEnum.COMBINE ? "combine" : "separate"
          return (
            <SettingsOptionRow
              key={value}
              label={t(
                `screens.settings.transfers.layout.options.${key}.label`,
              )}
              description={t(
                `screens.settings.transfers.layout.options.${key}.description`,
              )}
              selected={layout === value}
              onPress={() => setLayout(value)}
            >
              <LayoutPreview variant={value} />
            </SettingsOptionRow>
          )
        })}
      </SettingsSection>
      <InfoBanner text={t("screens.settings.transfers.layout.caption")} />

      <SettingsSection title={t("screens.settings.transfers.totals.subtitle")}>
        <SettingsSwitchRow
          label={t("screens.settings.transfers.totals.excludeToggle.label")}
          description={t(
            "screens.settings.transfers.totals.excludeToggle.description",
          )}
          value={excludeFromTotals}
          onValueChange={setExcludeFromTotals}
        />
      </SettingsSection>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  slidersPreview: {
    gap: 6,
  },
  sliderBar: {
    height: 6,
    borderRadius: 3,
    width: 200,
    backgroundColor: theme.colors.semantic?.semi,
  },
}))
