import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { LangCodeEnum, type LangCodeType } from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"

const languageOptions: {
  value: LangCodeType
  label: string
}[] = [
  {
    value: LangCodeEnum.EN,
    label: "English",
  },
  {
    value: LangCodeEnum.AR,
    label: "العربية",
  },
]

export default function LanguageOptionsScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const languageCode = useLanguageStore((s) => s.languageCode)
  const setLanguageCode = useLanguageStore((s) => s.setLanguageCode)

  const handleSelectLanguage = (code: LangCodeType) => {
    setLanguageCode(code)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View native style={styles.sectionLabel}>
        <Text variant="small" style={styles.sectionLabelText}>
          {t("screens.settings.preferences.language.sectionLabel")}
        </Text>
      </View>
      <View native style={styles.card}>
        {languageOptions.map((option, index) => {
          const isSelected = languageCode === option.value
          const isLast = index === languageOptions.length - 1
          return (
            <View key={option.value} native>
              <ListItem
                style={styles.row}
                onPress={() => handleSelectLanguage(option.value)}
              >
                <View native style={styles.rowContent}>
                  <Text style={styles.rowLabel}>{option.label}</Text>
                </View>
                {isSelected ? (
                  <IconSvg
                    name="check-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : null}
              </ListItem>
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

  sectionLabel: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionLabelText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: theme.colors.semantic?.semi,
  },

  card: {
    overflow: "hidden",
  },
  row: {
    justifyContent: "space-between",
    minHeight: 56,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.semantic?.semi,
    opacity: 0.4,
  },
}))
