import { createContext, useContext, useMemo } from "react"
import type { PressableProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Pressable } from "./pressable"

// Text class context for passing variant styles to child Text components
const ButtonTextContext = createContext<{
  variant?: ButtonVariant
  size?: ButtonSize
}>({})

export const useButtonTextContext = () => useContext(ButtonTextContext)

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = ({
  variant = "default",
  size = "default",
  disabled,
  style,
  children,
  ...props
}: ButtonProps) => {
  const contextValue = useMemo(() => ({ variant, size }), [variant, size])

  return (
    <ButtonTextContext.Provider value={contextValue}>
      <Pressable
        // native
        role="button"
        style={(state) => [
          styles.base,
          variantStyles[variant],
          sizeStyles[size],
          disabled && styles.disabled,
          // Native pressed state handling
          state.pressed && pressedStyles[variant],
          typeof style === "function" ? style(state) : style,
        ]}
        disabled={disabled}
        {...props}
      >
        {children}
      </Pressable>
    </ButtonTextContext.Provider>
  )
}

const styles = StyleSheet.create((theme) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    gap: 8,
    flexShrink: 1,
    _web: {
      outlineStyle: "none",
      transitionProperty: "all",
      transitionDuration: "200ms",
      cursor: "pointer",
    },
  },
  disabled: {
    opacity: 0.5,
    _web: {
      pointerEvents: "none",
      cursor: "not-allowed",
    },
  },
}))

const variantStyles = StyleSheet.create((theme) => ({
  default: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  destructive: {
    backgroundColor: theme.colors.error,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ghost: {
    backgroundColor: "transparent",
    _web: {
      _hover: {
        backgroundColor: theme.colors.secondary,
      },
      _focusVisible: {
        backgroundColor: theme.colors.secondary,
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: theme.colors.primary,
        outlineOffset: 2,
      },
      _active: {
        backgroundColor: theme.colors.secondary,
      },
    },
  },
  link: {
    backgroundColor: "transparent",
  },
}))

// Pressed state styles for native (non-web)
const pressedStyles = StyleSheet.create((theme) => ({
  default: {},
  destructive: {},
  outline: {},
  secondary: {},
  ghost: {
    backgroundColor: theme.colors.secondary,
  },
  link: {},
}))

const sizeStyles = StyleSheet.create((theme) => ({
  default: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius,
    gap: 6,
  },
  lg: {
    height: 44,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: theme.radius,
  },
  icon: {
    height: 40,
    width: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
}))

// Text styles for button variants
export const buttonTextStyles = StyleSheet.create((theme) => ({
  base: {
    ...theme.typography.labelLarge,
    color: theme.colors.onSurface,
    _web: {
      pointerEvents: "none",
      transitionProperty: "colors",
      transitionDuration: "200ms",
    },
  },
  default: {
    color: theme.colors.onPrimary,
  },
  destructive: {
    color: theme.colors.onError,
  },
  outline: {
    color: theme.colors.onSurface,
  },
  secondary: {
    color: theme.colors.onSecondary,
  },
  ghost: {
    color: theme.colors.onSurface,
    _web: {
      _hover: {
        color: theme.colors.secondary,
      },
    },
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
    _web: {
      textDecorationLine: "underline",
    },
  },
}))

// Size-specific text styles
export const buttonTextSizeStyles = StyleSheet.create((theme) => ({
  default: {
    fontSize: theme.typography.labelLarge.fontSize,
  },
  sm: {
    fontSize: theme.typography.bodyMedium.fontSize,
  },
  lg: {
    fontSize: theme.typography.bodyLarge.fontSize,
  },
  icon: {
    fontSize: theme.typography.labelLarge.fontSize,
  },
}))
