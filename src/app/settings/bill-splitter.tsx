import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { EmptyState } from "~/components/ui/empty-state"
import { View } from "~/components/ui/view"

export default function BillSplitterScreen() {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <EmptyState
        icon="divide"
        title={t("screens.settings.billSplitter.comingSoon.title")}
        description={t("screens.settings.billSplitter.comingSoon.description")}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 20,
  },
}))
