# Project Structure

Generated on: 2026-03-06T23:48:57.904Z

```
./
├── .agents/
│   ├── react-doctor/
│   │   ├── AGENTS.md
│   │   └── SKILL.md
│   └── skills/
│       ├── building-native-ui/
│       │   ├── references/
│       │   │   ├── animations.md
│       │   │   ├── controls.md
│       │   │   ├── form-sheet.md
│       │   │   ├── gradients.md
│       │   │   ├── icons.md
│       │   │   ├── media.md
│       │   │   ├── route-structure.md
│       │   │   ├── search.md
│       │   │   ├── storage.md
│       │   │   ├── tabs.md
│       │   │   ├── toolbar-and-headers.md
│       │   │   ├── visual-effects.md
│       │   │   ├── webgpu-three.md
│       │   │   └── zoom-transitions.md
│       │   └── SKILL.md
│       ├── react-native-best-practices/
│       │   ├── agents/
│       │   │   └── openai.yaml
│       │   ├── references/
│       │   │   ├── images/
│       │   │   │   ├── bundle-treemap-source-map-explorer.png
│       │   │   │   ├── controlled-textinput-pingpong.png
│       │   │   │   ├── devtools-flamegraph.png
│       │   │   │   ├── emerge-xray-ios.png
│       │   │   │   ├── expo-atlas-treemap.png
│       │   │   │   ├── flashlight-flatlist-vs-flashlist.png
│       │   │   │   ├── fps-drop-graph.png
│       │   │   │   ├── memory-heap-snapshot.png
│       │   │   │   ├── tti-warm-start-diagram.png
│       │   │   │   ├── view-hierarchy-flattening.png
│       │   │   │   ├── xcode-instruments-templates.png
│       │   │   │   └── xcode-thread-view.png
│       │   │   ├── bundle-analyze-app.md
│       │   │   ├── bundle-analyze-js.md
│       │   │   ├── bundle-barrel-exports.md
│       │   │   ├── bundle-code-splitting.md
│       │   │   ├── bundle-hermes-mmap.md
│       │   │   ├── bundle-library-size.md
│       │   │   ├── bundle-native-assets.md
│       │   │   ├── bundle-r8-android.md
│       │   │   ├── bundle-tree-shaking.md
│       │   │   ├── js-animations-reanimated.md
│       │   │   ├── js-atomic-state.md
│       │   │   ├── js-concurrent-react.md
│       │   │   ├── js-lists-flatlist-flashlist.md
│       │   │   ├── js-measure-fps.md
│       │   │   ├── js-memory-leaks.md
│       │   │   ├── js-profile-react.md
│       │   │   ├── js-react-compiler.md
│       │   │   ├── js-uncontrolled-components.md
│       │   │   ├── native-android-16kb-alignment.md
│       │   │   ├── native-measure-tti.md
│       │   │   ├── native-memory-leaks.md
│       │   │   ├── native-memory-patterns.md
│       │   │   ├── native-platform-setup.md
│       │   │   ├── native-profiling.md
│       │   │   ├── native-sdks-over-polyfills.md
│       │   │   ├── native-threading-model.md
│       │   │   ├── native-turbo-modules.md
│       │   │   └── native-view-flattening.md
│       │   ├── POWER.md
│       │   └── SKILL.md
│       └── ui-ux-pro-max/
│           ├── data/
│           │   ├── stacks/
│           │   │   ├── astro.csv
│           │   │   ├── flutter.csv
│           │   │   ├── html-tailwind.csv
│           │   │   ├── jetpack-compose.csv
│           │   │   ├── nextjs.csv
│           │   │   ├── nuxt-ui.csv
│           │   │   ├── nuxtjs.csv
│           │   │   ├── react-native.csv
│           │   │   ├── react.csv
│           │   │   ├── shadcn.csv
│           │   │   ├── svelte.csv
│           │   │   ├── swiftui.csv
│           │   │   └── vue.csv
│           │   ├── charts.csv
│           │   ├── colors.csv
│           │   ├── icons.csv
│           │   ├── landing.csv
│           │   ├── products.csv
│           │   ├── react-performance.csv
│           │   ├── styles.csv
│           │   ├── typography.csv
│           │   ├── ui-reasoning.csv
│           │   ├── ux-guidelines.csv
│           │   └── web-interface.csv
│           ├── scripts/
│           │   ├── __pycache__/
│           │   │   ├── core.cpython-314.pyc
│           │   │   └── design_system.cpython-314.pyc
│           │   ├── core.py
│           │   ├── design_system.py
│           │   └── search.py
│           └── SKILL.md
├── .claude/
│   ├── skills/
│   │   ├── building-native-ui
│   │   ├── react-native-best-practices
│   │   └── ui-ux-pro-max
│   └── settings.local.json
├── .github/
│   └── CODEOWNERS
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
├── docs/
│   └── beta-todo.md
├── plugins/
│   ├── index.js
│   ├── README.md
│   └── withWatermelonDBJSI.js
├── scripts/
│   ├── check-missing-i18n-keys.mts
│   ├── find-unused-styles.mts
│   ├── generate-structure.mts
│   └── run-android-usb.mts
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
│   │   ├── settings/
│   │   │   ├── categories/
│   │   │   │   ├── [categoryId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   ├── archived.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── presets.tsx
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
│   │   │   ├── bill-splitter.tsx
│   │   │   ├── budgets.tsx
│   │   │   ├── data-management.tsx
│   │   │   ├── edit-profile.tsx
│   │   │   ├── goals.tsx
│   │   │   ├── index.tsx
│   │   │   ├── loans.tsx
│   │   │   ├── pending-transactions.tsx
│   │   │   └── trash.tsx
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
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── use-account-form.ts
│   │   │   ├── account-card.tsx
│   │   │   └── account-type-inline.tsx
│   │   ├── categories/
│   │   │   ├── category-modify/
│   │   │   │   ├── category-form-footer.tsx
│   │   │   │   ├── category-form-modals.tsx
│   │   │   │   ├── category-modify-content.tsx
│   │   │   │   ├── category-modify.styles.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── category-list.tsx
│   │   │   ├── category-row.tsx
│   │   │   ├── category-screen-content.tsx
│   │   │   └── category-type-inline.tsx
│   │   ├── change-icon-inline/
│   │   │   ├── change-icon-inline.styles.ts
│   │   │   ├── change-icon-inline.tsx
│   │   │   ├── emoji-letter-mode.tsx
│   │   │   ├── icon-selection-modal.tsx
│   │   │   ├── image-mode.tsx
│   │   │   ├── index.ts
│   │   │   ├── mode-selector-list.tsx
│   │   │   └── types.ts
│   │   ├── date-range-preset-modal/
│   │   │   ├── date-range-preset-modal-content.tsx
│   │   │   ├── date-range-preset-modal.styles.ts
│   │   │   ├── date-range-preset-modal.tsx
│   │   │   ├── index.ts
│   │   │   ├── presets.ts
│   │   │   └── types.ts
│   │   ├── profile/
│   │   │   └── profile-section.tsx
│   │   ├── selector-modals/
│   │   │   ├── contact-selector-modal.tsx
│   │   │   ├── currency-selector-modal.tsx
│   │   │   ├── index.ts
│   │   │   └── styles.ts
│   │   ├── smart-amount-input/
│   │   │   ├── amount-input-row.tsx
│   │   │   ├── amount-label-row.tsx
│   │   │   ├── amount-preview-chip.tsx
│   │   │   ├── index.tsx
│   │   │   ├── math-toolbar.tsx
│   │   │   ├── math-utils.ts
│   │   │   └── styles.ts
│   │   ├── tag/
│   │   │   ├── action-buttons.tsx
│   │   │   ├── delete-section.tsx
│   │   │   ├── form-tag-fields.tsx
│   │   │   ├── form-tag-modals.tsx
│   │   │   ├── location-coming-soon.tsx
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
│   │   │   │   ├── index.ts
│   │   │   │   ├── panel-clear-button.tsx
│   │   │   │   ├── panel-done-button.tsx
│   │   │   │   ├── transaction-filter-header.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── transaction-form-v3/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── form-account-picker.tsx
│   │   │   │   ├── form-attachments-section.tsx
│   │   │   │   ├── form-category-picker.tsx
│   │   │   │   ├── form-conversion-section.tsx
│   │   │   │   ├── form-date-picker-modal.tsx
│   │   │   │   ├── form-date-section.tsx
│   │   │   │   ├── form-delete-actions.tsx
│   │   │   │   ├── form-footer.tsx
│   │   │   │   ├── form-location-picker.tsx
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
│   │   │   │   ├── use-form-date-picker.ts
│   │   │   │   └── use-form-location.ts
│   │   │   ├── transaction-item/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── left-action.tsx
│   │   │   │   ├── right-action.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   ├── transaction-item-left.tsx
│   │   │   │   └── transaction-item-right.tsx
│   │   │   ├── upcoming-transactions-section/
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── upcoming-transactions-section.styles.ts
│   │   │   │   ├── upcoming-transactions-section.tsx
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
│   │   │   ├── activity-indicator-minty.tsx
│   │   │   ├── button.tsx
│   │   │   ├── chips.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── icon-symbol.ios.tsx.md
│   │   │   ├── icon-symbol.tsx
│   │   │   ├── info-banner.tsx
│   │   │   ├── input.tsx
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
│   │   ├── bottom-sheet.tsx.md
│   │   ├── color-variant-inline.tsx
│   │   ├── confirm-modal.tsx
│   │   ├── dynamic-icon.tsx
│   │   ├── external-link.tsx
│   │   ├── info-modal.tsx
│   │   ├── keyboard-sticky-view-minty.tsx
│   │   ├── money.tsx
│   │   ├── month-year-picker.tsx
│   │   ├── reorderable-list-v1.tsx
│   │   ├── reorderable-list-v2.tsx
│   │   ├── screen-shared-header.tsx
│   │   ├── search-input.tsx
│   │   ├── summary-card.tsx
│   │   ├── tabs-minty.tsx
│   │   └── toggle-item.tsx
│   ├── constants/
│   │   ├── fab-button.ts
│   │   ├── minty-icons-selection.ts
│   │   ├── pre-sets-categories.ts
│   │   └── site-data.ts
│   ├── contexts/
│   │   └── scroll-into-view-context.tsx
│   ├── database/
│   │   ├── models/
│   │   │   ├── account.ts
│   │   │   ├── budget.ts
│   │   │   ├── category.ts
│   │   │   ├── goal.ts
│   │   │   ├── loan.ts
│   │   │   ├── recurring-transaction.ts
│   │   │   ├── tag.ts
│   │   │   ├── transaction-tag.ts
│   │   │   ├── transaction.ts
│   │   │   └── transfer.ts
│   │   ├── services/
│   │   │   ├── account-service.ts
│   │   │   ├── balance-service.ts
│   │   │   ├── budget-service.ts
│   │   │   ├── category-service.ts
│   │   │   ├── goal-service.ts
│   │   │   ├── index.ts
│   │   │   ├── loan-service.ts
│   │   │   ├── README.md
│   │   │   ├── recurring-transaction-service.ts
│   │   │   ├── tag-service.ts
│   │   │   ├── transaction-service.ts
│   │   │   └── transfer-service.ts
│   │   ├── utils/
│   │   │   ├── model-to-account.ts
│   │   │   ├── model-to-category.ts
│   │   │   ├── model-to-tag.ts
│   │   │   └── model-to-transfer.ts
│   │   ├── index.ts
│   │   ├── migrations.ts
│   │   └── schema.ts
│   ├── hooks/
│   │   ├── exchange-rates-editor.reducer.ts
│   │   ├── use-balance-before.ts
│   │   ├── use-boolean.ts
│   │   ├── use-color-scheme.ts
│   │   ├── use-location-permission-status.ts
│   │   ├── use-navigation-guard.ts
│   │   ├── use-notification-permission-status.ts
│   │   ├── use-notification-sync.ts
│   │   ├── use-recurring-rule.ts
│   │   ├── use-recurring-transaction-sync.ts
│   │   ├── use-retention-cleanup.ts
│   │   ├── use-scroll-into-view.ts
│   │   └── use-time-reactivity.ts
│   ├── i18n/
│   │   ├── translation/
│   │   │   ├── ar.json
│   │   │   └── en.json
│   │   ├── config.ts
│   │   └── language.constants.ts
│   ├── schemas/
│   │   ├── accounts.schema.ts
│   │   ├── categories.schema.ts
│   │   ├── tags.schema.ts
│   │   └── transactions.schema.ts
│   ├── services/
│   │   ├── auto-confirmation-service.ts
│   │   ├── currency-registry.ts
│   │   ├── exchange-rates.ts
│   │   ├── index.ts
│   │   └── pending-transaction-notifications.ts
│   ├── stores/
│   │   ├── android-sound.store.ts
│   │   ├── app-lock.store.ts
│   │   ├── button-placement.store.ts
│   │   ├── exchange-rates-preferences.store.ts
│   │   ├── language.store.ts
│   │   ├── letter-emoji.store.ts
│   │   ├── money-formatting.store.ts
│   │   ├── notification.store.ts
│   │   ├── pending-transactions.store.ts
│   │   ├── profile.store.ts
│   │   ├── theme.store.ts
│   │   ├── toast-style.store.ts
│   │   ├── toast.store.ts
│   │   ├── transaction-item-appearance.store.ts
│   │   ├── transaction-location.store.ts
│   │   ├── transaction-sheet-controls.store.ts
│   │   ├── transfers-preferences.store.ts
│   │   ├── trash-bin.store.ts
│   │   └── upcoming-section.store.ts
│   ├── styles/
│   │   ├── theme/
│   │   │   ├── schemes/
│   │   │   │   ├── catppuccin.ts
│   │   │   │   ├── minty.ts
│   │   │   │   └── standalone.ts
│   │   │   ├── base.ts
│   │   │   ├── colors.ts
│   │   │   ├── factory.ts
│   │   │   ├── index.ts
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
│   │   ├── budgets.ts
│   │   ├── categories.ts
│   │   ├── currency.ts
│   │   ├── goals.ts
│   │   ├── loans.ts
│   │   ├── new.ts
│   │   ├── scroll-into-view.ts
│   │   ├── tags.ts
│   │   ├── transaction-filters.ts
│   │   ├── transactions.ts
│   │   └── transfers.ts
│   └── utils/
│       ├── account-types-list.ts
│       ├── file-icon.ts
│       ├── format-file-size.ts
│       ├── icon-helpers.ts
│       ├── is-image-url.ts
│       ├── is-single-emoji-or-letter.ts
│       ├── is-valid-icon-name.ts
│       ├── logger.ts
│       ├── number-format.ts
│       ├── open-file.ts
│       ├── parse-math-expression.ts
│       ├── pending-transactions.ts
│       ├── recurrence.ts
│       ├── string-utils.ts
│       ├── theme-utils.ts
│       ├── time-utils.ts
│       ├── toast.ts
│       └── transaction-list-utils.ts
├── .gitignore
├── app.json
├── babel.config.js
├── biome.json
├── CLAUDE.md
├── eas.json
├── expo-env.d.ts
├── index.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── skills-lock.json
├── STRUCTURE.md
└── tsconfig.json

```
