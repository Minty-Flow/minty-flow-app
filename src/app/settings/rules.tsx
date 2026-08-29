import { useFocusEffect } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, View as RNView, ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { ReorderableListV2 } from "~/components/reorderable-list-v2"
import { FormCategoryPicker } from "~/components/transaction/transaction-form-v3/form-category-picker"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useCategories } from "~/database/drizzle/read-models/category-read-model"
import { useTransactionRules } from "~/database/drizzle/read-models/transaction-rules-read-model"
import {
  applyRulesToBacklog,
  countUncategorisedTransactions,
  createTransactionRule,
  deleteTransactionRule,
  reorderTransactionRules,
  setTransactionRuleActive,
  updateTransactionRule,
} from "~/database/services/transaction-rules-service"
import type { TranslationKey } from "~/i18n/config"
import type {
  RuleMatchField,
  RuleMatchType,
  TransactionRule,
} from "~/types/transaction-rules"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

type EditTarget = TransactionRule | "new" | null

const FIELD_KEY: Record<RuleMatchField, TranslationKey> = {
  title: "screens.settings.rules.field.title",
  description: "screens.settings.rules.field.description",
}
const TYPE_KEY: Record<RuleMatchType, TranslationKey> = {
  contains: "screens.settings.rules.type.contains",
  equals: "screens.settings.rules.type.equals",
  starts_with: "screens.settings.rules.type.starts_with",
}
const MATCH_TYPES: RuleMatchType[] = ["contains", "equals", "starts_with"]
const APPLIES_TAG_KEY: Record<"expense" | "income", TranslationKey> = {
  expense: "screens.settings.rules.appliesTag.expense",
  income: "screens.settings.rules.appliesTag.income",
}
const APPLIES_HINT_KEY: Record<"expense" | "income", TranslationKey> = {
  expense: "screens.settings.rules.appliesHint.expense",
  income: "screens.settings.rules.appliesHint.income",
}

export default function RulesScreen() {
  const { t } = useTranslation()
  const rules = useTransactionRules()
  const categories = useCategories()
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  )

  const [editTarget, setEditTarget] = useState<EditTarget>(null)
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false)
  const [uncategorised, setUncategorised] = useState(0)

  const refreshCount = useCallback(() => {
    try {
      setUncategorised(countUncategorisedTransactions())
    } catch (e) {
      logger.error("count uncategorised failed", { error: String(e) })
    }
  }, [])
  useFocusEffect(refreshCount)

  const handleReorder = (next: TransactionRule[]) => {
    reorderTransactionRules(next.map((r) => r.id)).catch((e) =>
      logger.error("reorder rules failed", { error: String(e) }),
    )
  }

  const runBacklog = async () => {
    try {
      const n = await applyRulesToBacklog()
      refreshCount()
      Toast.success({
        title: t("screens.settings.rules.appliedToast", { count: n }),
      })
    } catch (e) {
      logger.error("apply backlog failed", { error: String(e) })
      Toast.error({ title: t("common.toast.error") })
    }
  }

  const renderRow = ({ item }: { item: TransactionRule }) => {
    const category = item.setCategoryId
      ? categoryById.get(item.setCategoryId)
      : undefined
    return (
      <Pressable style={styles.row} onPress={() => setEditTarget(item)}>
        <View style={styles.rowMain}>
          <Text variant="p" numberOfLines={1} style={styles.rowTitle}>
            {`${t(FIELD_KEY[item.matchField])} ${t(TYPE_KEY[item.matchType])} “${item.matchValue}”`}
          </Text>
          <Text variant="small" style={styles.muted} numberOfLines={1}>
            {"→ "}
            {category?.name ?? t("common.transaction.uncategorized")}
            {category ? ` · ${t(APPLIES_TAG_KEY[category.type])}` : ""}
          </Text>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={(v) =>
            setTransactionRuleActive(item.id, v).catch((e) =>
              logger.error("toggle rule failed", { error: String(e) }),
            )
          }
        />
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      {rules.length === 0 ? (
        <EmptyState icon="sparkles" title={t("screens.settings.rules.empty")} />
      ) : (
        <ReorderableListV2
          data={rules}
          onReorder={handleReorder}
          keyExtractor={(r) => r.id}
          renderItem={renderRow}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.footer}>
        {rules.length > 0 && uncategorised > 0 && (
          <Button
            variant="ghost"
            onPress={() => setConfirmApplyOpen(true)}
            style={styles.applyButton}
          >
            <Text variant="default">
              {t("screens.settings.rules.applyBacklog", {
                count: uncategorised,
              })}
            </Text>
          </Button>
        )}
        <Button variant="default" onPress={() => setEditTarget("new")}>
          <Text variant="default">{t("screens.settings.rules.add")}</Text>
        </Button>
      </View>

      <RuleEditSheet
        target={editTarget}
        categories={categories}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmModal
        visible={confirmApplyOpen}
        onRequestClose={() => setConfirmApplyOpen(false)}
        onConfirm={runBacklog}
        title={t("screens.settings.rules.applyConfirmTitle")}
        description={t("screens.settings.rules.applyConfirmBody", {
          count: uncategorised,
        })}
        confirmLabel={t("common.actions.confirm")}
      />
    </View>
  )
}

/**
 * Always mounted; the Modal is toggled by `visible`, not by mounting the
 * component. Remounting a react-native <Modal> can swallow the next open, so
 * only the stateful <RuleForm> child is keyed + conditionally rendered.
 */
function RuleEditSheet({
  target,
  categories,
  onClose,
}: {
  target: EditTarget
  categories: ReturnType<typeof useCategories>
  onClose: () => void
}) {
  const visible = target !== null
  const rule = target && target !== "new" ? target : null
  const formKey = target === "new" ? "new" : (rule?.id ?? "none")

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <RNView style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          native
          disableRipple
        />
        <View style={styles.modalContent}>
          <View style={styles.modalCard}>
            {visible && (
              <RuleForm
                key={formKey}
                rule={rule}
                categories={categories}
                onClose={onClose}
              />
            )}
          </View>
        </View>
      </RNView>
    </Modal>
  )
}

