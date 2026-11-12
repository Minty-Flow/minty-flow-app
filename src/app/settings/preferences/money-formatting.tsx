import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import {
  SettingsOptionRow,
  SettingsSection,
  settingsStyles,
} from "~/components/settings/settings-list"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  MoneyFormatEnum,
  type MoneyFormatType,
  useMoneyFormattingStore,
} from "~/stores/money-formatting.store"

const formatOptions: MoneyFormatType[] = [
  MoneyFormatEnum.SYMBOL,
  MoneyFormatEnum.CODE,
  MoneyFormatEnum.NAME,
]

export default function MoneyFormattingScreen() {
  const preferredCurrency = useMoneyFormattingStore((s) => s.preferredCurrency)
  const setCurrencyLook = useMoneyFormattingStore((s) => s.setCurrencyLook)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  const exampleAmount = 123_456
  const { t } = useTranslation()

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View native style={styles.previewSection}>
        <Text variant="small" style={styles.previewLabel}>
          {t(
            "screens.settings.preferences.appearance.moneyFormatting.previewLabel",
          )}
        </Text>
        <Money
          value={exampleAmount}
          variant="h2"
          currency={preferredCurrency}
        />
      </View>

      <SettingsSection
        title={t(
          "screens.settings.preferences.appearance.moneyFormatting.displayFormatLabel",
        )}
      >
        {formatOptions.map((value) => (
          <SettingsOptionRow
            key={value}
            label={t(
              `screens.settings.preferences.appearance.moneyFormatting.options.${value}.label`,
            )}
            description={t(
              `screens.settings.preferences.appearance.moneyFormatting.options.${value}.description`,
            )}
            selected={currencyLook === value}
            onPress={() => setCurrencyLook(value)}
          />
        ))}
      </SettingsSection>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  previewSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 8,
  },
  previewLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 0.5,
  },
}))
