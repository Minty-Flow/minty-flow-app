import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  MoneyFormatEnum,
  type MoneyFormatType,
  useMoneyFormattingStore,
} from "~/stores/money-formatting.store"

const formatOptions: Array<{
  value: MoneyFormatType
  label: string
  description: string
}> = [
  {
    value: MoneyFormatEnum.SYMBOL,
    label: "Symbol",
    description: "e.g., $, €, £",
  },
  {
    value: MoneyFormatEnum.CODE,
    label: "Code",
    description: "e.g., USD, EUR, GBP",
  },
  {
    value: MoneyFormatEnum.NAME,
    label: "Name",
    description: "e.g., US Dollar, Euro",
  },
]

export default function MoneyFormattingScreen() {
  const { theme } = useUnistyles()
  const preferredCurrency = useMoneyFormattingStore((s) => s.preferredCurrency)
  const setCurrencyLook = useMoneyFormattingStore((s) => s.setCurrencyLook)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  const exampleAmount = 1234.56
  const { t } = useTranslation()

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
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

      <View native style={styles.sectionLabel}>
        <Text variant="small" style={styles.sectionLabelText}>
          {t(
            "screens.settings.preferences.appearance.moneyFormatting.displayFormatLabel",
          )}
        </Text>
      </View>
      <View native style={styles.card}>
        {formatOptions.map((option, index) => {
          const isSelected = currencyLook === option.value
          const isLast = index === formatOptions.length - 1
          return (
            <View key={option.value} native>
              <Pressable
                style={styles.row}
                onPress={() => setCurrencyLook(option.value)}
              >
                <View native style={styles.rowContent}>
                  <Text style={styles.rowLabel}>
                    {t(
                      `screens.settings.preferences.appearance.moneyFormatting.options.${option.value}.label`,
                    )}
                  </Text>
                  <Text variant="small" style={styles.rowDescription}>
                    {t(
                      `screens.settings.preferences.appearance.moneyFormatting.options.${option.value}.description`,
                    )}
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

  sectionLabel: {
    paddingHorizontal: 20,
    marginBottom: 8,
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
    color: theme.colors.customColors.semi,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.customColors?.semi,
    opacity: 0.4,
  },
}))
