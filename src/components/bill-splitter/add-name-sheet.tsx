import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Text } from "~/components/ui/text"

interface AddNameSheetProps {
  visible: boolean
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddNameSheet({ visible, onAdd, onClose }: AddNameSheetProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [name, setName] = useState("")

  const handleAdd = () => {
    const trimmed = name.trim()
    if (trimmed.length > 0 && trimmed.length <= 50) {
      onAdd(trimmed)
      setName("")
      onClose()
    }
  }

  const handleClose = () => {
    setName("")
    onClose()
  }

  return (
    <BottomSheet isPresented={visible} onDismiss={handleClose}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${theme.colors.primary}20` },
            ]}
          >
            <IconSvg
              name="user-plus-outline"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.title}>
            {t("screens.settings.billSplitter.names.addName")}
          </Text>
        </View>

        <Input
          value={name}
          onChangeText={setName}
          maxLength={50}
          placeholder={t("screens.settings.billSplitter.names.placeholder")}
          autoCapitalize="words"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />

        <View style={styles.buttonRow}>
          <Button variant="outline" onPress={handleClose} style={styles.button}>
            <Text>{t("common.actions.cancel")}</Text>
          </Button>
          <Button
            onPress={handleAdd}
            disabled={name.trim().length === 0}
            style={styles.button}
          >
            <Text>{t("common.actions.add")}</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    paddingVertical: 8,
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    ...theme.typography.headlineSmall,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
    color: theme.colors.onSurface,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },
}))
