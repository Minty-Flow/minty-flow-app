# Project Structure

Generated on: 2026-03-02T19:57:39.309Z

```
./
├── 📁 .agents/
│   ├── 📁 react-doctor/
│   │   ├── 📄 AGENTS.md
│   │   └── 📄 SKILL.md
│   └── 📁 skills/
│       ├── 📁 building-native-ui/
│       │   ├── 📁 references/
│       │   │   ├── 📄 animations.md
│       │   │   ├── 📄 controls.md
│       │   │   ├── 📄 form-sheet.md
│       │   │   ├── 📄 gradients.md
│       │   │   ├── 📄 icons.md
│       │   │   ├── 📄 media.md
│       │   │   ├── 📄 route-structure.md
│       │   │   ├── 📄 search.md
│       │   │   ├── 📄 storage.md
│       │   │   ├── 📄 tabs.md
│       │   │   ├── 📄 toolbar-and-headers.md
│       │   │   ├── 📄 visual-effects.md
│       │   │   ├── 📄 webgpu-three.md
│       │   │   └── 📄 zoom-transitions.md
│       │   └── 📄 SKILL.md
│       └── 📁 upgrading-expo/
│           ├── 📁 references/
│           │   ├── 📄 expo-av-to-audio.md
│           │   ├── 📄 expo-av-to-video.md
│           │   ├── 📄 native-tabs.md
│           │   ├── 📄 new-architecture.md
│           │   ├── 📄 react-19.md
│           │   └── 📄 react-compiler.md
│           └── 📄 SKILL.md
├── 📁 .claude/
│   ├── 📁 skills/
│   │   ├── 📄 building-native-ui
│   │   └── 📄 upgrading-expo
│   └── 📄 settings.local.json
├── 📁 .github/
│   └── 📄 CODEOWNERS
├── 📁 .husky/
│   ├── 📁 _/
│   │   ├── 📄 .gitignore
│   │   ├── 📄 applypatch-msg
│   │   ├── 📄 commit-msg
│   │   ├── 📄 h
│   │   ├── 📄 husky.sh
│   │   ├── 📄 post-applypatch
│   │   ├── 📄 post-checkout
│   │   ├── 📄 post-commit
│   │   ├── 📄 post-merge
│   │   ├── 📄 post-rewrite
│   │   ├── 📄 pre-applypatch
│   │   ├── 📄 pre-auto-gc
│   │   ├── 📄 pre-commit
│   │   ├── 📄 pre-merge-commit
│   │   ├── 📄 pre-push
│   │   ├── 📄 pre-rebase
│   │   └── 📄 prepare-commit-msg
│   └── 📄 pre-commit
├── 📁 .vscode/
│   └── 📄 settings.json
├── 📁 docs/
│   └── 📄 beta-todo.md
├── 📁 memory/
│   └── 📄 MEMORY.md
├── 📁 plugins/
│   ├── 📄 index.js
│   ├── 📄 README.md
│   └── 📄 withWatermelonDBJSI.js
├── 📁 scripts/
│   ├── 📄 check-missing-i18n-keys.mts
│   ├── 📄 find-unused-styles.mts
│   ├── 📄 generate-structure.mts
│   └── 📄 run-android-usb.mts
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (tabs)/
│   │   │   ├── 📄 _layout.tsx
│   │   │   ├── 📄 index.tsx
│   │   │   └── 📄 stats-view.tsx
│   │   ├── 📁 accounts/
│   │   │   ├── 📁 [accountId]/
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   └── 📄 modify.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 settings/
│   │   │   ├── 📁 categories/
│   │   │   │   ├── 📁 [categoryId]/
│   │   │   │   │   ├── 📄 index.tsx
│   │   │   │   │   └── 📄 modify.tsx
│   │   │   │   ├── 📄 archived.tsx
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   └── 📄 presets.tsx
│   │   │   ├── 📁 preferences/
│   │   │   │   ├── 📁 theme/
│   │   │   │   ├── 📄 exchange-rates.tsx
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   ├── 📄 money-formatting.tsx
│   │   │   │   ├── 📄 pending-transactions.tsx
│   │   │   │   ├── 📄 privacy.tsx
│   │   │   │   ├── 📄 reminder.tsx
│   │   │   │   ├── 📄 theme.tsx
│   │   │   │   ├── 📄 toast-style.tsx
│   │   │   │   ├── 📄 transaction-location.tsx
│   │   │   │   ├── 📄 transfers.tsx
│   │   │   │   └── 📄 trash-bin.tsx
│   │   │   ├── 📁 tags/
│   │   │   │   ├── 📄 [tagId].tsx
│   │   │   │   └── 📄 index.tsx
│   │   │   ├── 📄 all-accounts.tsx
│   │   │   ├── 📄 bill-splitter.tsx
│   │   │   ├── 📄 budgets.tsx
│   │   │   ├── 📄 data-management.tsx
│   │   │   ├── 📄 edit-profile.tsx
│   │   │   ├── 📄 goals.tsx
│   │   │   ├── 📄 index.tsx
│   │   │   ├── 📄 language.tsx
│   │   │   ├── 📄 loans.tsx
│   │   │   ├── 📄 pending-transactions.tsx
│   │   │   └── 📄 trash.tsx
│   │   ├── 📁 transaction/
│   │   │   └── 📄 [id].tsx
│   │   ├── 📄 _layout.tsx
│   │   └── 📄 +html.tsx
│   ├── 📁 assets/
│   │   └── 📁 images/
│   │       ├── 📄 android-icon-background.png
│   │       ├── 📄 android-icon-foreground.png
│   │       ├── 📄 android-icon-monochrome.png
│   │       ├── 📄 favicon.png
│   │       ├── 📄 icon.png
│   │       └── 📄 splash-icon.png
│   ├── 📁 components/
│   │   ├── 📁 accounts/
│   │   │   ├── 📁 account-modify/
│   │   │   │   ├── 📄 account-modify-content.tsx
│   │   │   │   ├── 📄 account-modify.styles.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 types.ts
│   │   │   ├── 📄 account-card.tsx
│   │   │   └── 📄 account-type-inline.tsx
│   │   ├── 📁 categories/
│   │   │   ├── 📁 category-modify/
│   │   │   │   ├── 📄 category-modify-content.tsx
│   │   │   │   ├── 📄 category-modify.styles.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 types.ts
│   │   │   ├── 📄 category-list.tsx
│   │   │   ├── 📄 category-row.tsx
│   │   │   ├── 📄 category-screen-content.tsx
│   │   │   └── 📄 category-type-inline.tsx
│   │   ├── 📁 change-icon-inline/
│   │   │   ├── 📄 change-icon-inline.styles.ts
│   │   │   ├── 📄 change-icon-inline.tsx
│   │   │   ├── 📄 emoji-letter-mode.tsx
│   │   │   ├── 📄 icon-selection-modal.tsx
│   │   │   ├── 📄 image-mode.tsx
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 mode-selector-list.tsx
│   │   │   └── 📄 types.ts
│   │   ├── 📁 date-range-preset-modal/
│   │   │   ├── 📄 date-range-preset-modal-content.tsx
│   │   │   ├── 📄 date-range-preset-modal.styles.ts
│   │   │   ├── 📄 date-range-preset-modal.tsx
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 presets.ts
│   │   │   └── 📄 types.ts
│   │   ├── 📁 profile/
│   │   │   └── 📄 profile-section.tsx
│   │   ├── 📁 selector-modals/
│   │   │   ├── 📄 contact-selector-modal.tsx
│   │   │   ├── 📄 currency-selector-modal.tsx
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 styles.ts
│   │   ├── 📁 tags/
│   │   │   └── 📄 tag-card.tsx
│   │   ├── 📁 theme/
│   │   │   ├── 📄 standalone-themes-section.tsx
│   │   │   ├── 📄 theme-category-segmented-control.tsx
│   │   │   ├── 📄 theme-color-grid.tsx
│   │   │   ├── 📄 theme-header.tsx
│   │   │   ├── 📄 theme-variant-pills.tsx
│   │   │   └── 📄 theme.styles.ts
│   │   ├── 📁 transaction/
│   │   │   ├── 📁 transaction-filter-header/
│   │   │   │   ├── 📁 panels/
│   │   │   │   │   ├── 📄 accounts-panel.tsx
│   │   │   │   │   ├── 📄 attachments-panel.tsx
│   │   │   │   │   ├── 📄 categories-panel.tsx
│   │   │   │   │   ├── 📄 currency-panel.tsx
│   │   │   │   │   ├── 📄 group-by-panel.tsx
│   │   │   │   │   ├── 📄 index.ts
│   │   │   │   │   ├── 📄 pending-panel.tsx
│   │   │   │   │   ├── 📄 search-panel.tsx
│   │   │   │   │   ├── 📄 tags-panel.tsx
│   │   │   │   │   └── 📄 type-panel.tsx
│   │   │   │   ├── 📄 filter-header.styles.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 panel-clear-button.tsx
│   │   │   │   ├── 📄 panel-done-button.tsx
│   │   │   │   ├── 📄 transaction-filter-header.tsx
│   │   │   │   ├── 📄 types.ts
│   │   │   │   └── 📄 utils.ts
│   │   │   ├── 📁 transaction-form-v3/
│   │   │   │   ├── 📄 constants.ts
│   │   │   │   ├── 📄 form-account-picker.tsx
│   │   │   │   ├── 📄 form-location-picker.tsx
│   │   │   │   ├── 📄 form-tags-picker.tsx
│   │   │   │   ├── 📄 form-to-account-picker.tsx
│   │   │   │   ├── 📄 form-utils.ts
│   │   │   │   ├── 📄 form.styles.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 transaction-form-v3.tsx
│   │   │   │   └── 📄 types.ts
│   │   │   ├── 📁 upcoming-transactions-section/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 types.ts
│   │   │   │   ├── 📄 upcoming-transactions-section.styles.ts
│   │   │   │   ├── 📄 upcoming-transactions-section.tsx
│   │   │   │   ├── 📄 use-app-foreground.ts
│   │   │   │   └── 📄 utils.ts
│   │   │   ├── 📄 attachment-preview-modal.tsx
│   │   │   ├── 📄 delete-recurring-modal.tsx
│   │   │   ├── 📄 edit-recurring-modal.tsx
│   │   │   ├── 📄 location-picker-modal.tsx
│   │   │   ├── 📄 notes-modal.tsx
│   │   │   ├── 📄 transaction-item.tsx
│   │   │   ├── 📄 transaction-section-list.tsx
│   │   │   └── 📄 transaction-type-selector.tsx
│   │   ├── 📁 ui/
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 chips.tsx
│   │   │   ├── 📄 collapsible.tsx
│   │   │   ├── 📄 icon-symbol.ios.tsx.md
│   │   │   ├── 📄 icon-symbol.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 permission-banner.tsx
│   │   │   ├── 📄 pressable.tsx
│   │   │   ├── 📄 separator.tsx
│   │   │   ├── 📄 switch.tsx
│   │   │   ├── 📄 text.tsx
│   │   │   ├── 📄 toast.tsx
│   │   │   ├── 📄 tooltip.tsx
│   │   │   └── 📄 view.tsx
│   │   ├── 📄 action-item.tsx
│   │   ├── 📄 app-lock-gate.tsx
│   │   ├── 📄 bottom-sheet.tsx.md
│   │   ├── 📄 color-variant-inline.tsx
│   │   ├── 📄 confirm-modal.tsx
│   │   ├── 📄 dynamic-icon.tsx
│   │   ├── 📄 external-link.tsx
│   │   ├── 📄 info-modal.tsx
│   │   ├── 📄 keyboard-sticky-view-minty.tsx
│   │   ├── 📄 money.tsx
│   │   ├── 📄 month-year-picker.tsx
│   │   ├── 📄 parallax-scroll-view.tsx
│   │   ├── 📄 reorderable-list-v1.tsx
│   │   ├── 📄 reorderable-list-v2.tsx
│   │   ├── 📄 screen-shared-header.tsx
│   │   ├── 📄 search-input.tsx
│   │   ├── 📄 smart-amount-input.tsx
│   │   ├── 📄 summary-card.tsx
│   │   ├── 📄 tabs-minty.tsx
│   │   └── 📄 toggle-item.tsx
│   ├── 📁 constants/
│   │   ├── 📄 minty-icons-selection.ts
│   │   ├── 📄 pre-sets-categories.ts
│   │   └── 📄 site-data.ts
│   ├── 📁 contexts/
│   │   └── 📄 scroll-into-view-context.tsx
│   ├── 📁 database/
│   │   ├── 📁 models/
│   │   │   ├── 📄 account.ts
│   │   │   ├── 📄 budget.ts
│   │   │   ├── 📄 category.ts
│   │   │   ├── 📄 goal.ts
│   │   │   ├── 📄 loan.ts
│   │   │   ├── 📄 recurring-transaction.ts
│   │   │   ├── 📄 tag.ts
│   │   │   ├── 📄 transaction-tag.ts
│   │   │   ├── 📄 transaction.ts
│   │   │   └── 📄 transfer.ts
│   │   ├── 📁 services/
│   │   │   ├── 📄 account-service.ts
│   │   │   ├── 📄 balance-service.ts
│   │   │   ├── 📄 budget-service.ts
│   │   │   ├── 📄 category-service.ts
│   │   │   ├── 📄 goal-service.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 loan-service.ts
│   │   │   ├── 📄 README.md
│   │   │   ├── 📄 recurring-transaction-service.ts
│   │   │   ├── 📄 tag-service.ts
│   │   │   ├── 📄 transaction-service.ts
│   │   │   └── 📄 transfer-service.ts
│   │   ├── 📁 utils/
│   │   │   ├── 📄 model-to-account.ts
│   │   │   ├── 📄 model-to-category.ts
│   │   │   ├── 📄 model-to-tag.ts
│   │   │   └── 📄 model-to-transfer.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 migrations.ts
│   │   └── 📄 schema.ts
│   ├── 📁 hooks/
│   │   ├── 📄 exchange-rates-editor.reducer.ts
│   │   ├── 📄 use-balance-before.ts
│   │   ├── 📄 use-boolean.ts
│   │   ├── 📄 use-color-scheme.ts
│   │   ├── 📄 use-location-permission-status.ts
│   │   ├── 📄 use-navigation-guard.ts
│   │   ├── 📄 use-notification-permission-status.ts
│   │   ├── 📄 use-recurring-rule.ts
│   │   ├── 📄 use-recurring-transaction-sync.ts
│   │   ├── 📄 use-retention-cleanup.ts
│   │   ├── 📄 use-scroll-into-view.ts
│   │   └── 📄 use-time-reactivity.ts
│   ├── 📁 i18n/
│   │   ├── 📁 translation/
│   │   │   ├── 📄 ar.json
│   │   │   └── 📄 en.json
│   │   ├── 📄 config.ts
│   │   └── 📄 language.constants.ts
│   ├── 📁 schemas/
│   │   ├── 📄 accounts.schema.ts
│   │   ├── 📄 categories.schema.ts
│   │   ├── 📄 tags.schema.ts
│   │   └── 📄 transactions.schema.ts
│   ├── 📁 services/
│   │   ├── 📄 auto-confirmation-service.ts
│   │   ├── 📄 currency-registry.ts
│   │   ├── 📄 exchange-rates.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 pending-transaction-notifications.ts
│   ├── 📁 stores/
│   │   ├── 📄 android-sound.store.ts
│   │   ├── 📄 app-lock.store.ts
│   │   ├── 📄 exchange-rates-preferences.store.ts
│   │   ├── 📄 language.store.ts
│   │   ├── 📄 letter-emoji.store.ts
│   │   ├── 📄 money-formatting.store.ts
│   │   ├── 📄 notification.store.ts
│   │   ├── 📄 pending-transactions.store.ts
│   │   ├── 📄 profile.store.ts
│   │   ├── 📄 theme.store.ts
│   │   ├── 📄 toast-style.store.ts
│   │   ├── 📄 toast.store.ts
│   │   ├── 📄 transaction-item-appearance.store.ts
│   │   ├── 📄 transaction-location.store.ts
│   │   ├── 📄 transaction-sheet-controls.store.ts
│   │   ├── 📄 transfers-preferences.store.ts
│   │   ├── 📄 trash-bin.store.ts
│   │   └── 📄 upcoming-section.store.ts
│   ├── 📁 styles/
│   │   ├── 📁 theme/
│   │   │   ├── 📁 schemes/
│   │   │   │   ├── 📄 catppuccin.ts
│   │   │   │   ├── 📄 minty.ts
│   │   │   │   └── 📄 standalone.ts
│   │   │   ├── 📄 base.ts
│   │   │   ├── 📄 colors.ts
│   │   │   ├── 📄 factory.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 registry.ts
│   │   │   ├── 📄 types.ts
│   │   │   ├── 📄 typography.ts
│   │   │   ├── 📄 unistyles-themes.ts
│   │   │   └── 📄 utils.ts
│   │   ├── 📄 breakpoints.ts
│   │   ├── 📄 fonts.ts
│   │   └── 📄 unistyles.ts
│   ├── 📁 types/
│   │   ├── 📄 accounts.ts
│   │   ├── 📄 budgets.ts
│   │   ├── 📄 categories.ts
│   │   ├── 📄 currency.ts
│   │   ├── 📄 goals.ts
│   │   ├── 📄 loans.ts
│   │   ├── 📄 new.ts
│   │   ├── 📄 scroll-into-view.ts
│   │   ├── 📄 tags.ts
│   │   ├── 📄 transaction-filters.ts
│   │   ├── 📄 transactions.ts
│   │   └── 📄 transfers.ts
│   └── 📁 utils/
│       ├── 📄 account-types-list.ts
│       ├── 📄 file-icon.ts
│       ├── 📄 format-file-size.ts
│       ├── 📄 icon-helpers.ts
│       ├── 📄 is-image-url.ts
│       ├── 📄 is-single-emoji-or-letter.ts
│       ├── 📄 is-valid-icon-name.ts
│       ├── 📄 logger.ts
│       ├── 📄 number-format.ts
│       ├── 📄 open-file.ts
│       ├── 📄 parse-math-expression.ts
│       ├── 📄 pending-transactions.ts
│       ├── 📄 recurrence.ts
│       ├── 📄 string-utils.ts
│       ├── 📄 theme-utils.ts
│       ├── 📄 time-utils.ts
│       ├── 📄 toast.ts
│       └── 📄 transaction-list-utils.ts
├── 📄 .gitignore
├── 📄 app.json
├── 📄 babel.config.js
├── 📄 biome.json
├── 📄 eas.json
├── 📄 expo-env.d.ts
├── 📄 index.ts
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 pnpm-workspace.yaml
├── 📄 README.md
├── 📄 skills-lock.json
├── 📄 STRUCTURE.md
└── 📄 tsconfig.json

```
