# Project Structure
Generated on: 2026-07-21T00:21:49.299Z
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
├── .vscode/
│   └── settings.json
├── .zed/
│   └── settings.json
├── docs/
│   ├── stats-improvement-plan.md
│   ├── stats-recurring-spending-map-plan.md
│   └── STRUCTURE.md
├── plugins/
│   └── with-android-release-signing.mts
├── scripts/
│   ├── check-missing-i18n-keys.mts
│   ├── find-unused-styles.mts
│   ├── generate-icon-barrel.mts
│   └── generate-structure.mts
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── stats-view.tsx
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
│   │   │   │   └── trash-bin.tsx
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
│   │   ├── icons/
│   │   │   ├── filled/ /* tabler-icons, generated via `pnpm icons:sync` — not enumerated */
│   │   │   ├── outline/ /* tabler-icons, generated via `pnpm icons:sync` — not enumerated */
│   │   │   ├── icon-map.ts
│   │   │   ├── icon-svg.tsx
│   │   │   └── index.ts
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
│   │   │   │   ├── net-worth-card.tsx
│   │   │   │   ├── pace-card.tsx
│   │   │   │   ├── stat-card.tsx
│   │   │   │   ├── top-categories-card.tsx
│   │   │   │   └── wrapped-card.tsx
│   │   │   ├── chart-crosshair.tsx
│   │   │   ├── currency-switcher.tsx
│   │   │   ├── delta-badge.tsx
│   │   │   ├── insight-card.tsx
│   │   │   ├── mini-bars.tsx
│   │   │   ├── net-worth-chart.tsx
│   │   │   ├── rhythm-insight-card.tsx
│   │   │   ├── sankey-flow.tsx
│   │   │   ├── spending-heatmap.tsx
│   │   │   ├── stats-category-pie.tsx
│   │   │   ├── stats-detail-shell.tsx
│   │   │   ├── stats-empty-state.tsx
│   │   │   ├── stats-pending-notice.tsx
│   │   │   ├── stats-period-header.tsx
│   │   │   └── stats-skeleton.tsx
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
│   │   │   ├── transaction-form-v3/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── form-account-picker.tsx
│   │   │   │   ├── form-attachments-section.tsx
│   │   │   │   ├── form-budget-picker.tsx
│   │   │   │   ├── form-category-picker.tsx
│   │   │   │   ├── form-conversion-section.tsx
│   │   │   │   ├── form-date-section.tsx
│   │   │   │   ├── form-delete-actions.tsx
│   │   │   │   ├── form-footer.tsx
│   │   │   │   ├── form-goal-picker.tsx
│   │   │   │   ├── form-loan-picker.tsx
│   │   │   │   ├── form-modals.tsx
│   │   │   │   ├── form-notes-section.tsx
│   │   │   │   ├── form-recurring-section.tsx
│   │   │   │   ├── form-tags-picker.tsx
│   │   │   │   ├── form-to-account-picker.tsx
│   │   │   │   ├── form-utils.ts
│   │   │   │   ├── form.styles.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── use-form-attachments.ts
│   │   │   │   ├── use-form-conversion-rate.ts
│   │   │   │   ├── use-form-date-picker.tsx
│   │   │   │   └── use-form-location.ts
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
│   │   │   ├── transaction-section-list.tsx
│   │   │   └── transaction-type-selector.tsx
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
│   │   ├── mappers/
│   │   │   ├── account.mapper.ts
│   │   │   ├── budget.mapper.ts
│   │   │   ├── category.mapper.ts
│   │   │   ├── goal.mapper.ts
│   │   │   ├── hydrateTransactions.ts
│   │   │   ├── loan.mapper.ts
│   │   │   ├── tag.mapper.ts
│   │   │   └── transaction.mapper.ts
│   │   ├── migrations/
│   │   │   ├── sqlite-runner.ts
│   │   │   ├── sqlite-v1.ts
│   │   │   └── sqlite-v2.ts
│   │   ├── repos/
│   │   │   ├── account-repo.ts
│   │   │   ├── budget-repo.ts
│   │   │   ├── category-repo.ts
│   │   │   ├── goal-repo.ts
│   │   │   ├── loan-repo.ts
│   │   │   ├── tag-repo.ts
│   │   │   ├── transaction-repo.ts
│   │   │   └── transaction-tag-repo.ts
│   │   ├── services-sqlite/
│   │   │   ├── account-service.ts
│   │   │   ├── balance-service.ts
│   │   │   ├── budget-service.ts
│   │   │   ├── category-service.ts
│   │   │   ├── data-management-service.ts
│   │   │   ├── goal-service.ts
│   │   │   ├── loan-service.ts
│   │   │   ├── recurring-transaction-service.ts
│   │   │   ├── stats-service.ts
│   │   │   ├── tag-service.ts
│   │   │   ├── transaction-service.ts
│   │   │   └── transfer-service.ts
│   │   ├── types/
│   │   │   └── rows.ts
│   │   ├── utils/
│   │   │   ├── generate-id.ts
│   │   │   ├── get-balance-delta.ts
│   │   │   └── import-snapshot.ts
│   │   ├── db.ts
│   │   ├── events.ts
│   │   ├── sql.ts
│   │   ├── transaction.ts
│   │   └── write-queue.ts
│   ├── hooks/
│   │   ├── exchange-rates-editor.reducer.ts
│   │   ├── use-balance-before.ts
│   │   ├── use-boot-hydration.ts
│   │   ├── use-chart-font.ts
│   │   ├── use-debounced-callback.ts
│   │   ├── use-import-recovery.ts
│   │   ├── use-location-permission-status.ts
│   │   ├── use-navigation-guard.ts
│   │   ├── use-notification-permission-status.ts
│   │   ├── use-notification-sync.ts
│   │   ├── use-recurring-rule.ts
│   │   ├── use-recurring-transaction-sync.ts
│   │   ├── use-retention-cleanup.ts
│   │   ├── use-scroll-into-view.ts
│   │   ├── use-shake-listener.ts
│   │   ├── use-stats.ts
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
│   │   ├── db/
│   │   │   ├── account.store.ts
│   │   │   ├── budget.store.ts
│   │   │   ├── category.store.ts
│   │   │   ├── goal.store.ts
│   │   │   ├── loan.store.ts
│   │   │   ├── tag.store.ts
│   │   │   └── transaction.store.ts
│   │   ├── android-sound.store.ts
│   │   ├── app-lock.store.ts
│   │   ├── bill-splitter.store.ts
│   │   ├── button-placement.store.ts
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
│       ├── logger.ts
│       ├── number-format.ts
│       ├── open-file.ts
│       ├── parse-math-expression.ts
│       ├── pending-transactions.ts
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
├── expo-env.d.ts
├── index.ts
├── LICENSE
├── metro.config.js
├── minty-flow-upload.keystore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json

```
