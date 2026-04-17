/**
 * Inline color variant selector: trigger row + expandable panel.
 * Same content and styles as ColorVariantSheet, but opens inline instead of a bottom sheet.
 * The trigger button that opens the panel lives here so styles are shared.
 */

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { useScrollIntoView } from "~/hooks/use-scroll-into-view"
import { useThemeStore } from "~/stores/theme.store"
import { getThemeStrict, THEME_GROUPS } from "~/styles/theme/registry"
import type { MintyColorScheme } from "~/styles/theme/types"

import { Button } from "./ui/button"
import { ChevronIcon } from "./ui/chevron-icon"

interface ColorVariantInlineProps {
  /** Currently selected scheme name (for controlled component). */
  selectedSchemeName?: string | null
  /** Callback when a color variant is selected - returns the scheme name. */
  onColorSelected?: (schemeName: string) => void
  /** Callback when selection is cleared. */
  onClearSelection?: () => void
}

/**
 * Inline color variant selection: trigger row + expandable panel.
 * Visually matches the old sheet (same styles); only presentation is inline.
 */
export function ColorVariantInline({
  selectedSchemeName: controlledSelectedSchemeName,
  onColorSelected,
  onClearSelection,
}: ColorVariantInlineProps) {
  const { t } = useTranslation()
  const { themeMode } = useThemeStore()
  const { wrapperRef, scrollIntoView } = useScrollIntoView()
  const [expanded, setExpanded] = useState(false)
  const [internalSelectedSchemeName, setInternalSelectedSchemeName] = useState<
    string | null
  >(null)
  /** Selection state while panel is open (for checkmark UI). */
  const [pendingSchemeName, setPendingSchemeName] = useState<string | null>(
    null,
  )

  const selectedSchemeName =
    controlledSelectedSchemeName !== undefined
      ? controlledSelectedSchemeName
      : internalSelectedSchemeName

  const selectedScheme = selectedSchemeName
    ? getThemeStrict(selectedSchemeName)
    : undefined

  const getCurrentThemeInfo = (): {
    category: string
    variant: string
    schemes: MintyColorScheme[]
  } | null => {
    for (const [category, groups] of Object.entries(THEME_GROUPS)) {
      for (const group of groups) {
        const foundScheme = group.schemes.find((s) => s.name === themeMode)
        if (foundScheme) {
          return {
            category,
            variant: group.name,
            schemes: group.schemes,
          }
        }
      }
    }
    return null
  }

  const getVariantName = (themeName: string): string => {
    const name = themeName
      .replace(/^catppuccin/i, "")
      .replace(/Frappe$/i, "")
      .replace(/Macchiato$/i, "")
      .replace(/Mocha$/i, "")
      .replace(/^minty/i, "")
      .replace(/Light$/i, "")
      .replace(/Dark$/i, "")
      .replace(/Oled$/i, "")
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const themeInfo = getCurrentThemeInfo()

  const handleToggle = () => {
    setExpanded((v) => {
      const next = !v
      if (next) {
        setPendingSchemeName(selectedSchemeName ?? null)
        scrollIntoView()
      }
      return next
    })
  }

  /** Apply color immediately on select. */
  const handleColorSelect = (scheme: MintyColorScheme) => {
    setPendingSchemeName(scheme.name)
    if (controlledSelectedSchemeName === undefined) {
      setInternalSelectedSchemeName(scheme.name)
    }
    onColorSelected?.(scheme.name)
  }

  /** Clear selection immediately. */
  const handleClearPending = () => {
    setPendingSchemeName(null)
    if (controlledSelectedSchemeName === undefined) {
      setInternalSelectedSchemeName(null)
    }
    onClearSelection?.()
  }

  /** Just close the inline panel. */
  const handleDone = () => {
    setExpanded(false)
  }

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      {/* Trigger row – same look as the previous "Change color" row */}
      <Pressable style={styles.triggerRow} onPress={handleToggle}>
        <View style={styles.triggerLeft}>
          <IconSvg name="palette" size={24} />
          <Text variant="default" style={styles.triggerLabel}>
            {t("components.colorPicker.changeColor")}
          </Text>
        </View>
        <View style={styles.triggerRight}>
          {selectedScheme ? (
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: selectedScheme.primary },
              ]}
            />
          ) : (
            <Text variant="default" style={styles.defaultColorText}>
              {t("components.colorPicker.defaultColor")}
            </Text>
          )}

          <ChevronIcon
            direction={expanded ? "up" : "trailing"}
            size={20}
            style={styles.chevronIcon}
          />
        </View>
      </Pressable>

      {/* Inline panel – same content and styles as ColorVariantSheet */}
      {expanded && (
        <View style={styles.panel}>
          <View style={styles.container}>
            {/* <View style={styles.header}>
              <Text style={styles.headerLabel}>{t("components.colorPicker.currentTheme")}</Text>
              {themeInfo && (
                <Text style={styles.headerTheme}>{themeInfo.variant}</Text>
              )}
            </View> */}

            {themeInfo && themeInfo.schemes.length > 0 ? (
              <View style={styles.colorGrid}>
                {themeInfo.schemes.map((scheme) => {
                  const isSelected = pendingSchemeName === scheme.name
                  const variantName = getVariantName(scheme.name)
                  return (
                    <View key={scheme.name} style={styles.colorOptionContainer}>
                      <Pressable
                        style={[
                          styles.colorOption,
                          isSelected &&
                            styles.colorOptionSelected(scheme.primary),
                        ]}
                        onPress={() => handleColorSelect(scheme)}
                      >
                        <View
                          style={[
                            styles.colorCircle,
                            { backgroundColor: scheme.primary },
                          ]}
                        />
                        {isSelected && <View style={styles.checkmark} />}
                      </Pressable>
                      <Text style={styles.variantLabel} numberOfLines={1}>
                        {variantName}
                      </Text>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {t("components.colorPicker.noVariants")}
                </Text>
              </View>
            )}

            {themeInfo && themeInfo.schemes.length > 0 && (
              <View style={styles.actionsRow}>
                <Button
                  variant="secondary"
                  disabled={!pendingSchemeName}
                  onPress={handleClearPending}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text variant="default">{t("common.actions.clear")}</Text>
                </Button>
                <Button
                  onPress={handleDone}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text variant="default">{t("common.actions.done")}</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
  },
  // Trigger row – matches modify screen settings row styles
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  triggerLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  defaultColorText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSecondary,
    opacity: 0.6,
  },
  chevronIcon: {
    color: theme.colors.onSecondary,
    opacity: 0.4,
  },
  // Inline panel – same styles as ColorVariantSheet
  panel: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: 10,
  },
  container: {
    paddingHorizontal: 0,
    paddingTop: 8,
    gap: 24,
    backgroundColor: `${theme.colors.onSurface}10`,
    borderRadius: theme.radius,
    padding: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 8,
  },
  headerLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSurface,
    opacity: 0.6,
    marginBottom: 4,
  },
  headerTheme: {
    ...theme.typography.titleMedium,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  colorOptionContainer: {
    alignItems: "center",
    width: 64,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
  },
  colorOptionSelected: (primary: string) => ({
    backgroundColor: primary,
  }),
  variantLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSurface,
    opacity: 0.6,
    marginTop: 4,
    textAlign: "center",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  checkmark: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.onPrimary,
    bottom: 4,
    right: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSurface,
    opacity: 0.5,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginHorizontal: 20,
    gap: 12,
  },
}))
