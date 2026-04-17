import {
  Platform,
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
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "link"

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  link: "link",
  blockquote: Platform.select({ web: "blockquote" as Role }),
  code: Platform.select({ web: "code" as Role }),
}

const ARIA_LEVEL: Partial<Record<TextVariant, number>> = {
  h1: 1,
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
    _web: {
      userSelect: "text",
    },
  },
  h1: {
    color: theme.colors.onSurface,
    ...theme.typography.displayMedium,
    lineHeight: 44,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
  },
  h2: {
    color: theme.colors.onSurface,
    paddingBottom: 8,
    ...theme.typography.headlineLarge,
    lineHeight: 38,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
    _web: {
      scrollMarginTop: 80,
    },
  },
  h3: {
    color: theme.colors.onSurface,
    ...theme.typography.displaySmall,
    lineHeight: 32,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
    _web: {
      scrollMarginTop: 80,
    },
  },
  h4: {
    color: theme.colors.onSurface,
    ...theme.typography.titleMedium,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: Fonts.sans,
    _web: {
      scrollMarginTop: 80,
    },
  },
  p: {
    fontFamily: Fonts.sans,
    color: theme.colors.onSurface,
    ...theme.typography.bodyLarge,
    lineHeight: 28,
    marginVertical: 6,
  },
  blockquote: {
    color: theme.colors.onSurface,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.onSurface,
    paddingLeft: 12,
    marginVertical: 16,
    fontStyle: "italic",
    fontFamily: Fonts.sans,
  },
  code: {
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontFamily: Fonts.mono,
    fontSize: theme.typography.labelLarge.fontSize,
    lineHeight: 20,
    fontWeight: "600",
  },
  lead: {
    color: theme.colors.onSecondary,
    fontFamily: Fonts.sans,
    ...theme.typography.titleMedium,
    lineHeight: 28,
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
  link: {
    color: theme.colors.primary,
    fontFamily: Fonts.sans,
    ...theme.typography.bodyLarge,
    lineHeight: 24,
    _web: {
      textDecorationLine: "underline",
      cursor: "pointer",
      _hover: {
        color: theme.colors.primary,
      },
    },
  },
}))
