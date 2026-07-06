import { type ReactNode, useCallback, useState } from "react"
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  View,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

export interface InputProps extends RNTextInputProps {
  error?: boolean
  success?: boolean
  native?: boolean

  left?: ReactNode
  right?: ReactNode
  variant?: "default" | "search" | "title"
}

export function Input({
  variant = "default",
  error = false,
  success = false,
  editable = true,
  native = false,
  style,
  left,
  right,
  onFocus,
  onBlur,
  multiline,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<RNTextInputProps["onFocus"]>>[0]) => {
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<RNTextInputProps["onBlur"]>>[0]) => {
      setFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  if (native) {
    return (
      <RNTextInput
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={style}
        {...props}
      />
    )
  }

  return (
    <View
      style={[
        styles.container,

        variant === "search" && styles.search,
        variant === "title" && styles.titleContainer,

        focused && variant !== "title" && styles.focused,

        focused && variant === "title" && styles.titleFocused,

        error && styles.error,
        success && styles.success,
        !editable && styles.disabled,

        multiline && styles.multilineContainer,
      ]}
    >
      {left && <View style={styles.slot}>{left}</View>}

      <RNTextInput
        {...props}
        editable={editable}
        multiline={multiline}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,

          variant === "title" && styles.titleInput,

          multiline && styles.multilineInput,

          typeof style === "function" ? undefined : style,
        ]}
        placeholderTextColor={
          props.placeholderTextColor ?? styles.placeholder.color
        }
        selectionColor={styles.selectionColor.color}
      />

      {right && <View style={styles.slot}>{right}</View>}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderRadius: theme.radius,

    borderColor: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,

    paddingHorizontal: 8,

    _web: {
      outlineStyle: "none",
      transitionProperty: "border-color, box-shadow, background-color, opacity",
      transitionDuration: "180ms",
    },
  },

  input: {
    flex: 1,

    color: theme.colors.onSurface,

    fontSize: theme.typography.bodyLarge.fontSize,

    paddingVertical: 8,

    minWidth: 0,

    _web: {
      outlineStyle: "none",
      borderWidth: 0,
      backgroundColor: "transparent",
    },
  },

  slot: {
    justifyContent: "center",
    alignItems: "center",

    marginHorizontal: 6,
  },

  focused: {
    borderColor: theme.colors.primary,

    _web: {
      boxShadow: `0 0 0 3px ${theme.colors.primary}22`,
    },
  },

  error: {
    borderColor: theme.colors.error,

    backgroundColor: theme.colors.surface,

    _web: {
      boxShadow: `0 0 0 3px ${theme.colors.error}22`,
    },
  },

  success: {
    borderColor: theme.colors.secondary,

    _web: {
      boxShadow: `0 0 0 3px ${theme.colors.secondary}22`,
    },
  },

  disabled: {
    opacity: 0.55,

    _web: {
      cursor: "not-allowed",
    },
  },

  multilineContainer: {
    alignItems: "flex-start",
    minHeight: 120,
  },

  multilineInput: {
    textAlignVertical: "top",
    paddingTop: 12,
    minHeight: 100,
  },

  placeholder: {
    color: theme.colors.semantic.semi,
  },

  selectionColor: {
    color: `${theme.colors.primary}80`,
  },

  search: {
    backgroundColor: theme.colors.secondary,
    borderColor: "transparent",

    _web: {
      boxShadow: "none",
    },
  },

  titleContainer: {
    paddingHorizontal: 0,

    borderWidth: 0,
    borderBottomWidth: 1,

    borderBottomColor: theme.colors.secondary,

    borderRadius: 0,

    backgroundColor: "transparent",
  },

  titleFocused: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 1,
  },

  titleInput: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 8,

    fontSize: theme.typography.headlineLarge.fontSize,
    lineHeight: 34,

    fontWeight: "700",

    color: theme.colors.onSurface,

    _web: {
      outlineStyle: "none",
      borderWidth: 0,
      backgroundColor: "transparent",
    },
  },
}))
