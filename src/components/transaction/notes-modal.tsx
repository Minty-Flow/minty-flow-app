import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native"
import {
  EnrichedTextInput,
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from "react-native-enriched"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  StyleSheet as UnistylesSheet,
  useUnistyles,
} from "react-native-unistyles"

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

  const handleSave = useCallback(async () => {
    const html = (await editorRef.current?.getHTML()) ?? initialValue
    onSave(html)
    onRequestClose()
  }, [initialValue, onSave, onRequestClose])

  const isBold = activeStyles?.bold.isActive ?? false
  const isItalic = activeStyles?.italic.isActive ?? false
  const isUL = activeStyles?.unorderedList.isActive ?? false
  const isOL = activeStyles?.orderedList.isActive ?? false
  const isChecklist = activeStyles?.checkboxList.isActive ?? false

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
            borderBottomColor: theme.colors.customColors.semi,
          },
        ]}
      >
        <Pressable
          style={styles.toolbarBtn}
          onPress={() => editorRef.current?.toggleBold()}
          hitSlop={4}
        >
          <Text
            style={[
              styles.toolbarLabel,
              {
                color: isBold ? theme.colors.primary : theme.colors.onSurface,
                fontWeight: "700",
              },
            ]}
          >
            B
          </Text>
        </Pressable>
        <Pressable
          style={styles.toolbarBtn}
          onPress={() => editorRef.current?.toggleItalic()}
          hitSlop={4}
        >
          <Text
            style={[
              styles.toolbarLabel,
              {
                color: isItalic ? theme.colors.primary : theme.colors.onSurface,
                fontStyle: "italic",
              },
            ]}
          >
            I
          </Text>
        </Pressable>
        <Pressable
          style={styles.toolbarBtn}
          onPress={() => editorRef.current?.toggleUnorderedList()}
          hitSlop={4}
        >
          <Text
            style={[
              styles.toolbarLabel,
              {
                color: isUL ? theme.colors.primary : theme.colors.onSurface,
              },
            ]}
          >
            •
          </Text>
        </Pressable>
        <Pressable
          style={styles.toolbarBtn}
          onPress={() => editorRef.current?.toggleOrderedList()}
          hitSlop={4}
        >
          <Text
            style={[
              styles.toolbarLabel,
              {
                color: isOL ? theme.colors.primary : theme.colors.onSurface,
              },
            ]}
          >
            1.
          </Text>
        </Pressable>
        <Pressable
          style={styles.toolbarBtn}
          onPress={() => editorRef.current?.toggleCheckboxList(false)}
          hitSlop={4}
        >
          <Text
            style={[
              styles.toolbarLabel,
              {
                color: isChecklist
                  ? theme.colors.primary
                  : theme.colors.onSurface,
              },
            ]}
          >
            ☑
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <EnrichedTextInput
          ref={editorRef}
          defaultValue={initialValue}
          // autoFocus
          placeholder={t("components.transactionForm.fields.notesPlaceholder")}
          placeholderTextColor={theme.colors.customColors.semi}
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
    borderBottomColor: theme.colors.customColors.semi,
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
