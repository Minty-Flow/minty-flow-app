import { useCallback, useState } from "react"
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

export interface InputProps extends RNTextInputProps {
  error?: boolean
  native?: boolean
}

export const Input = ({
  error = false,
  editable = true,
  style,
  onFocus,
  onBlur,
  native,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<RNTextInputProps["onFocus"]>>[0]) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<RNTextInputProps["onBlur"]>>[0]) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  if (native)
    return (
      <RNTextInput
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={style}
        {...props}
      />
    )

  return (
    <RNTextInput
      style={[
        styles.base,
        isFocused && styles.focused,
        error && styles.error,
        !editable && styles.disabled,
        typeof style === "function" ? undefined : style,
      ]}
      placeholderTextColor={
        props.placeholderTextColor ?? styles.placeholder.color
      }
      selectionColor={styles.selectionColor.color}
      editable={editable}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  base: {
    height: 36,
    width: "100%",
    minWidth: 0,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    _web: {
      outlineStyle: "none",
      transitionProperty: "border-color, box-shadow",
      transitionDuration: "200ms",
      fontSize: theme.typography.labelLarge.fontSize,
    },
    _android: {
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  placeholder: {
    color: theme.colors.onSurface,
  },
  selectionColor: {
    color: theme.colors.secondary,
  },
  focused: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    _web: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
  },
  error: {
    borderColor: theme.colors.error,
    shadowColor: theme.colors.error,
    shadowOpacity: 0.2,
    _web: {
      borderColor: theme.colors.error,
      shadowColor: theme.colors.error,
      shadowOpacity: 0.4,
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
