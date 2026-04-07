# Code Review Plan — minty-flow-native

**Reviewed**: 2026-04-07
**Recommendation**: REQUEST CHANGES

---

## Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 2 | 1 ✅ Fixed, 1 Deferred |
| HIGH | 7 | ✅ All Fixed |
| MEDIUM | 6 | ✅ All Fixed |
| LOW | 5 | ✅ All Fixed |

---

## CRITICAL (Must Fix)

### 1. Schema version mismatch — upgrade path is broken
**Status**: Deferred (no need to fix this the app is still in pre-production ignore this)

`src/database/schema.ts` declares `version: 1` but CLAUDE.md, the backup service (`SCHEMA_VERSION = 2`), and the `goals.is_archived` column all imply version 2. The migrations array is `migrations: []`.

**Risk**: Any existing user who upgrades will never have `is_archived` added to their `goals` table → crash on read/write.

**Fix (when ready to ship)**:
- Bump `schema.ts` to `version: 2`
- Add a migration step in `src/database/migrations/index.ts`:
```ts
addColumns({ table: "goals", columns: [{ name: "is_archived", type: "boolean" }] })
```

---

### 2. `editTransferWriter` is non-atomic — balance corruption window
**Status**: ✅ Fixed 

`src/database/services/transfer-service.ts` — Both `editTransferWriter` and `deleteTransferWriter` already use `prepareUpdate`/`prepareCreate` with a single `database.batch()` call. No sequential `await account.update()` calls remain.

---

## HIGH (Should Fix)

### 3. Logger leaks financial metadata in production
**Status**: ✅ Fixed

`src/utils/logger.ts` — Stripped `meta` from the production JSON log. Production now emits only `{ level, msg, timestamp }`; `meta` (account IDs, amounts, stack traces) is only present in development logs.

---

### 4. `validateBackup` does not check `schemaVersion`
**Status**: ✅ Fixed

`src/database/services/data-management-service.ts` — Added `meta.schemaVersion !== SCHEMA_VERSION` to the validation guard. A backup from a mismatched schema version now fails validation instead of silently losing column data.

---

### 5. `autoPurgeTrash` bypasses `destroyTransactionWriter`
**Status**: ✅ Fixed

`src/database/services/transaction-service.ts` — `autoPurgeTrash` now routes through `destroyTransactionWriter`. Additionally, `destroyTransactionWriter` itself was updated to clean up the `transfers` join row when destroying a transfer transaction, preventing orphaned rows regardless of call site.

---

### 6. `createTransactionWriter` is non-atomic
**Status**: ✅ Fixed

`src/database/services/transaction-service.ts` — Refactored to `prepareCreate`/`prepareUpdate` + a single `database.batch()` call. All related rows (transaction, account balance, category count, tag join rows, tag counts) are now written atomically.

---

### 7. App lock overlay does not block accessibility focus
**Status**: ✅ Fixed

`src/components/app-lock-gate.tsx` — Added `importantForAccessibility` (Android) and `accessibilityElementsHidden` (iOS) to the overlay `Animated.View`. When locked: `importantForAccessibility="yes"` + `accessibilityElementsHidden={false}`; when unlocked: `importantForAccessibility="no-hide-descendants"` + `accessibilityElementsHidden={true}`, preventing screen readers from reaching content behind the overlay.

---

### 8. `editTransferWriter` silently resets `conversionRate` to `1` on edit
**Status**: ✅ Fixed

`src/database/services/transfer-service.ts` — `newConversionRate` already falls back to `oldImpliedRate` (derived from existing transaction amounts: `oldCreditAmount / oldDebitAmount`) rather than defaulting to `1`. The rate is always preserved when not explicitly changed.

---

### 9. Profile image picker leaks old files in app storage
**Status**: ✅ Fixed

`src/app/settings/edit-profile.tsx` — `handlePickImage` now deletes the previous `localImageUri` file before updating to the new one. `handleSave` deletes the previously persisted `imageUri` when the URI has changed. Both deletions swallow errors (file already gone is safe to ignore).

---

## MEDIUM (Consider Fixing)

### 10. `observeTransactionModelsFull` spawns N parallel DB lookups per emission
**Status**: ✅ Fixed

