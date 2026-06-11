import * as Linking from "expo-linking"
import type { ReactNode } from "react"
import type {
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"

import { Pressable } from "./ui/pressable"
import { Text } from "./ui/text"

type IProps = {
  children: ReactNode
  href: string
  textStyle?: StyleProp<TextStyle>
  pressableStyle?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
}

export const ExternalLink = ({
  href,
  children,
  pressableStyle,
  textStyle,
}: IProps) => {
  return (
    <Pressable onPress={() => Linking.openURL(href)} style={pressableStyle}>
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  )
}
