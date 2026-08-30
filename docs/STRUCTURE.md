# Project Structure
Generated on: 2026-08-30T18:58:46.699Z
```
./
├── .github/
├── .husky/
│   ├── _/
│   │   ├── .gitignore
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── pre-push
│   │   ├── pre-rebase
│   │   └── prepare-commit-msg
│   └── pre-commit
├── .superpowers/
│   └── sdd/
│       ├── 2026-08-30-transaction-kind-slice-1/
│       │   ├── final-code-only.diff
│       │   ├── final-fix-report.md
│       │   ├── progress.md
│       │   ├── review-0476346..9bd185c.diff
│       │   ├── review-06de076..8c2d414.diff
│       │   ├── review-319f978..0476346.diff
│       │   ├── review-549ef7c..8e557fb.diff
│       │   ├── review-5ffb899..fe1d1a3.diff
│       │   ├── review-71717ef..842ca4d.diff
│       │   ├── review-7f6da92..9243259.diff
│       │   ├── review-8e557fb..a570e9d.diff
│       │   ├── review-9bd185c..549ef7c.diff
│       │   ├── review-9bfa4ab..e2fc8e9.diff
│       │   ├── review-a570e9d..486844c.diff
│       │   ├── review-a81b517..7f6da92.diff
│       │   ├── review-ad5f3ad..e2fc8e9.diff
│       │   ├── review-e2fc8e9..d515814.diff
│       │   ├── review-ef3a9e7..71717ef.diff
│       │   ├── task-1-brief.md
│       │   ├── task-1-report.md
│       │   ├── task-10-brief.md
│       │   ├── task-10-report.md
│       │   ├── task-11-brief.md
│       │   ├── task-11-report.md
│       │   ├── task-12-brief.md
│       │   ├── task-12-report.md
│       │   ├── task-2-brief.md
│       │   ├── task-2-report.md
│       │   ├── task-3-brief.md
│       │   ├── task-3-report.md
│       │   ├── task-4-brief.md
│       │   ├── task-4-report.md
│       │   ├── task-5-brief.md
│       │   ├── task-5-report.md
│       │   ├── task-6-brief.md
│       │   ├── task-6-report.md
│       │   ├── task-7-brief.md
│       │   ├── task-7-report.md
│       │   ├── task-8-brief.md
│       │   ├── task-8-report.md
│       │   ├── task-9-brief.md
│       │   └── task-9-report.md
│       ├── 2026-08-30-transaction-kind-slice-2/
│       │   ├── progress.md
│       │   ├── review-0988469..e9eaa54.diff
│       │   ├── review-1a7d18c..5651730.diff
│       │   ├── review-1c75836..50bddf0.diff
│       │   ├── review-3751378..0988469.diff
│       │   ├── review-5651730..3751378.diff
│       │   ├── review-5f5eeef..1a7d18c.diff
│       │   ├── review-e9eaa54..1c75836.diff
│       │   ├── task-1-brief.md
│       │   ├── task-1-report.md
│       │   ├── task-2-brief.md
│       │   ├── task-2-report.md
│       │   ├── task-3-brief.md
│       │   ├── task-3-report.md
│       │   ├── task-4-brief.md
│       │   ├── task-4-report.md
│       │   └── task-5-brief.md
│       └── .gitignore
├── docs/
│   ├── adr/
│   │   └── 0001-transaction-kind-axis.md
│   ├── agents/
│   │   ├── domain.md
│   │   ├── issue-tracker.md
│   │   └── triage-labels.md
│   ├── superpowers/
│   │   ├── plans/
│   │   │   ├── 2026-08-30-transaction-kind-slice-1.md
│   │   │   └── 2026-08-30-transaction-kind-slice-2.md
│   │   └── specs/
│   │       └── 2026-08-30-transaction-form-kind-redesign-design.md
│   ├── post-release-drizzle-architecture-plan.md
│   ├── stats-recurring-spending-map-plan.md
│   └── STRUCTURE.md
├── drizzle/
│   ├── meta/
│   │   ├── _journal.json
│   │   ├── 0000_snapshot.json
│   │   ├── 0001_snapshot.json
│   │   └── 0002_snapshot.json
│   ├── 0000_safe_maximus.sql
│   ├── 0001_deep_daredevil.sql
│   ├── 0002_famous_bastion.sql
│   ├── migrations.d.ts
│   └── migrations.js
├── plugins/
│   └── with-android-release-signing.mts
├── scripts/
│   ├── checks/
│   │   ├── verify-migration-0001.mts
│   │   ├── verify-recurrence.mts
│   │   └── verify-transaction-kind.mts
│   ├── check-missing-i18n-keys.mts
│   ├── check-number-formatting.mts
│   ├── find-unused-styles.mts
│   ├── generate-icon-barrel.mts
│   └── generate-structure.mts
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx
│   │   ├── accounts/
│   │   │   ├── [accountId]/
│   │   │   │   ├── index.tsx
│   │   │   │   └── modify.tsx
│   │   │   └── index.tsx
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx
│   │   │   ├── accounts.tsx
│   │   │   ├── expense-categories.tsx
│   │   │   ├── income-categories.tsx
│   │   │   ├── index.tsx
│   │   │   └── start.tsx
│   │   ├── settings/
│   │   │   ├── bill-splitter/
│   │   │   │   ├── add-item.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── names.tsx
│   │   │   │   └── summary.tsx
│   │   │   ├── budgets/
│   │   │   │   ├── [budgetId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── categories/
│   │   │   │   ├── [categoryId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── presets.tsx
│   │   │   ├── data-management/
│   │   │   │   ├── export-history.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── goals/
│   │   │   │   ├── [goalId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   ├── archived.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── loans/
│   │   │   │   ├── [loanId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── preferences/
│   │   │   │   ├── button-placement.tsx
│   │   │   │   ├── exchange-rates.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── language.tsx
│   │   │   │   ├── money-formatting.tsx
│   │   │   │   ├── pending-transactions.tsx
│   │   │   │   ├── privacy.tsx
│   │   │   │   ├── reminder.tsx
│   │   │   │   ├── theme.tsx
│   │   │   │   ├── toast-style.tsx
│   │   │   │   ├── transaction-appearance.tsx
│   │   │   │   ├── transaction-location.tsx
│   │   │   │   ├── transfers.tsx
│   │   │   │   ├── trash-bin.tsx
│   │   │   │   └── week-start.tsx
│   │   │   ├── tags/
│   │   │   │   ├── [tagId].tsx
│   │   │   │   └── index.tsx
│   │   │   ├── all-accounts.tsx
│   │   │   ├── edit-profile.tsx
│   │   │   ├── index.tsx
│   │   │   ├── pending-transactions.tsx
│   │   │   └── trash.tsx
│   │   ├── stats/
│   │   │   ├── calendar.tsx
│   │   │   ├── cash-flow.tsx
│   │   │   ├── categories.tsx
│   │   │   ├── index.tsx
│   │   │   ├── insights.tsx
│   │   │   ├── net-worth.tsx
│   │   │   └── wrapped.tsx
│   │   ├── transaction/
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx
│   │   └── +html.tsx
│   ├── assets/
│   │   └── images/
│   │       ├── android-icon-background.png
│   │       ├── android-icon-foreground.png
│   │       ├── android-icon-monochrome.png
│   │       ├── favicon.png
│   │       ├── icon.png
│   │       └── splash-icon.png
│   ├── components/
│   │   ├── accounts/
│   │   │   ├── account-modify/
│   │   │   │   ├── account-delete-section.tsx
│   │   │   │   ├── account-form-footer.tsx
│   │   │   │   ├── account-form-modals.tsx
│   │   │   │   ├── account-modify-content.tsx
│   │   │   │   ├── account-modify.styles.ts
│   │   │   │   ├── account-switches-section.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── use-account-form.ts
│   │   │   ├── account-card.tsx
│   │   │   └── account-type-inline.tsx
│   │   ├── bill-splitter/
│   │   │   ├── add-name-modal.tsx
│   │   │   └── bill-item-card.tsx
│   │   ├── budgets/
│   │   │   ├── budget-modify/
│   │   │   │   ├── budget-form-footer.tsx
│   │   │   │   ├── budget-form-modals.tsx
│   │   │   │   ├── budget-modify-content.tsx
│   │   │   │   ├── budget-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   └── budget-card.tsx
│   │   ├── categories/
│   │   │   ├── category-modify/
│   │   │   │   ├── category-form-footer.tsx
│   │   │   │   ├── category-form-modals.tsx
│   │   │   │   ├── category-modify-content.tsx
│   │   │   │   ├── category-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   ├── category-list.tsx
│   │   │   ├── category-row.tsx
│   │   │   ├── category-screen-content.tsx
│   │   │   └── category-type-inline.tsx
│   │   ├── change-icon-inline/
│   │   │   ├── change-icon-inline.styles.ts
│   │   │   ├── emoji-letter-mode.tsx
│   │   │   ├── icon-selection-modal.tsx
│   │   │   ├── image-mode.tsx
│   │   │   ├── index.tsx
│   │   │   ├── mode-selector-list.tsx
│   │   │   └── types.ts
│   │   ├── currency-account-selector/
│   │   │   ├── currency-account-selector.styles.ts
│   │   │   ├── index.tsx
│   │   │   └── types.ts
│   │   ├── date-range-preset-modal/
│   │   │   ├── date-range-preset-modal-content.tsx
│   │   │   ├── date-range-preset-modal.styles.ts
│   │   │   ├── index.tsx
│   │   │   ├── presets.ts
│   │   │   └── types.ts
│   │   ├── goals/
│   │   │   ├── goal-modify/
│   │   │   │   ├── goal-form-footer.tsx
│   │   │   │   ├── goal-form-modals.tsx
│   │   │   │   ├── goal-modify-content.tsx
│   │   │   │   ├── goal-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   └── goal-card.tsx
│   │   ├── inline-category-picker/
│   │   │   └── index.tsx
│   │   ├── loans/
│   │   │   ├── loan-modify/
│   │   │   │   ├── loan-form-footer.tsx
│   │   │   │   ├── loan-form-modals.tsx
│   │   │   │   ├── loan-modify-content.tsx
│   │   │   │   ├── loan-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   ├── loan-action-modal.tsx
│   │   │   └── loan-card.tsx
│   │   ├── location/
│   │   │   └── form-location-picker.tsx
│   │   ├── profile/
│   │   │   └── profile-section.tsx
│   │   ├── selector-modals/
│   │   │   ├── contact-selector-modal.tsx
│   │   │   ├── currency-selector-modal.tsx
│   │   │   └── styles.ts
│   │   ├── smart-amount-input/
│   │   │   ├── amount-input-row.tsx
│   │   │   ├── amount-label-row.tsx
│   │   │   ├── amount-preview-chip.tsx
│   │   │   ├── index.tsx
│   │   │   ├── math-toolbar.tsx
│   │   │   ├── math-utils.ts
│   │   │   └── styles.ts
│   │   ├── stats/
│   │   │   ├── dashboard/
│   │   │   │   ├── calendar-card.tsx
│   │   │   │   ├── cash-flow-card.tsx
│   │   │   │   ├── insights-section.tsx
│   │   │   │   ├── net-worth-card.tsx
│   │   │   │   ├── pace-card.tsx
│   │   │   │   ├── stat-card.tsx
│   │   │   │   ├── top-categories-card.tsx
│   │   │   │   └── wrapped-card.tsx
│   │   │   ├── chart-crosshair.tsx
│   │   │   ├── currency-switcher.tsx
│   │   │   ├── delta-badge.tsx
│   │   │   ├── get-category-color.ts
│   │   │   ├── insight-card.tsx
│   │   │   ├── mini-bars.tsx
│   │   │   ├── net-worth-chart.tsx
│   │   │   ├── rhythm-insight-card.tsx
│   │   │   ├── sankey-flow.tsx
│   │   │   ├── spending-heatmap.tsx
│   │   │   ├── stats-category-pie.tsx
│   │   │   ├── stats-currency-toggle.tsx
│   │   │   ├── stats-detail-shell.tsx
│   │   │   ├── stats-empty-state.tsx
│   │   │   ├── stats-pending-notice.tsx
│   │   │   └── stats-period-header.tsx
│   │   ├── tag/
│   │   │   ├── action-buttons.tsx
│   │   │   ├── delete-section.tsx
│   │   │   ├── form-tag-fields.tsx
│   │   │   ├── form-tag-modals.tsx
│   │   │   └── type-tabs.tsx
│   │   ├── tags/
│   │   │   └── tag-card.tsx
│   │   ├── theme/
│   │   │   ├── standalone-themes-section.tsx
│   │   │   ├── theme-category-segmented-control.tsx
│   │   │   ├── theme-color-grid.tsx
│   │   │   ├── theme-header.tsx
│   │   │   ├── theme-variant-pills.tsx
│   │   │   └── theme.styles.ts
│   │   ├── transaction/
│   │   │   ├── transaction-filter-header/
│   │   │   │   ├── panels/
│   │   │   │   │   ├── accounts-panel.tsx
│   │   │   │   │   ├── attachments-panel.tsx
│   │   │   │   │   ├── categories-panel.tsx
│   │   │   │   │   ├── currency-panel.tsx
│   │   │   │   │   ├── group-by-panel.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── pending-panel.tsx
│   │   │   │   │   ├── search-panel.tsx
│   │   │   │   │   ├── tags-panel.tsx
│   │   │   │   │   └── type-panel.tsx
│   │   │   │   ├── filter-header.styles.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── panel-clear-button.tsx
│   │   │   │   ├── panel-done-button.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── transaction-form-v4/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── field-label.tsx
│   │   │   │   ├── form-account-picker.tsx
│   │   │   │   ├── form-attachments-section.tsx
│   │   │   │   ├── form-budget-picker.tsx
│   │   │   │   ├── form-category-picker.tsx
│   │   │   │   ├── form-conversion-section.tsx
│   │   │   │   ├── form-date-section.tsx
│   │   │   │   ├── form-delete-actions.tsx
│   │   │   │   ├── form-footer.tsx
│   │   │   │   ├── form-goal-picker.tsx
│   │   │   │   ├── form-kind-card.styles.ts
│   │   │   │   ├── form-kind-card.tsx
│   │   │   │   ├── form-kind-selector.tsx
│   │   │   │   ├── form-loan-picker.tsx
│   │   │   │   ├── form-modals.tsx
│   │   │   │   ├── form-notes-section.tsx
│   │   │   │   ├── form-tags-picker.tsx
│   │   │   │   ├── form-to-account-picker.tsx
│   │   │   │   ├── form-utils.ts
│   │   │   │   ├── form.styles.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── loan-card.tsx
│   │   │   │   ├── on-kind-change.ts
│   │   │   │   ├── recurrence-card.tsx
│   │   │   │   ├── recurrence-unit-modal.tsx
│   │   │   │   ├── transaction-top-tabs.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── upcoming-banner.tsx
│   │   │   │   ├── use-form-attachments.ts
│   │   │   │   ├── use-form-conversion-rate.ts
│   │   │   │   ├── use-form-date-picker.tsx
│   │   │   │   ├── use-form-location.ts
│   │   │   │   ├── use-transaction-form.submit.ts
│   │   │   │   └── use-transaction-form.ts
│   │   │   ├── transaction-item/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── left-action.tsx
│   │   │   │   ├── right-action.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   ├── transaction-item-left.tsx
│   │   │   │   └── transaction-item-right.tsx
│   │   │   ├── upcoming-transactions-section/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── upcoming-transactions-section.styles.ts
│   │   │   │   ├── use-app-foreground.ts
│   │   │   │   └── utils.ts
│   │   │   ├── attachment-preview-modal.tsx
│   │   │   ├── delete-recurring-modal.tsx
│   │   │   ├── edit-recurring-modal.tsx
│   │   │   ├── location-picker-modal.tsx
│   │   │   ├── notes-modal.tsx
│   │   │   └── transaction-section-list.tsx
│   │   ├── ui/
│   │   │   ├── date-time-picker/
│   │   │   │   ├── date-time-picker-modal.tsx
│   │   │   │   ├── date-time-picker.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.ts
│   │   │   │   └── use-date-time-picker.tsx
│   │   │   ├── activity-indicator-minty.tsx
│   │   │   ├── button.tsx
│   │   │   ├── chevron-icon.tsx
│   │   │   ├── chips.tsx
│   │   │   ├── collapsible.tsx.txt
│   │   │   ├── empty-state.tsx
│   │   │   ├── info-banner.tsx
│   │   │   ├── input.tsx
│   │   │   ├── list-item.tsx
│   │   │   ├── permission-banner.tsx
│   │   │   ├── pressable.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── text.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── view.tsx
│   │   ├── action-item.tsx
│   │   ├── app-lock-gate.tsx
│   │   ├── color-variant-inline.tsx
│   │   ├── confirm-modal.tsx
│   │   ├── dynamic-icon.tsx
│   │   ├── external-link.tsx
│   │   ├── info-modal.tsx
│   │   ├── keyboard-sticky-view-minty.tsx
│   │   ├── money.tsx
│   │   ├── month-grid.tsx
│   │   ├── month-year-picker.tsx
│   │   ├── preset-list-item.tsx
│   │   ├── privacy-eye-control.tsx
│   │   ├── reorderable-list-v2.tsx
│   │   ├── route-error-boundary.tsx
│   │   ├── route-load-state.tsx
│   │   ├── search-input.tsx
│   │   ├── summary-card.tsx
│   │   ├── tabs-minty.tsx
│   │   └── toggle-item.tsx
│   ├── constants/
│   │   ├── app-data.ts
│   │   ├── fab-button.ts
│   │   ├── minty-icons-selection.ts
│   │   ├── pre-sets-accounts.ts
│   │   └── pre-sets-categories.ts
│   ├── contexts/
│   │   └── scroll-into-view-context.tsx
│   ├── database/
│   │   ├── backup/
│   │   │   ├── backup-format.ts
│   │   │   └── backup-import-plan.ts
│   │   ├── drizzle/
│   │   │   ├── hooks/
│   │   │   ├── read-models/
│   │   │   │   ├── account-read-model.ts
│   │   │   │   ├── budget-read-model.ts
│   │   │   │   ├── category-read-model.ts
│   │   │   │   ├── entity-read-model.ts
│   │   │   │   ├── goal-read-model.ts
│   │   │   │   ├── loan-read-model.ts
│   │   │   │   ├── stats-data.ts
│   │   │   │   ├── stats-read-model.ts
│   │   │   │   ├── tag-read-model.ts
│   │   │   │   └── transaction-read-model.ts
│   │   │   ├── db.ts
│   │   │   └── schema.ts
│   │   ├── mappers/
│   │   │   ├── account.mapper.ts
│   │   │   ├── budget.mapper.ts
│   │   │   ├── category.mapper.ts
│   │   │   ├── goal.mapper.ts
│   │   │   ├── tag.mapper.ts
│   │   │   └── transaction.mapper.ts
│   │   ├── services/
│   │   │   ├── account-service.ts
│   │   │   ├── balance-service.ts
│   │   │   ├── budget-service.ts
│   │   │   ├── category-service.ts
│   │   │   ├── data-management-service.ts
│   │   │   ├── goal-service.ts
│   │   │   ├── ledger-service.ts
│   │   │   ├── loan-service.ts
│   │   │   ├── recurring-transaction-service.ts
│   │   │   └── tag-service.ts
│   │   ├── types/
│   │   │   └── rows.ts
│   │   ├── utils/
│   │   │   ├── generate-id.ts
│   │   │   ├── get-balance-delta.ts
│   │   │   └── import-snapshot.ts
│   │   ├── db.ts
│   │   ├── forced-migration.ts
│   │   ├── transaction.ts
│   │   └── write-queue.ts
│   ├── domain/
│   │   ├── derive-kind.ts
│   │   ├── transaction-kind.assertions.ts
│   │   └── transaction-kind.ts
│   ├── hooks/
│   │   ├── exchange-rates-editor.reducer.ts
│   │   ├── use-balance-before.ts
│   │   ├── use-chart-font.ts
│   │   ├── use-debounced-callback.ts
│   │   ├── use-import-recovery.ts
│   │   ├── use-loan-term-reconcile.ts
│   │   ├── use-location-permission-status.ts
│   │   ├── use-modify-route-loader.ts
│   │   ├── use-navigation-guard.ts
│   │   ├── use-notification-permission-status.ts
│   │   ├── use-notification-sync.ts
│   │   ├── use-recurring-rule.ts
│   │   ├── use-recurring-transaction-sync.ts
│   │   ├── use-retention-cleanup.ts
│   │   ├── use-scroll-into-view.ts
│   │   ├── use-shake-listener.ts
│   │   └── use-time-reactivity.ts
│   ├── i18n/
│   │   ├── translation/
│   │   │   ├── ar.json
│   │   │   └── en.json
│   │   ├── config.ts
│   │   └── language.constants.ts
│   ├── schemas/
│   │   ├── accounts.schema.ts
│   │   ├── budgets.schema.ts
│   │   ├── categories.schema.ts
│   │   ├── goals.schema.ts
│   │   ├── loans.schema.ts
│   │   ├── tags.schema.ts
│   │   └── transactions.schema.ts
│   ├── services/
│   │   ├── auto-confirmation-service.ts
│   │   ├── currency-registry.ts
│   │   ├── exchange-rates.ts
│   │   └── pending-transaction-notifications.ts
│   ├── stores/
│   │   ├── android-sound.store.ts
│   │   ├── app-lock.store.ts
│   │   ├── bill-splitter.store.ts
│   │   ├── button-placement.store.ts
│   │   ├── db-migration.store.ts
│   │   ├── development-notice.store.ts
│   │   ├── exchange-rates-preferences.store.ts
│   │   ├── export-history.store.ts
│   │   ├── language.store.ts
│   │   ├── money-formatting.store.ts
│   │   ├── notification.store.ts
│   │   ├── onboarding.store.ts
│   │   ├── pending-transactions.store.ts
│   │   ├── profile.store.ts
│   │   ├── theme.store.ts
│   │   ├── toast-style.store.ts
│   │   ├── toast.store.ts
│   │   ├── transaction-item-appearance.store.ts
│   │   ├── transaction-location.store.ts
│   │   ├── transfers-preferences.store.ts
│   │   ├── trash-bin.store.ts
│   │   ├── upcoming-section.store.ts
│   │   └── week-start.store.ts
│   ├── styles/
│   │   ├── theme/
│   │   │   ├── schemes/
│   │   │   │   ├── catppuccin.ts
│   │   │   │   ├── minty.ts
│   │   │   │   └── standalone.ts
│   │   │   ├── base.ts
│   │   │   ├── colors.ts
│   │   │   ├── copy-with.ts
│   │   │   ├── factory.ts
│   │   │   ├── registry.ts
│   │   │   ├── types.ts
│   │   │   ├── typography.ts
│   │   │   ├── unistyles-themes.ts
│   │   │   └── utils.ts
│   │   ├── breakpoints.ts
│   │   ├── fonts.ts
│   │   └── unistyles.ts
│   ├── types/
│   │   ├── accounts.ts
│   │   ├── bill-splitter.ts
│   │   ├── budgets.ts
│   │   ├── categories.ts
│   │   ├── currency.ts
│   │   ├── goals.ts
│   │   ├── loans.ts
│   │   ├── new.ts
│   │   ├── stats.ts
│   │   ├── tags.ts
│   │   ├── transaction-filters.ts
│   │   └── transactions.ts
│   └── utils/
│       ├── account-types-list.ts
│       ├── attachments.ts
│       ├── file-icon.ts
│       ├── format-file-size.ts
│       ├── get-week-start-on.ts
│       ├── is-image-url.ts
│       ├── is-single-emoji-or-letter.ts
│       ├── live-progress.ts
│       ├── logger.ts
│       ├── money.ts
│       ├── number-format.ts
│       ├── open-file.ts
│       ├── parse-math-expression.ts
│       ├── pending-transactions.ts
│       ├── planning-progress.ts
│       ├── recurrence.ts
│       ├── stats-date-range.ts
│       ├── string-utils.ts
│       ├── time-utils.ts
│       ├── toast.ts
│       └── transaction-list-utils.ts
├── .env.local
├── .env.local.example
├── .gitignore
├── .nvmrc
├── .svgrrc
├── app.json
├── babel.config.js
├── biome.json
├── CODE_OF_CONDUCT.md
├── CONTEXT.md
├── CONTRIBUTING.md
├── drizzle.config.ts
├── expo-env.d.ts
├── index.ts
├── LICENSE
├── metro.config.js
├── minty-flow-upload.keystore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── skills-lock.json
└── tsconfig.json

```
