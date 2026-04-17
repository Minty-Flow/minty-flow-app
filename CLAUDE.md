# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Minty Flow is a local-first personal finance React Native app built with Expo SDK 55 (New Architecture enabled). Targets Android & iOS (portrait only). Uses pnpm as package manager.

## Commands

```bash
pnpm android          # Run on Android emulator/device (dev build)
pnpm ios              # Run on iOS simulator/device (dev build, macOS only)
pnpm prebuild         # Generate ios/ and android/ native projects (required first time or after native dep changes)
pnpm lint             # Biome check
pnpm lint:fix         # Biome check + auto-fix
pnpm types            # tsc --noEmit (type check only)
pnpm structure        # Regenerate STRUCTURE.md
pnpm unused-styles    # Find unused unistyles StyleSheets
pnpm check-i18n-keys  # Find missing i18n translation keys
```

**Important:** Native modules (WatermelonDB, MMKV) require a dev build — `pnpm start` with Expo Go will not work.

**Pre-commit hook** (`husky`): automatically runs `pnpm structure`, `pnpm lint:fix` (and git-stages fixes), then `pnpm types`. All three must pass.

## Architecture

### Navigation (Expo Router v3)

File-based routing under `src/app/`. The `~/` path alias maps to `src/`.

- **4 tabs**: Home, Stats, Accounts, Settings — driven by a custom `PagerView`-based tab layout (`src/app/(tabs)/_layout.tsx`), **not** `@react-navigation/bottom-tabs`
- **FAB** in the tab bar expands to income / expense / transfer options
- Transaction form lives at `src/app/transaction/[id].tsx` as a `fullScreenModal`; `id="new"` means create, otherwise edit
- `NewEnum.NEW = "new"` sentinel (`src/types/new.ts`) is used throughout for create-vs-edit route params

Root providers (in order): `KeyboardProvider` → `GestureHandlerRootView` (keyed by RTL state) → `TooltipProvider` → `Stack`. `AppLockGate` and `ToastManager` render outside the Stack.

### Database (WatermelonDB)

DB name: `minty_flow_db` | Schema version: 2 | JSI adapter enabled via `plugins/withWatermelonDBJSI.js`

- Schema defined in `src/database/schema.ts`
- Models in `src/database/models/` (one file per table)
- Services in `src/database/services/` — functional, one service per model, all re-exported from the `index.ts` barrel
- Model→plain-object mappers in `src/database/utils/`
- Transfer records create **two** transaction rows (both have `is_transfer: true`) linked by a shared `transfer_id` UUID, plus one row in the `transfers` table
- Recurring transactions are RRULE-based templates in `recurring_transactions`; `use-recurring-transaction-sync` hook spawns instances on app foreground

### Theming (react-native-unistyles v3)

All styles use the `StyleSheet.create((t) => ...)` callback form — never plain `StyleSheet.create({})`.

- Theme definition: `src/styles/theme/` — `factory.ts` builds theme objects, `registry.ts` exports `ALL_THEMES`, color schemes in `schemes/` (`minty.ts`, `catppuccin.ts`, `standalone.ts`)
- Active theme key type: `ThemeKey = keyof typeof ALL_THEMES`
- Default theme: `coastalTrim`
- Unistyles configured in `src/styles/unistyles.ts`, reads initial theme from MMKV on startup
- Key color tokens: `theme.colors.primary`, `.secondary`, `.surface`, `.onSurface`, `.customColors.income`, `.customColors.expense`
- Co-located style files named `*.styles.ts`

### State Management (Zustand v5 + MMKV)

All stores in `src/stores/`. Stores persist to MMKV where needed. Key stores:

| Store | Purpose |
|---|---|
| `theme.store.ts` | Active theme, persisted |
| `language.store.ts` | Language code + RTL state; syncs i18n & `I18nManager` |
| `money-formatting.store.ts` | Number format prefs, mask-on-shake |
| `toast.store.ts` | Toast queue |
| `app-lock.store.ts` | Biometric/PIN gate |
| `transaction-sheet-controls.store.ts` | Transaction form UI state |

### i18n (i18next + react-i18next)

Languages: English (`en.json`), Arabic (`ar.json`) in `src/i18n/translation/`.
Translation keys are typed — `TranslationKey` is derived from the shape of `en.json`.
Usage: `const { t } = useTranslation()` → `t("some.nested.key")`.
RTL layout is driven by `useLanguageStore` — `PagerView` and `GestureHandlerRootView` are re-keyed when RTL changes.

### Budgets

Budgets track spending against a limit for a given period. Each budget links to accounts and categories via join tables.

- Schema: `budgets`, `budget_accounts`, `budget_categories` (many-to-many joins)
- Models: `src/database/models/budget.ts`, `budget-account.ts`, `budget-category.ts`
- Service: `src/database/services/budget-service.ts` — full CRUD + reactive queries
  - `observeBudgetSpent(accountIds, categoryIds, period, startDate, endDate)` computes total expense transactions within the period window reactively; filters out transfers, pending, and deleted transactions
  - Period types: `daily | weekly | monthly | yearly | custom` (`BudgetPeriodEnum` in `src/types/budgets.ts`); `custom` period requires `startDate` + `endDate` (enforced by zod `superRefine` in `budgets.schema.ts`)
  - `alert_threshold` (1–100%) is stored and surfaced in `BudgetCard`; a warning toast fires once per mount when `spent / limit >= alertThreshold / 100`
  - `isActive` toggle in edit form (Switch row, defaults to `true`); inactive budgets show a gray "Disabled" badge in `BudgetCard` and are sorted to the bottom of the list; the toggle appears **below** the alert threshold input in the form
  - `duplicateBudget(budget)` in `budget-service.ts` clones a budget (name prefixed "Copy of ", `isActive=true`) and re-creates join rows
