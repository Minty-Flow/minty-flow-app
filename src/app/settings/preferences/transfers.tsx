import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { InfoBanner } from "~/components/ui/info-banner"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  TransferLayoutEnum,
  type TransferLayoutType,
  useTransfersPreferencesStore,
} from "~/stores/transfers-preferences.store"

const layoutOptions: Array<{
  value: TransferLayoutType
  label: string
  description: string
}> = [
  {
    value: TransferLayoutEnum.COMBINE,
    label: "Combine",
    description: "Single net amount",
  },
  {
    value: TransferLayoutEnum.SEPARATE,
    label: "Separate",
    description: "Outgoing and incoming shown separately",
  },
]

function LayoutPreview({ variant }: { variant: TransferLayoutType }) {
  const { theme } = useUnistyles()
  const successColor =
    theme.colors.customColors?.success ?? theme.colors.primary
  return (
    <View native style={styles.previewRow}>
      <IconSvg
        name="transfer"
        size={18}
        color={theme.colors.customColors?.semi}
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
  const { theme } = useUnistyles()
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
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Layout */}
      <View native style={[styles.sectionLabel, styles.sectionLabelFirst]}>
        <Text variant="small" style={styles.sectionLabelText}>
          {t("screens.settings.transfers.layout.subtitle")}
        </Text>
      </View>
      <View native style={styles.card}>
        {layoutOptions.map((option, index) => {
          const isSelected = layout === option.value
          const isLast = index === layoutOptions.length - 1
          return (
            <View key={option.value} native>
              <Pressable
                style={styles.row}
                onPress={() => setLayout(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View native style={styles.rowContent}>
                  <Text style={styles.rowLabel}>
                    {t(
                      `screens.settings.transfers.layout.options.${
                        option.value === TransferLayoutEnum.COMBINE
                          ? "combine"
                          : "separate"
                      }.label`,
                    )}
                  </Text>
                  <Text variant="small" style={styles.rowDescription}>
                    {t(
                      `screens.settings.transfers.layout.options.${
                        option.value === TransferLayoutEnum.COMBINE
                          ? "combine"
                          : "separate"
                      }.description`,
                    )}
                  </Text>
                  <LayoutPreview variant={option.value} />
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
      <InfoBanner text={t("screens.settings.transfers.layout.caption")} />

      {/* Exclude from totals */}
      <View native style={styles.sectionLabel}>
        <Text variant="small" style={styles.sectionLabelText}>
          {t("screens.settings.transfers.totals.subtitle")}
        </Text>
      </View>
      <View native style={styles.toggleCard}>
        <Pressable
          style={styles.toggleRow}
          onPress={() => setExcludeFromTotals(!excludeFromTotals)}
        >
          <View native style={styles.toggleRowContent}>
            <Text style={styles.toggleLabel}>
              {t("screens.settings.transfers.totals.excludeToggle.label")}
            </Text>
            <Text variant="small" style={styles.toggleDescription}>
              {t("screens.settings.transfers.totals.excludeToggle.description")}
            </Text>
          </View>
          <Switch
            value={excludeFromTotals}
            onValueChange={setExcludeFromTotals}
          />
        </Pressable>
      </View>
    </ScrollView>
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
    opacity: 0.5,
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
    backgroundColor: theme.colors.customColors?.semi,
  },
}))