function RuleForm({
  rule,
  categories,
  onClose,
}: {
  rule: TransactionRule | null
  categories: ReturnType<typeof useCategories>
  onClose: () => void
}) {
  const { t } = useTranslation()
  const isNew = rule === null

  const [matchField, setMatchField] = useState<RuleMatchField>(
    rule?.matchField ?? "title",
  )
  const [matchType, setMatchType] = useState<RuleMatchType>(
    rule?.matchType ?? "contains",
  )
  const [matchValue, setMatchValue] = useState(rule?.matchValue ?? "")
  const [categoryId, setCategoryId] = useState<string | null>(
    rule?.setCategoryId ?? null,
  )
  const [deleteOpen, setDeleteOpen] = useState(false)

  const selectedType = categoryId
    ? categories.find((c) => c.id === categoryId)?.type
    : undefined

  const canSave = matchValue.trim().length > 0 && categoryId != null

  const save = async () => {
    const payload = {
      matchField,
      matchType,
      matchValue: matchValue.trim(),
      setCategoryId: categoryId,
    }
    try {
      if (rule) await updateTransactionRule(rule.id, payload)
      else await createTransactionRule(payload)
      onClose()
    } catch (e) {
      logger.error("save rule failed", { error: String(e) })
      Toast.error({ title: t("common.toast.error") })
    }
  }

  return (
    <>
      <ScrollView>
        <Text variant="h3" style={styles.modalTitle}>
          {isNew
            ? t("screens.settings.rules.addTitle")
            : t("screens.settings.rules.editTitle")}
        </Text>

        <Text variant="small" style={styles.fieldLabel}>
          {t("screens.settings.rules.fieldLabel")}
        </Text>
        <View style={styles.chipRow}>
          <Chip
            label={t("screens.settings.rules.field.title")}
            selected={matchField === "title"}
            hideCheck
            onPress={() => setMatchField("title")}
          />
          <Chip
            label={t("screens.settings.rules.field.description")}
            selected={matchField === "description"}
            hideCheck
            onPress={() => setMatchField("description")}
          />
        </View>

        <Text variant="small" style={styles.fieldLabel}>
          {t("screens.settings.rules.typeLabel")}
        </Text>
        <View style={styles.chipRow}>
          {MATCH_TYPES.map((ty) => (
            <Chip
              key={ty}
              label={t(TYPE_KEY[ty])}
              selected={matchType === ty}
              hideCheck
              onPress={() => setMatchType(ty)}
            />
          ))}
        </View>

        <Text variant="small" style={styles.fieldLabel}>
          {t("screens.settings.rules.valueLabel")}
        </Text>
        <Input
          value={matchValue}
          onChangeText={setMatchValue}
          placeholder={t("screens.settings.rules.valuePlaceholder")}
          autoCapitalize="none"
        />

        <View style={styles.pickerWrap}>
          <FormCategoryPicker
            categories={categories}
            categoryId={categoryId}
            onSelect={setCategoryId}
            onClear={() => setCategoryId(null)}
          />
          {selectedType && (
            <Text variant="small" style={styles.appliesHint}>
              {t(APPLIES_HINT_KEY[selectedType])}
            </Text>
          )}
        </View>

        <Button
          variant="default"
          onPress={save}
          disabled={!canSave}
          style={styles.saveButton}
        >
          <Text variant="default">{t("common.actions.save")}</Text>
        </Button>
        {!isNew && (
          <Button
            variant="ghost"
            onPress={() => setDeleteOpen(true)}
            style={styles.deleteButton}
          >
            <Text variant="default" style={styles.deleteText}>
              {t("common.actions.delete")}
            </Text>
          </Button>
        )}
        <Button variant="ghost" onPress={onClose}>
          <Text variant="default">{t("common.actions.close")}</Text>
        </Button>
      </ScrollView>

      {rule && (
        <ConfirmModal
          visible={deleteOpen}
          onRequestClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            try {
              await deleteTransactionRule(rule.id)
              onClose()
            } catch (e) {
              logger.error("delete rule failed", { error: String(e) })
            }
          }}
          title={t("screens.settings.rules.deleteConfirmTitle")}
          confirmLabel={t("common.actions.delete")}
          variant="destructive"
        />
      )}
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  listContent: { paddingVertical: 8 },
  muted: { color: theme.colors.onSurface, opacity: 0.6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  rowMain: { flex: 1, gap: 2 },
  rowTitle: { color: theme.colors.onSurface },
  footer: {
    padding: 20,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.semantic.semi,
  },
  applyButton: {},
  modalRoot: { flex: 1 },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.shadow,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  modalTitle: { fontWeight: "600", marginBottom: 12 },
  fieldLabel: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pickerWrap: { marginTop: 8 },
  appliesHint: {
    color: theme.colors.onSurface,
    opacity: 0.6,
    marginTop: 6,
  },
  saveButton: { marginTop: 16 },
  deleteButton: { marginTop: 4 },
  deleteText: { color: theme.colors.semantic.expense },
}))
