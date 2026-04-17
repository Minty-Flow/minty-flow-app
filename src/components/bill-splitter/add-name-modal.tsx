import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Text } from "~/components/ui/text"

interface AddNameModalProps {
  visible: boolean
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddNameModal({ visible, onAdd, onClose }: AddNameModalProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const { theme } = useUnistyles()
  const maxCardWidth = Math.min(width - 48, 400)
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={[styles.backdrop, { width }]}
        onPress={handleClose}
        accessibilityLabel={t("common.actions.close")}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.card,
              {
                maxWidth: maxCardWidth,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius ?? 16,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.colors.primary}20` },
                ]}
              >
                <IconSvg
                  name="user-plus"
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
              <Button
                variant="outline"
                onPress={handleClose}
                style={styles.button}
              >
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
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 24,
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
