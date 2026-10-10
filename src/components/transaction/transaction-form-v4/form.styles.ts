import { StyleSheet } from "react-native-unistyles"

export const H_PAD = 20
const FORM_GAP = 4
const SECTION_GAP = 8
const ROW_PADDING_V = 8
const ROW_GAP = 10
const CARD_PAD = 12
const SMALL_GAP = 4
const ELEMENT_GAP = 12
const TRIGGER_PAD = 6
const MICRO_GAP = 2
const BUTTON_PAD_H = 14

export const transactionFormStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: H_PAD,
    paddingBottom: FORM_GAP,
  },
  content: {
    paddingBottom: 100,
  },
  form: {
    gap: FORM_GAP,
  },
  nameSection: {
    paddingHorizontal: H_PAD,
  },
  balanceSection: {
    paddingHorizontal: H_PAD,
  },
  fieldError: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.error,
    marginTop: SMALL_GAP,
    paddingHorizontal: H_PAD,
  },
  fieldBlock: {
    marginBottom: FORM_GAP,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PAD,
    marginBottom: SECTION_GAP,
  },
  sectionLabelInRow: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.semantic.semi,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  clearButton: {
    borderRadius: theme.radius,
    paddingVertical: SMALL_GAP,
    paddingHorizontal: SECTION_GAP,
  },
  clearButtonText: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.primary,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  accountTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
    paddingVertical: TRIGGER_PAD,
    paddingHorizontal: TRIGGER_PAD,
    borderRadius: theme.radius,
    marginHorizontal: H_PAD,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    borderStyle: "dashed",
  },
  accountTriggerSelected: {
    borderStyle: "solid",
    borderColor: theme.colors.primary,
  },
  conversionRateRow: {
    marginHorizontal: H_PAD,
    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
    paddingVertical: TRIGGER_PAD + 4,
    paddingHorizontal: H_PAD,
    borderRadius: theme.radius,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    borderStyle: "dashed",
  },
  conversionRateRowSelected: {
    borderStyle: "solid",
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.secondary,
  },
  conversionRateSummaryRow: {
    marginHorizontal: H_PAD,
    marginTop: SECTION_GAP + 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: TRIGGER_PAD,
    paddingHorizontal: H_PAD,
  },
  conversionRateSummaryLabel: {
    ...theme.typography.bodyMedium,
    fontWeight: "600",
    color: theme.colors.semantic?.semi ?? theme.colors.onSecondary,
    letterSpacing: 0.5,
  },
  conversionRateSummaryValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
  },
  conversionRateAmount: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  conversionRateEquals: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  conversionOutcomeRow: {
    marginHorizontal: H_PAD,

    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
    paddingVertical: TRIGGER_PAD,
    paddingHorizontal: H_PAD,
    marginTop: SECTION_GAP + 4,
  },
  conversionOutcomeLeft: {
    minWidth: 0,
  },
  conversionOutcomeAmount: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  conversionOutcomeRate: {
    ...theme.typography.bodyLarge,
    color: theme.colors.semantic?.semi ?? theme.colors.onSecondary,
  },
  conversionInputRow: {
    marginTop: SECTION_GAP + 4,
    marginHorizontal: H_PAD,
    marginBottom: 0,
  },
  accountTriggerError: {
    borderColor: theme.colors.error,
  },
  accountTriggerContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SECTION_GAP,
  },
  accountTriggerName: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  accountTriggerBalance: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.semantic.semi,
  },
  accountTriggerPlaceholder: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.semantic.semi,
  },
  inlineAccountPicker: {
    marginTop: FORM_GAP,
    marginHorizontal: H_PAD,
    maxHeight: 320,
    borderRadius: theme.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
    padding: CARD_PAD,
  },
  inlinePickerRowSelected: {
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: theme.radius,
  },
  accountPickerRow: {
    marginTop: FORM_GAP,
    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
    paddingVertical: TRIGGER_PAD,
    paddingHorizontal: TRIGGER_PAD,
    borderRadius: theme.radius,
  },
  accountPickerRowAdd: {
    marginTop: FORM_GAP,
    flexDirection: "row",
    alignItems: "center",
    gap: ELEMENT_GAP,
    paddingVertical: TRIGGER_PAD,
    paddingHorizontal: TRIGGER_PAD,
    borderRadius: theme.radius,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.secondary,
  },
  accountPickerRowAddLabel: {
    ...theme.typography.bodyLarge,
    flex: 1,
    minWidth: 0,
    color: theme.colors.primary,
  },
  accountPickerRowContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SECTION_GAP,
  },
  accountPickerRowName: {
    ...theme.typography.bodyLarge,
    flex: 1,
    minWidth: 0,
  },
  accountPickerRowBalance: {
    fontSize: theme.typography.bodyMedium.fontSize,
  },
  searchFieldWrap: {
    marginBottom: CARD_PAD,
  },
  kindScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SECTION_GAP,
    paddingHorizontal: H_PAD,
    paddingVertical: SMALL_GAP,
  },
  tagsWrapGrid: {
    marginHorizontal: H_PAD,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: SECTION_GAP,
    paddingVertical: SMALL_GAP,
  },
  tagChipBase: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
  },
  tagChipAdd: {
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  tagChipAddText: {
    ...theme.typography.labelLarge,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  // Edge-to-edge like the other form rows (ListItem): each pressable carries the
  // 20px side inset itself, so its press feedback reaches the screen edges.
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: FORM_GAP,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingStart: 20,
    paddingEnd: 8,
  },
  dateButtonText: {
    ...theme.typography.titleMedium,
    fontWeight: "700",
    color: theme.colors.onSurface,
    flexShrink: 1,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingStart: 8,
    paddingEnd: 20,
  },
  timeBox: {
    minWidth: 42,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${theme.colors.onSurface}14`,
  },
  timeText: {
    ...theme.typography.titleSmall,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  timeColon: {
    ...theme.typography.titleSmall,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  timePeriodText: {
    ...theme.typography.labelLarge,
    color: theme.colors.semantic.semi,
  },
  inlineDateRow: {
    gap: ROW_GAP,
    justifyContent: "space-between",
  },
  inlineDateText: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  switchRow: {
    justifyContent: "space-between",
    marginBottom: ELEMENT_GAP,
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
  },
  switchLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  pendingSwitchRow: {
    justifyContent: "space-between",
  },
  lockedKindRow: {
    justifyContent: "space-between",
    gap: ROW_GAP,
    marginBottom: FORM_GAP,
  },
  lockedKindLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
  },
  lockedKindText: {
    flex: 1,
    minWidth: 0,
  },
  lockedKindSubtitle: {
    color: theme.colors.semantic.semi,
  },
  recurrenceRow: {
    marginHorizontal: H_PAD,
    flexDirection: "row",
    alignItems: "center",
    gap: SECTION_GAP,
    marginBottom: FORM_GAP,
    direction: "ltr",
  },
  recurrenceUntilText: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
    writingDirection: "ltr",
  },
  stepperButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  stepperValue: {
    minWidth: 36,
    textAlign: "center",
    writingDirection: "ltr",
    color: theme.colors.onSurface,
  },
  recurrenceUnitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: BUTTON_PAD_H,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  fieldValue: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  fieldPlaceholder: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.semantic.semi,
    flex: 1,
    minWidth: 0,
  },
  chevronIcon: {
    color: theme.colors.semantic.semi,
    opacity: 0.7,
    alignSelf: "center",
  },
  notesPressable: {
    paddingVertical: 14,
    paddingHorizontal: H_PAD,
  },
  notesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
  },
  notesHeader: {
    gap: ROW_GAP,
  },
  notesFullPreviewWrap: {
    marginTop: FORM_GAP,
    minWidth: 0,
    padding: CARD_PAD,
    borderRadius: theme.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
  },
  addFilesLabel: {
    flex: 1,
    ...theme.typography.titleSmall,
    color: theme.colors.semantic.semi,
  },
  addFilesOptionsContainer: {
    marginTop: FORM_GAP,
    marginHorizontal: H_PAD,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  addFilesOptionRow: {
    gap: ROW_GAP,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  addFilesOptionRowLast: {
    borderBottomWidth: 0,
  },
  addFilesOptionLabel: {
    flex: 1,
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  attachmentsList: {
    marginTop: ELEMENT_GAP,
    gap: SECTION_GAP,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
  },
  attachmentRowMain: {
    flex: 1,
    gap: ROW_GAP,
    minWidth: 0,
  },
  attachmentInfo: {
    flex: 1,
    minWidth: 0,
    // backgroundColor: theme.colors.secondary,
  },
  attachmentName: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSecondary,
  },
  attachmentMeta: {
    fontSize: theme.typography.bodyMedium.fontSize,
    marginTop: MICRO_GAP,
    color: theme.colors.semantic.semi,
  },
  attachmentRemoveBtn: {
    marginRight: H_PAD,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: H_PAD,
    paddingTop: 2 * FORM_GAP,
    paddingBottom: 2 * FORM_GAP,
    gap: ELEMENT_GAP,
    borderTopWidth: 1,
    borderTopColor: theme.colors.semantic.semi,
  },
  footerButton: {
    flex: 1,
  },
  deleteButtonBlock: {
    marginTop: FORM_GAP,
    marginBottom: FORM_GAP,
    marginHorizontal: H_PAD,
    gap: ELEMENT_GAP,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonColor: {
    color: theme.colors.error,
  },

  cancelText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onPrimary,
  },
  saveSpinner: {
    marginVertical: MICRO_GAP,
  },
}))
