// TODO: DEAD CODE — Unused
import type { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { useLanguageStore } from "~/stores/language.store"

import { Button } from "./ui/button"
import { Text } from "./ui/text"
import { Tooltip } from "./ui/tooltip"
import { View } from "./ui/view"

export const ScreenSharedHeader = ({
  props,
}: {
  props: NativeStackHeaderProps
}) => {
  const isRTL = useLanguageStore((s) => s.isRTL)
  const canGoBack = props.navigation?.canGoBack() ?? false
  const title = props.options?.title ?? ""

  return (
    <View style={styles.container}>
      {canGoBack && (
        <Tooltip text="back" position="bottom">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => {
              if (props.navigation?.canGoBack()) {
                props.navigation.goBack()
              }
            }}
            // style={styles.backButton}
          >
            <IconSvg
              name={isRTL ? "arrow-narrow-right" : "arrow-narrow-left"}
              size={24}
            />
          </Button>
        </Tooltip>
      )}

      {title && (
        <Text variant="h4" style={styles.title}>
          {title}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 20,
    elevation: 5,
  },
  title: {
    flex: 1,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  // TODO: DEAD CODE — backButton style never applied (style prop commented out on Button above)
  // backButton: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
}))
