import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { KeyboardAvoidingView, Modal, Platform } from "react-native"
import {
  EnrichedTextInput,
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from "react-native-enriched-html"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"

import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface NotesModalProps {
  visible: boolean
  initialValue: string
  onSave: (notes: string) => void
  onRequestClose: () => void
}
function NotesModalContent({
  initialValue,
  onSave,
  onRequestClose,
}: {
  initialValue: string
  onSave: (notes: string) => void
  onRequestClose: () => void
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const editorRef = useRef<EnrichedTextInputInstance>(null)
  const [activeStyles, setActiveStyles] = useState<OnChangeStateEvent | null>(
    null,
  )
  const handleSave = async () => {
    const html = (await editorRef.current?.getHTML()) ?? initialValue
    // An emptied editor still yields markup like `<html><p></p></html>`;
    // store '' so a cleared note counts as no note.
    onSave(hasVisibleText(html) ? html : "")
    onRequestClose()
  }
  const isBold = activeStyles?.bold.isActive ?? false
  const isItalic = activeStyles?.italic.isActive ?? false
  const isUL = activeStyles?.unorderedList.isActive ?? false
  const isOL = activeStyles?.orderedList.isActive ?? false
  const isChecklist = activeStyles?.checkboxList.isActive ?? false
  const toolbarButtons = [
    {
      key: "bold",
      glyph: "B",
      active: isBold,
      onPress: () => editorRef.current?.toggleBold(),
    },
    {
      key: "italic",
      glyph: "I",
      active: isItalic,
      onPress: () => editorRef.current?.toggleItalic(),
    },
    {
      key: "bulletList",
      glyph: "•",
      active: isUL,
      onPress: () => editorRef.current?.toggleUnorderedList(),
    },
    {
      key: "numberedList",
      glyph: "1.",
      active: isOL,
      onPress: () => editorRef.current?.toggleOrderedList(),
    },
    {
      key: "checklist",
      glyph: "☑",
      active: isChecklist,
      onPress: () => editorRef.current?.toggleCheckboxList(false),
    },
  ] as const
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: 16,
            paddingHorizontal: 20,
          },
        ]}
      >
        <Pressable
          onPress={onRequestClose}
          hitSlop={12}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>{t("common.actions.cancel")}</Text>
        </Pressable>
        <Text style={styles.title}>
          {t("components.transactionForm.fields.notes")}
        </Text>
        <Pressable onPress={handleSave} hitSlop={12} style={styles.doneButton}>
          <Text style={[styles.doneText, { color: theme.colors.primary }]}>
            {t("common.actions.done")}
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: theme.colors.secondary,
            borderBottomColor: theme.colors.semantic.semi,
          },
        ]}
      >
        {toolbarButtons.map((btn) => (
          <Pressable
            key={btn.key}
            style={[
              styles.toolbarBtn,
              // Not colour alone: the active format also gets a tinted chip.
              btn.active && { backgroundColor: `${theme.colors.primary}26` },
            ]}
            onPress={btn.onPress}
            hitSlop={4}
            accessibilityLabel={t(
              `components.transactionForm.fields.notesToolbar.${btn.key}`,
            )}
            accessibilityState={{ selected: btn.active }}
          >
            <Text
              style={[
                styles.toolbarLabel,
                {
                  color: btn.active
                    ? theme.colors.primary
                    : theme.colors.onSurface,
                },
                btn.key === "bold" && { fontWeight: "700" },
                btn.key === "italic" && { fontStyle: "italic" },
              ]}
            >
              {btn.glyph}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.content}>
        <EnrichedTextInput
          ref={editorRef}
          defaultValue={initialValue}
          // autoFocus
          placeholder={t("components.transactionForm.fields.notesPlaceholder")}
          placeholderTextColor={theme.colors.semantic.semi}
          onChangeState={(e) => setActiveStyles(e.nativeEvent)}
          style={{
            ...styles.editor,
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.secondary,
          }}
          htmlStyle={{
            ul: { bulletColor: theme.colors.onSurface },
            ol: { markerColor: theme.colors.onSurface },
            ulCheckbox: { boxColor: theme.colors.onSurface },
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}
const hasVisibleText = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim().length > 0

export function NotesModal({
  visible,
  initialValue,
  onSave,
  onRequestClose,
}: NotesModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={"fullScreen"}
      onRequestClose={onRequestClose}
    >
      {visible ? (
        <NotesModalContent
          key={initialValue}
          initialValue={initialValue}
          onSave={onSave}
          onRequestClose={onRequestClose}
        />
      ) : null}
    </Modal>
  )
}
const styles = UnistylesSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  title: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  cancelButton: {
    minWidth: 70,
    alignItems: "flex-start",
  },
  doneButton: {
    minWidth: 70,
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: theme.typography.titleSmall.fontSize,
    color: theme.colors.onSurface,
  },
  doneText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
    borderBottomWidth: 1,
  },
  toolbarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toolbarLabel: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  editor: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
}))
