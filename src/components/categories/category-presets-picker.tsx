/**
 * Category presets picker shared by onboarding and Settings → Categories →
 * Presets: the core categories first, then optional packs grouped by life
 * situation (Student, Car owner, …). A pack header adds or removes its whole
 * pack. Presets the user already has are shown as added and can't be picked.
 */
import { type ReactNode, useState, useTransition } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { PresetListItem } from "~/components/preset-list-item"
import { RouteLoadingState } from "~/components/route-load-state"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type CategoryPreset,
  getPresetGroups,
  presetKey,
} from "~/constants/pre-sets-categories"
import { useCategoriesByTypeQuery } from "~/database/drizzle/read-models/category-read-model"
import { createCategory } from "~/database/services/category-service"
import type { Category, CategoryType } from "~/types/categories"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

const COLUMNS = 3
const FILLER_KEYS = ["filler-a", "filler-b"]

type Props = {
  type: CategoryType
  /** Onboarding pre-selects the core presets so the user can just continue. */
  preselectCore: boolean
  header?: ReactNode
  /** Label of the bottom button for the current selection size. */
  buttonLabel: (count: number) => string
  /** Whether the button needs at least one selection. */
  requireSelection: boolean
  /** Runs after the selected presets were created. */
  onDone: () => void
}

export function CategoryPresetsPicker(props: Props) {
  const { data: categories, status } = useCategoriesByTypeQuery(props.type)
  if (status === "loading") return <RouteLoadingState />
  return <PickerInner {...props} categories={categories} />
}

function PickerInner({
  type,
  preselectCore,
  header,
  buttonLabel,
  requireSelection,
  onDone,
  categories,
}: Props & { categories: Category[] }) {
  const { t } = useTranslation()
  const { core, packs } = getPresetGroups(type)
  const allPresets = [...core, ...packs.flatMap((p) => p.presets)]

  const addedKeys = new Set(
    allPresets
      .filter((p) =>
        categories.some((c) => c.icon === p.icon && c.type === p.type),
      )
      .map(presetKey),
  )
  const availableKeys = (presets: CategoryPreset[]) =>
    presets.map(presetKey).filter((k) => !addedKeys.has(k))

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(preselectCore ? availableKeys(core) : []),
  )
  const [saving, startTransition] = useTransition()

  const setMany = (keys: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      for (const k of keys) {
        if (on) next.add(k)
        else next.delete(k)
      }
      return next
    })

  const allKeys = availableKeys(allPresets)
  const allSelected =
    allKeys.length > 0 && allKeys.every((k) => selected.has(k))

  const handleDone = () => {
    startTransition(async () => {
      const toCreate = allPresets.filter((p) => selected.has(presetKey(p)))
      try {
        await Promise.all(
          toCreate.map((preset) =>
            createCategory({
              name: t(preset.name),
              type: preset.type,
              icon: preset.icon,
              colorSchemeName: preset.colorSchemeName,
            }),
          ),
        )
      } catch (error) {
        logger.error("Error creating preset categories", { error })
        Toast.error({
          title: t("common.toast.error"),
          description: t("components.categories.form.toast.createFailed"),
        })
        return
      }
      onDone()
    })
  }

  const renderGrid = (presets: CategoryPreset[]) => {
    const rows: CategoryPreset[][] = []
    for (let i = 0; i < presets.length; i += COLUMNS) {
      rows.push(presets.slice(i, i + COLUMNS))
    }
    return rows.map((row) => (
      <View key={row.map(presetKey).join("|")} style={styles.gridRow}>
        {row.map((preset) => {
          const key = presetKey(preset)
          return (
            <PresetListItem
              key={key}
              icon={preset.icon}
              label={t(preset.name)}
              isSelected={selected.has(key)}
              isAdded={addedKeys.has(key)}
              onPress={() => setMany([key], !selected.has(key))}
            />
          )
        })}
        {/* Fillers keep a short last row at full-grid column widths. */}
        {FILLER_KEYS.slice(0, COLUMNS - row.length).map((key) => (
          <View key={key} style={styles.filler} />
        ))}
      </View>
    ))
  }

  return (
    <View style={styles.container}>
      {header}

      <View style={styles.selectionBar}>
        <Text style={styles.selectionCount}>
          {selected.size > 0
            ? t("components.categories.presets.selectedCount", {
                count: selected.size,
              })
            : t("components.categories.presets.noneSelected")}
        </Text>
        <Pressable
          style={styles.pillButton}
          onPress={() => setMany(allKeys, !allSelected)}
          hitSlop={8}
        >
          <Text style={styles.pillButtonText}>
            {allSelected
              ? t("components.categories.presets.deselectAll")
              : t("components.categories.presets.selectAll")}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          {t("components.categories.presets.essentials")}
        </Text>
        {renderGrid(core)}

        <Text style={[styles.sectionTitle, styles.packsTitle]}>
          {t("components.categories.presets.packsTitle")}
        </Text>
        <Text style={styles.packsHint}>
          {t("components.categories.presets.packsHint")}
        </Text>

        {packs.map((pack) => {
          const keys = availableKeys(pack.presets)
          const packOn = keys.length > 0 && keys.every((k) => selected.has(k))
          return (
            <View key={pack.id} style={styles.pack}>
              <View style={styles.packHeader}>
                <DynamicIcon icon={pack.icon} size={18} variant="badge" />
                <Text style={styles.packName}>{t(pack.name)}</Text>
                {keys.length > 0 ? (
                  <Pressable
                    style={styles.pillButton}
                    onPress={() => setMany(keys, !packOn)}
                    hitSlop={8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: packOn }}
                  >
                    <Text style={styles.pillButtonText}>
                      {packOn
                        ? t("components.categories.presets.removePack")
                        : t("components.categories.presets.addPack")}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              {renderGrid(pack.presets)}
            </View>
          )
        })}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button
          onPress={handleDone}
          disabled={saving || (requireSelection && selected.size === 0)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{buttonLabel(selected.size)}</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectionCount: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  pillButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}18`,
  },
  pillButtonText: {
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    paddingHorizontal: 4,
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
  },
  packsTitle: {
    marginTop: 16,
  },
  packsHint: {
    paddingHorizontal: 4,
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
  },
  pack: {
    gap: 8,
    marginTop: 8,
  },
  packHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  packName: {
    flex: 1,
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  gridRow: {
    flexDirection: "row",
    gap: 8,
  },
  filler: {
    flex: 1,
  },
  buttonRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  button: {
    width: "100%",
  },
  buttonText: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
}))
