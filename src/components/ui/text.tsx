import {
  Text as RNText,
  type TextProps as RNTextProps,
  type Role,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Fonts } from "~/styles/fonts"

import {
  buttonTextSizeStyles,
  buttonTextStyles,
  useButtonTextContext,
} from "./button"

export type TextVariant =
  | "default"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "large"
  | "small"
  | "muted"

const ROLE: Partial<Record<TextVariant, Role>> = {
  h2: "heading",
  h3: "heading",
  h4: "heading",
}

const ARIA_LEVEL: Partial<Record<TextVariant, number>> = {
  h2: 2,
  h3: 3,
  h4: 4,
}

interface TextProps extends RNTextProps {
  variant?: TextVariant
  native?: boolean
}

export const Text = ({
  variant = "default",
  style,
  native = false,
  ...props
}: TextProps) => {
  const buttonContext = useButtonTextContext()

  // If inside a button, use button text styles
  const textStyle = buttonContext.variant
    ? [
        buttonTextStyles.base,
        buttonTextStyles[buttonContext.variant],
        buttonContext.size && buttonTextSizeStyles[buttonContext.size],
      ]
    : [textStyles[variant]]

  if (native) {
    return <RNText style={style} {...props} />
  }

  return (
    <RNText
      style={[textStyle, style]}
      role={ROLE[variant]}
      aria-level={ARIA_LEVEL[variant]}
      {...props}
    />
  )
}

const textStyles = StyleSheet.create((theme) => ({
  default: {
    color: theme.colors.onSurface,
    backgroundColor: "transparent",
    ...theme.typography.bodyLarge,
    lineHeight: 24,
  },
  h2: {
    color: theme.colors.onSurface,
    paddingBottom: 8,
    ...theme.typography.headlineLarge,
    lineHeight: 38,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
  },
  h3: {
    color: theme.colors.onSurface,
    ...theme.typography.displaySmall,
    lineHeight: 32,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
  },
  h4: {
    color: theme.colors.onSurface,
    ...theme.typography.titleMedium,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
  },
  p: {
    fontFamily: Fonts.sans,
    color: theme.colors.onSurface,
    ...theme.typography.bodyLarge,
    lineHeight: 28,
    marginVertical: 6,
  },
  large: {
    color: theme.colors.onSurface,
    fontFamily: Fonts.sans,
    ...theme.typography.headlineSmall,
    lineHeight: 28,
  },
  small: {
    color: theme.colors.onSurface,
    fontFamily: Fonts.sans,
    ...theme.typography.labelLarge,
    lineHeight: 20,
  },
  muted: {
    color: theme.colors.onSecondary,
    fontFamily: Fonts.sans,
    ...theme.typography.labelLarge,
    lineHeight: 20,
  },
}))
