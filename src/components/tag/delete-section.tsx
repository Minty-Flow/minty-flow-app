import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface DeleteSectionProps {
  onDeletePress: () => void
}

export const DeleteSection = ({ onDeletePress }: DeleteSectionProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.deleteSection}>
      <Button
        variant="ghost"
        onPress={onDeletePress}
        style={styles.actionButton}
      >
        <IconSvg name="trash" size={20} color={styles.deleteIcon.color} />
        <Text variant="default" style={styles.deleteText}>
          {t("screens.settings.tags.form.deleteLabel")}
        </Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  deleteSection: {
    marginTop: 30,
    marginHorizontal: 20,
    gap: 10,
  },
  actionButton: {
    width: "100%",
  },
  deleteIcon: {
    color: theme.colors.error,
  },
  deleteText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.error,
  },
}))
