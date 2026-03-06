import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

export const LocationComingSoon = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.comingSoon}>
      <Text variant="h4">
        {t("screens.settings.tags.form.locationComingSoon.title")}
      </Text>
      <Text variant="muted">
        {t("screens.settings.tags.form.locationComingSoon.description")}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  comingSoon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
    marginHorizontal: 20,
  },
}))
