import { StyleSheet } from "react-native-unistyles"

export const H_PAD = 20
const FORM_GAP = 8
const SECTION_GAP = 8
const ROW_PADDING_V = 10
const ROW_GAP = 10
const CARD_PAD = 12
const SMALL_GAP = 4
const ELEMENT_GAP = 12
const TRIGGER_PAD = 6
const MICRO_GAP = 2
export const CATEGORY_CELL_SIZE = 74
export const CATEGORY_GAP = 10
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
  sectionLabel: {
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
    textTransform: "capitalize",
    letterSpacing: 0.5,
    marginBottom: SECTION_GAP,
    marginHorizontal: H_PAD,
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
    color: theme.colors.customColors.semi,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  clearButton: {
    borderRadius: theme.radius,
    paddingVertical: SMALL_GAP,
    paddingHorizontal: SECTION_GAP,
  },
  clearButtonDisabled: {
    opacity: 0.4,
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
    color: theme.colors.customColors?.semi ?? theme.colors.onSecondary,
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
    color: theme.colors.customColors?.semi ?? theme.colors.onSecondary,
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
    color: theme.colors.customColors.semi,
  },
  accountTriggerPlaceholder: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.customColors.semi,
  },
  inlineAccountPicker: {
    marginTop: FORM_GAP,
    marginHorizontal: H_PAD,
    maxHeight: 280,
    borderRadius: theme.radius,
    overflow: "hidden",
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
  pickerSearchInput: {
    marginBottom: SECTION_GAP,
  },
  pickerList: {
    // height: 180,
  },
  pickerListContent: {
    // paddingRight: CARD_PAD,
  },
  categoryScrollContent: {
    paddingHorizontal: H_PAD,
    paddingVertical: SMALL_GAP,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CATEGORY_GAP,
  },
  categoryCell: {
    width: CATEGORY_CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: TRIGGER_PAD,
    borderRadius: 12,
    // backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.secondary,
  },
  categoryCellSelected: {
    borderStyle: "solid",

    borderColor: theme.colors.primary,
  },
  categoryCellLabel: {
    fontSize: theme.typography.labelXSmall.fontSize,
    color: theme.colors.onSurface,
    marginTop: SMALL_GAP,
    textAlign: "center",
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
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  tagChipAdd: {
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  tagChipCancel: {
    borderColor: theme.colors.customColors.semi,
    backgroundColor: "transparent",
  },
  tagChipAddText: {
    ...theme.typography.labelLarge,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  inlineTagPicker: {
    marginTop: FORM_GAP,
    marginHorizontal: H_PAD,
    borderRadius: theme.radius,
    overflow: "hidden",
    maxHeight: 400,
  },
  tagSearchInput: {
    marginBottom: SECTION_GAP,
  },
  tagPickerChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SECTION_GAP,
  },
  tagPickerEmptyText: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.customColors.semi,
    paddingVertical: SECTION_GAP,
  },
  createTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: SECTION_GAP,
    marginTop: FORM_GAP,
    borderRadius: theme.radius,
  },
  createTagRowText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.primary,
  },
  inlineDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
    justifyContent: "space-between",
  },
  recurringDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
  },
  inlineDateText: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
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

  recurringSwitchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
  },
  recurringSubSection: {
    marginTop: 2 * FORM_GAP,
  },
  recurringSubLabel: {
    marginHorizontal: H_PAD,
    ...theme.typography.labelMedium,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
    letterSpacing: 0.5,
    marginBottom: SECTION_GAP,
  },
  recurringToggleRow: {
    marginHorizontal: H_PAD,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ROW_GAP,
  },
  recurringToggleButton: {
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: BUTTON_PAD_H,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  recurringToggleButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  recurringToggleLabel: {
    ...theme.typography.bodyLarge,
    color: theme.colors.onSurface,
  },
  recurringToggleLabelSelected: {
    color: theme.colors.onPrimary,
  },
  endsOnPickerContainer: {
    marginTop: FORM_GAP,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    overflow: "hidden",
    marginHorizontal: H_PAD,
  },
  endsOnOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: CARD_PAD,
    paddingHorizontal: H_PAD,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
  },
  endsOnOptionRowLast: {
    borderBottomWidth: 0,
  },
  endsOnOptionLabel: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
  },
  occurrencePresetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ROW_GAP,
    padding: H_PAD,
    paddingTop: 0,
  },
  occurrencePresetButton: {
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: BUTTON_PAD_H,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: "transparent",
  },
  fieldValue: {
    ...theme.typography.titleSmall,
    color: theme.colors.onSurface,
    flex: 1,
    minWidth: 0,
  },
  fieldPlaceholder: {
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.customColors.semi,
    flex: 1,
    minWidth: 0,
  },
  chevronIcon: {
    color: theme.colors.customColors.semi,
    opacity: 0.7,
    alignSelf: "center",
  },
  notesPressable: {
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
  },
  notesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
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
    color: theme.colors.customColors.semi,
  },
  addFilesOptionsContainer: {
    marginTop: FORM_GAP,
    marginHorizontal: H_PAD,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  addFilesOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingVertical: CARD_PAD,
    paddingHorizontal: H_PAD,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
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
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    minWidth: 0,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: H_PAD,
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
    color: theme.colors.customColors.semi,
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
    borderTopColor: theme.colors.customColors.semi,
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
