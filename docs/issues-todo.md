# Project Issue Tracker

> Code review date: 2026-03-24 | Files reviewed: ~752
> Legend: 🔴 CRITICAL · 🟠 HIGH · 🟡 MEDIUM · 🟢 LOW

---

## 🟡 MEDIUM (29 issues)

- [ ] `resetToDefaults` / `showProgressBar` mismatch in toast-style store *(also HIGH H-S3)*
- [ ] Bill splitter "Generate Loans" only generates loan for `debtors[0]` despite plural label · `src/app/settings/bill-splitter/summary.tsx` line 206
- [ ] `observeBudgets` fetches join rows imperatively (non-reactive) — account/category link changes don't update budget list · `src/database/services/budget-service.ts`
- [ ] `number-format.ts` memoization cache unbounded — grows forever in long sessions · `src/utils/number-format.ts`
- [ ] `ReorderableListV2` index key *(also HIGH H-C2)*
- [ ] Missing `Stack.Screen` entries for `goals/[goalId]/index` and `budgets/[budgetId]/index` — title flashes default · `src/app/_layout.tsx`
- [ ] `UnistylesRuntime.setRootViewBackgroundColor` called at render time — side effect in concurrent-mode render body · `src/app/_layout.tsx` lines 31–35
- [ ] `unreachable null guard after prop destructure in `accounts/[accountId]` and `categories/[categoryId]` screens *(coupled to H8)*
- [ ] `setDirection` in language store doesn't sync `I18nManager` or `i18n` · `src/stores/language.store.ts` lines 72–79
- [ ] `unistyles.ts` manually parses Zustand persist JSON format — brittle if Zustand changes its serialization shape · `src/styles/unistyles.ts` lines 28–43
- [ ] `observeBudgetSpent` uses `from([0])` instead of `of(0)` — unexpected completion signal · `src/database/services/budget-service.ts` line 393
- [ ] Transaction schema `title`/`description`/`location` fields have no `.max()` length constraint · `src/schemas/transactions.schema.ts`
- [ ] `colorSchemeName` and `icon` fields unconstrained in budget/goal schemas · `src/schemas/budgets.schema.ts`, `src/schemas/goals.schema.ts`
- [ ] `isSingleEmojiOrLetter` returns true for strings containing an emoji, not just single-grapheme strings · `src/utils/is-single-emoji-or-letter.ts`
- [ ] `CategoryList` filters data without `useMemo` — re-filters on every parent render · `src/components/categories/category-list.tsx` lines 133–138
- [ ] `GoalCardInner` dead `isLoading` check (always false) · `src/components/goals/goal-card.tsx` line 27
- [ ] `ActionItem` Pressable has no press visual feedback — pressed style commented out · `src/components/action-item.tsx` lines 79–82
- [ ] Hardcoded San Francisco fallback coordinates for GPS failure in location picker · `src/components/transaction/location-picker-modal.tsx` line 151
- [ ] Inconsistent MMKV instance ID naming across stores (no prefix vs. `flow-` vs. dot-notation)
- [ ] `_shakeSubscription` stored in persisted store interface — non-serializable, `partialize` is the only protection · `src/stores/money-formatting.store.ts`
- [ ] `mountedRef` shared across two `useEffect`s in `use-stats.ts` — race condition on rapid dep changes
- [ ] `use-stats.ts` dynamic `require()` *(also HIGH H12)*
- [ ] `destroyAllDeletedTransactionMode` dead guard removes count decrement from all soft-deleted transactions *(also HIGH H-DB5)*
- [ ] `RECURRING_EXTENSION_KEY` in model file is private — format contract invisible to service layer · `src/database/models/recurring-transaction.ts` line 4
- [ ] Denormalized `transaction_count` on Category/Tag adjusted in 8+ places — divergence likely after H-DB5 · multiple service files
- [ ] `autoPurgeTrash` parses retention string with `parseInt(value.split(" ")[0])` — fragile string parsing · `src/database/services/transaction-service.ts` line 1004
- [ ] `RecurringTransactionModel` JSON getters throw on malformed data — inconsistent with other model getters that try/catch
- [ ] `toGoalsObservable` fetches all `goal_accounts` rows regardless of active goal set — inefficient for users with many archived goals
- [ ] `use-recurring-transaction-sync.ts` two separate async chains share one catch — attribution of errors is lost

---

## 🟢 LOW (17 issues)

- [ ] Large commented-out code blocks in `src/styles/theme/registry.ts` and `utils.ts`
- [ ] `ProfileSection` redundant `paddingBottom` inside `paddingVertical`
- [ ] Missing `displayName` on memoized `IconItem` component
- [ ] Dead `footer = null` variable in `CategoryList` · `src/components/categories/category-list.tsx` line 128
- [ ] `matchFont` called at module level in `use-chart-font.ts` before Skia is ready
- [ ] `use-notification-sync.ts` store subscription could use Zustand v5 `subscribe` overload with selector
- [ ] `stats-service.ts` fetches all accounts and categories unconditionally — should filter by IDs present in result set
- [ ] `autoPurgeTrash` fragile string parsing *(also MEDIUM)*
- [ ] `AccountModel.setColorScheme` and similar helpers bypass WatermelonDB write-tracking if called outside `update()`
- [ ] No service-level error boundaries for `database.get()` collection access failures
- [ ] `pending-transactions.store.ts` `getUpdateDateUponConfirmation` getter anti-pattern — bypasses selector memoization
- [ ] `money-formatting.store.ts` shake detection only activates privacy mode, never deactivates — worth a comment
- [ ] `onboarding/index.tsx` `goToPage` double-sets page state + PagerView imperatively — can drift · `src/app/onboarding/index.tsx`
- [ ] Commented-out `ListHeaderComponent` JSX in `names.tsx` · `src/app/settings/loans`
- [ ] `transaction/[id].tsx` `presentation: "fullScreenModal"` set in runtime callback instead of static options