- Mapper: `src/database/utils/model-to-budget.ts` — takes `accountIds[]` and `categoryIds[]` as args (fetched from join tables by the service)
- Screens: `src/app/settings/budgets/index.tsx` (list) + `src/app/settings/budgets/[budgetId]/index.tsx` (detail: transactions, progress, period) + `src/app/settings/budgets/[budgetId]/modify.tsx` (create/edit)
- Components: `src/components/budgets/budget-card.tsx`, `src/components/budgets/budget-modify/`
- **Known gaps**: Rolling period windows (`daily`/`weekly`/`monthly`/`yearly`) are computed once at subscribe time. If the app is left open past midnight, the window is stale until the component remounts or the app returns to foreground.

### Goals

Goals track savings progress toward a target amount. Each goal links to accounts via a join table; progress is computed live from linked account transactions.

- Schema: `goals`, `goal_accounts` (many-to-many join)
- Models: `src/database/models/goal.ts`, `goal-account.ts`
- Service: `src/database/services/goal-service.ts` — full CRUD + reactive queries
  - `observeGoalTransactionProgress(accountIds)` sums transactions linked to goal accounts reactively — this is the live progress.
  - `isCompleted` is **not** stored on the `Goal` domain type — it is computed as `progress >= 1` wherever needed in UI. The 
  - `isArchived` flag added in schema v2 — archive/unarchive via edit form button + confirm modal, archived goals visible at `settings/goals/archived`
- Mapper: `src/database/utils/model-to-goal.ts` — takes `accountIds[]` as arg (fetched from join table by the service)
- Screens: `src/app/settings/goals/index.tsx` (list) + `src/app/settings/goals/[goalId]/index.tsx` (detail: transactions, progress, type badge) + `src/app/settings/goals/[goalId]/modify.tsx` (create/edit) + `src/app/settings/goals/archived.tsx` (archived list)
- Components: `src/components/goals/goal-card.tsx`, `src/components/goals/goal-modify/`

### Loans

Loans track money lent to others (LENT) or borrowed from others (BORROWED). Each loan links to a single account and category via direct foreign keys — no join tables.

- Schema: `loans` table (`account_id`, `category_id` direct FK columns)
- Model: `src/database/models/loan.ts`
- Service: `src/database/services/loan-service.ts` — full CRUD + reactive queries
  - `observeLoanPaymentProgress(loanId, loanType)` sums only **repayment** transactions — LENT counts income txs (money received back from borrower), BORROWED counts expense txs (repayments made to lender). The initial cash-flow transaction has the opposite type and is naturally excluded.
  - `observeLoans()` JS-sorts by due_date ascending (nulls last), then by name
  - `observeLoanTransactions(loanId)` for the detail page transaction list
- Mapper: `src/database/utils/model-to-loan.ts`
- Screens: `src/app/settings/loans/index.tsx` (list + All/Lent/Borrowed filter chips) + `src/app/settings/loans/[loanId]/index.tsx` (detail: progress bar, type/overdue/completed badges, collect/settle button, swipeable transaction list) + `src/app/settings/loans/[loanId]/modify.tsx` (create/edit)
- Components: `src/components/loans/loan-card.tsx`, `src/components/loans/loan-action-modal.tsx`, `src/components/loans/loan-modify/`
- **Loan creation** automatically creates an initial cash-flow transaction: expense for LENT (money leaving the account), income for BORROWED (money arriving)
- **Collect/Settle button**: on detail page, opens `LoanActionModal` (centered fade modal) with:
  - "Collect All" / "Settle All" — creates a repayment transaction directly for the full remaining amount
  - "Partially Collect" / "Partially Settle" — navigates to the transaction form prefilled with `accountId`, `categoryId`, and `loanId`
- **Category picker** in the loan form is filtered by loan type: LENT → expense categories (money going out); BORROWED → income categories (money coming in). Switching type resets the selected category.
- `isOverdue` is computed in the mapper as `dueDate < today && progress < 1`

### Forms

`react-hook-form` + `zod` v4 + `@hookform/resolvers`. Form schemas live in `src/schemas/`.

### Component Conventions

- UI primitives in `src/components/ui/`: `Button`, `Text`, `View`, `Pressable`, `Input`, `Switch`, `Chips`, `Toast`, `Tooltip`, `IconSvg`, `EmptyState`
- Feature components grouped by domain: `accounts/`, `categories/`, `tags/`, `transaction/`, `theme/`
- Complex components use a directory with `index.ts` barrel, `*.styles.ts`, `types.ts`, and split sub-files
- `ActionItem` (`src/components/action-item.tsx`) is the standard settings-row component

### Linting

Biome (`biome.json`). Import order: packages → blank line → aliases (`~/`) → blank line → relative paths. Semicolons: as-needed. `console` calls are an error (use `src/utils/logger.ts`).