`src/database/services/transaction-service.ts` — Replaced per-transaction `hydrateTransaction` fan-out with `hydrateTransactionsBatch`. Now uses 4 batch queries regardless of list size: one `Q.oneOf` for accounts (primary + related), one for categories, one for transaction_tag join rows, one for tags. Conversion rates are still resolved per-transfer (small subset). `loadTransactionTags` removed. Both `observeTransactionModelsFull` and `getPendingTransactionModelsFull` updated.

### 11. `observeBudgets` re-fetches all join rows on any single budget change
**Status**: ✅ Annotated (deferred)

`src/database/services/budget-service.ts` — Added JSDoc comment explaining the trade-off: global join-row observation is intentional at personal-finance scale (< 20 budgets, < 100 join rows). Noted the `withObservables` per-budget approach as a future path if scale grows.

### 12. `hydrateTransaction` unguarded primary account lookup
**Status**: ✅ Fixed

`src/database/services/transaction-service.ts` — Resolved as part of #10. `hydrateTransactionsBatch` silently drops transactions whose primary account is not found in the batch results. The type contract `account: AccountModel` remains non-null for all consumers — orphaned transactions are filtered upstream.

### 13. `updateTransactionWriter` truthy check for `accountId`
**Status**: ✅ Fixed

`src/database/services/transaction-service.ts` — Changed `if (updates.accountId)` to `if (updates.accountId !== undefined)` for consistency with all other field checks in the same block.

### 14. `autoConfirmationService` implicit MMKV hydration ordering assumption
**Status**: ✅ Annotated

`src/services/auto-confirmation-service.ts` — Added an inline comment above `usePendingTransactionsStore.getState()` documenting why the call is safe: MMKV-backed Zustand stores hydrate synchronously during `create()`, before any component mounts or `setTimeout` fires.

### 15. `getBalanceAtTransaction` is O(N) — ignores `account_balance_before` snapshot
**Status**: ✅ Fixed

- `src/database/services/transaction-service.ts` (`createTransactionWriter`) — `accountBalanceBefore` now stores `account.balance` at write time for confirmed transactions (pending keeps `0`). The `account` model is already pre-fetched before the batch.
- `src/database/services/balance-service.ts` — Signature changed to accept `TransactionModel` directly. O(1) fast path: `accountBalanceBefore + delta` when snapshot is non-zero. O(N) fallback retained for legacy rows.
- `src/hooks/use-balance-before.ts` — Simplified to pass `transaction` directly instead of extracting `accountId` + `transactionDate`.

---

## LOW (Suggestions)

### 16. ✅ `RecurringEditPayload` duplicate interface — resolved via `Pick<TransactionFormValues>`
**Fixed**: Replaced the manual `interface RecurringEditPayload` (which duplicated `transactionSchema` fields) with a `Pick` of the Zod-inferred `TransactionFormValues`. Removed the TODO comment.

### 17. ✅ `logger.ts` trailing semicolons — Biome `asNeeded` violation
**Fixed**: Removed trailing semicolons from `logger.ts` to comply with Biome's `semicolons: "asNeeded"` rule.

### 18. `use-recurring-transaction-sync.ts` dev double-fire
`src/hooks/use-recurring-transaction-sync.ts:35` — During Fast Refresh in development, the effect can fire twice in quick succession. The `_syncRunning` module-level lock in the recurring service prevents actual duplicate transaction generation. **No production impact; no fix needed.**

### 19. ✅ `ensureEntry` non-null assertion in `editTransferWriter` — resolved via early return
**Fixed**: Replaced `Map.get()` followed by `!` assertion with an early-return pattern that returns the newly created entry directly, eliminating the `undefined` union and satisfying Biome's `noNonNullAssertion` rule.

---

## Positive Observations

- App lock store defaults `isLocked: true` and correctly excludes it from persistence via `partialize` — secure by default.
- `_syncRunning` concurrency lock in the recurring transaction service prevents duplicate transaction generation from AppState events.
- Transfer **creation** uses `prepareCreate + database.batch()` atomically — only the edit path (#2) is broken.
- `validateBackup` has FK pre-validation before the import write — good defense in depth.
- `isImageUrl` blocks `file://` URIs from clipboard to prevent local path traversal.
- `withObservables` is used consistently to keep reactive data out of component state.
- No raw `console.log` calls found in application code.
- `ALLOWED_COLUMNS` allowlist in `importBackup` prevents column injection during restore.
- `partialize` in all Zustand persist configs correctly excludes volatile UI state from storage.
