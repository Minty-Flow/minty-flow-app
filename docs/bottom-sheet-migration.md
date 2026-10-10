# Bottom-sheet consistency tracker

Rule: sheets that replaced a full-screen modal use `heightFraction={0.75}` (content `flex: 1`, owns its scrolling). Small choice/confirm sheets size to content and the wrapper scrolls them.

Native sheet wrapper: `src/components/ui/bottom-sheet.tsx` (`@expo/ui` BottomSheet).
Status: `done` converted · `next` good sheet candidate · `review` needs a decision / has risk · `keep` stays a centered dialog.

## Modals (RN `Modal`)

| File | Today | Plan | Notes |
|---|---|---|---|
| `transaction/transaction-form-v4/recurrence-unit-sheet.tsx` | full-screen slide | **done** | First conversion. Verify on device. |
| `ui/date-time-picker/date-time-picker-sheet.tsx` | slide | **done** | iOS spinner; `contentPadding={0}`. Check nested use inside `date-range-preset` (sheet over a Modal). |
| `date-range-preset-sheet/index.tsx` | full-screen slide | **done** | `heightFraction={0.75}`. Risks to check: nested date-picker sheet (iOS) opened from inside this sheet; year input vs keyboard; month grid fits. |
| `selectors/currency-selector-sheet.tsx` | full-screen slide | **done** | List sheet: `heightFraction={0.75}` + `contentPadding={0}`. Check keyboard vs search field, list scroll to the end. |
| `selectors/contact-selector-sheet.tsx` | full-screen slide | **done** | `heightFraction={0.75}`. Check: permission prompt appearing over the sheet, list loads (Suspense), search, select closes. |
| `change-icon-inline/icon-selection-sheet.tsx` | full-screen slide | **done** | `heightFraction={0.75}`; 6-col FlatList grid; Done + preview footer kept. Check: typing in search with keyboard, grid scroll, selection reset on reopen. |
| `transaction/notes-modal.tsx` | slide | **keep as modal** (decided) | Rich-text editor: better UX full-screen. |
| `transaction/location-picker-modal.tsx` | full-screen slide | **keep as modal** (decided) | Map pans/gestures fight a sheet. Locate logic rewritten; Cancel / Delete / Confirm. |
| `confirm-sheet.tsx` | fade dialog | **done** | Content-sized, `dismissable={!loading}`. Used by ~15 screens: spot-check a couple (delete account, language, trash). |
| `info-sheet.tsx` | fade dialog | **done** | Content-sized. |
| `transaction/transaction-form-v4/kind-info-sheet.tsx` | fade card | **done** | `heightFraction={0.75}`, inner ScrollView, OK button pinned below. |
| `transaction/edit-recurring-sheet.tsx` | fade card | **done** | `dismissable={!loadingScope}` blocks dismiss while saving. |
| `transaction/delete-recurring-sheet.tsx` | fade card | **done** (sheet) | Still opens a native `Alert.alert` confirm for all / this+future: convert that to a sheet or `ConfirmSheet`. |
| `loans/loan-action-sheet.tsx` | fade card | **done** | Content-sized, not dismissable while loading. |
| `bill-splitter/add-name-sheet.tsx` | fade card | **done** | Has a text input: check keyboard vs field/buttons. |
| `transaction/attachment-preview-modal.tsx` | fade, image viewer | keep | full-bleed viewer |
| `settings/data-management/export-history.tsx` | inline modal | **done** (inner ActionSheet) | Content-sized. |

| `transaction/transaction-form-v4/tag-picker-sheet.tsx` | (new, replaced the inline dropdown) | **done** | `heightFraction={0.75}`; draft selection applied on Done; search, New tag, Clear selection. Check keyboard vs search field. |

| `month-picker-sheet.tsx` / `year-picker-sheet.tsx` | inline `MonthGrid` + inline year input | **done** | Replaces `month-grid.tsx`. Month sheet opens the year sheet stacked on top. Used by `MonthYearPicker` (5 screens) and the date-range sheet. Check stacking on iOS. |

## Native `Alert.alert` (5 calls, decisions)

| Where | What it is | Decision |
|---|---|---|
| `app/_layout.tsx:82` and `:95` | "Your data is ready" notice after the one-time SQLite→Drizzle migration (with "Don't show again" on the first) | **Keep native.** Runs in the root gate before app providers/theme are mounted; also temporary (TODO remove-after-drizzle-rollout). |
| `app/(tabs)/_layout.tsx:246` | Development notice on launch ("A quick note", Don't show again / OK) | Convert later, low priority. Fires on mount in the tabs layout; two actions. |
| `settings/preferences/privacy.tsx:44` | Error: device lock required to enable app lock (OK only) | **Done**: now an `InfoSheet` (state `deviceLockInfoVisible`). |
| `transaction/delete-recurring-sheet.tsx:147` | Destructive confirm for "all" / "this and future", opened over a sheet | Keep native for now: a sheet opened over a sheet is risky on iOS. Better: an inline confirm step inside the same sheet. |

## Screens presented as modals (expo-router)

- `app/_layout.tsx` `transaction/[id]`: `presentation: "fullScreenModal"` (the form). Keep full-screen.
- Other screens pushed from forms (tags, categories, etc.) are normal stack screens.

## Inline dropdowns acting like pickers (not modals)

- Account / to-account / goal / budget / loan pickers in `transaction-form-v4` (inline `searchFieldWrap` dropdowns): candidates for one shared picker sheet.
