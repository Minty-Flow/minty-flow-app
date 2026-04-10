# Code Review Plan — minty-flow-native

**Reviewed**: 2026-04-10
**Recommendation**: REQUEST CHANGES

---

## Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 2 | ⚠️ 1 Deferred, 1 New |
| HIGH | 6 | ⚠️ New findings |
| MEDIUM | 8 | ⚠️ New findings |
| LOW | 4 | ⚠️ Suggestions |

---

## CRITICAL (Must Fix)

### 1. Schema version mismatch — upgrade path is broken
**Status**: Deferred (no need to fix for pre-production)

**Location**: `src/database/schema.ts:10`, `src/database/migrations/index.ts`

The schema file declares `version: 1`, but CLAUDE.md states version 2 and the backup service uses `SCHEMA_VERSION = 2`. The `goals` table has an `is_archived` column (added in v2) but no migration step exists to add it. The migrations array is empty: `migrations: []`.

**Risk**: Any user upgrading from an earlier version will never have `is_archived` added to `goals` → crash on read/write.

**Fix (when ready to ship)**:
```ts
// src/database/schema.ts
- version: 1,
+ version: 2,

// src/database/migrations/index.ts
- export default schemaMigrations({ migrations: [] })
+ export default schemaMigrations({
+   migrations: [
+     {
+       toVersion: 2,
+       steps: [
+         addColumns({
+           table: "goals",
+           columns: [{ name: "is_archived", type: "boolean" }],
+         }),
+       ],
+     },
+   ],
+ })
```

---

### 2. `confirmTransactionSync` applies balance delta without atomicity — non-atomic sequential updates
**Status**: ✅ FIXED

**Location**: `src/database/services/transaction-service.ts:451-491`

**Problem (Pre-Fix)**: The function called `t.update(...)` to flip `isPending`, then read `t.amount` and `t.type` and applied a balance delta. Multiple sequential `await` calls inside `database.write()` without batching. An unhandled error mid-loop would leave some transactions confirmed and some accounts inconsistent.

**Risk**: Data corruption. Accounts and transactions would fall out of sync — account balances updated without their transactions being marked confirmed, or vice versa.

**Solution Applied** (2026-04-10):
Refactored to the atomic pattern used in `createTransferWriter` and `editTransferWriter`:

1. All reads (transaction lookups, account fetches) now happen BEFORE entering `database.write()`
2. Inside the write, a `batchOps` array is built using `prepareUpdate` for each model
3. All operations submitted atomically with a single `await database.batch(...batchOps)` call

**Implementation**:
```ts
// Fetch all accounts before write (deduplicated by accountId)
const accountIds = [...new Set(toUpdate.map((t) => t.accountId))]
const accounts = await Promise.all(accountIds.map((id) => accountsCollection().find(id)))
const accountMap = new Map(accounts.map((a) => [a.id, a]))

const now = new Date()

return database.write(async () => {
  const batchOps: Parameters<typeof database.batch>[0] = []

  for (const t of toUpdate) {
    // Capture amount and type before prepareUpdate
    const { amount, type } = t

    batchOps.push(
      t.prepareUpdate((x) => {
        x.isPending = !shouldConfirm
        if (shouldConfirm && options.updateTransactionDate) {
          x.transactionDate = now
        }
      }),
    )

    // Balance delta applied atomically with transaction update
    const account = accountMap.get(t.accountId)
    if (account) {
      const balanceDelta = getBalanceDelta(amount, type)
      batchOps.push(
        account.prepareUpdate((a) => {
          a.balance = shouldConfirm
            ? a.balance + balanceDelta
            : a.balance - balanceDelta
        }),
      )
    }
  }

  await database.batch(...batchOps)
})
```

**Status**: Verified with `pnpm types` ✅ and `pnpm lint:fix` ✅

---

## HIGH (Should Fix)

### 3. `destroyLoan` performs sequential awaits inside a write without batching
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/loan-service.ts:179-192`

The function loops over linked transactions and calls `await tx.update(...)` individually inside `database.write()`. Each `await` is a separate operation. If one throws, previous updates may be partially applied.

**Risk**: Loan deletion partially applied — some linked transactions nullified, others not.

**Fix**:
```ts
const ops = linkedTxs.map(tx =>
  tx.prepareUpdate(t => { t.loanId = null })
)
await database.batch(...ops)
await loan.destroyPermanently()
```

---

### 4. `updateTransactionWriter` non-atomic tag and balance updates
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/transaction-service.ts:832-884`

The tag sync loop calls `await tt.destroyPermanently()` and `await tag.update(decrementCount)` sequentially. Subsequent balance adjustments issue multiple sequential `await account.update(...)` calls. None batched.

**Risk**: Partial transaction updates. Tags unlinked but balance not adjusted (or vice versa), causing inconsistent state.

**Fix**: Accumulate all `prepareUpdate`, `prepareCreate`, `prepareDestroyPermanently` operations and issue a single `database.batch()` at the end.

---

### 5. `destroyAccount` TOCTOU — new transactions created between fetch and delete
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/account-service.ts:490-501`

`getTransactionModels()` is called outside `database.write()`, then transactions are destroyed inside the write. Between the fetch and the write, recurring sync or auto-confirm could create new transactions that are missed and become orphaned.

**Risk**: Orphaned transactions referencing a non-existent account → crash on fetch.

**Fix**:
Move the `getTransactionModels` fetch inside the `database.write()` callback:
```ts
await database.write(async () => {
  const transactions = await getTransactionModels(account.id)
  for (const tx of transactions) {
    await tx.destroyPermanently()
  }
  await account.destroyPermanently()
})
```

---

### 6. `balanceService` O(N) fallback includes no guard against thousands of rows
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/balance-service.ts:39-52`

Any transaction with `accountBalanceBefore = 0` triggers a full table scan of that account's transactions. For accounts with thousands of transactions, this is expensive every time that specific transaction is viewed.

**Risk**: Performance degradation for transactions at zero-balance checkpoints.

**Fix**: Add a row-count guard or compute from the most recent non-zero snapshot instead of scanning from the beginning.

---

### 7. Recurring transaction idempotency bug — soft-deleted instances permanently suppressed
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/recurring-transaction-service.ts:127-132`

The idempotency check for duplicate generation does not filter `is_deleted = false`:
```ts
const alreadyExists = await database
  .get<TransactionModel>("transactions")
  .query(
    Q.where("recurring_id", recurring.id),
    Q.where("transaction_date", nextTs),
    // Missing: Q.where("is_deleted", false)
  )
  .fetchCount() > 0
```

**Risk**: A user deletes a pending recurring instance. The next sync finds the soft-deleted row, skips generation, and updates `lastGeneratedTransactionDate` — permanently suppressing that occurrence from ever being regenerated.

**Fix**:
```ts
Q.where("is_deleted", false),
```

---

### 8. Backup import partial writes — not transactional on failure
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/data-management-service.ts:676-699`

`importBackup` calls `insertRows()` sequentially inside `database.write()`. If any chunk fails mid-import (e.g., at `transactions` after `accounts` are written), WatermelonDB's write context does not guarantee rollback. The database is wiped at line 620 before any writes, so partial imports are possible but there's no transaction boundary.

**Risk**: A partially imported backup leaves the database with orphaned records (accounts exist but transactions missing).

**Fix**: Consider `database.unsafeResetDatabase()` on import failure, or document that import is not fully transactional.

---

### 9. `updateTransactionWriter` calls `transaction.update()` before batching — non-atomic with balance
**Status**: 🔴 NEW — Should Fix

**Location**: `src/database/services/transaction-service.ts:773-886`

Line 773 calls `await transaction.update(...)` immediately, writing to the database. Category and balance adjustments follow as separate awaits. This is not atomic.

**Risk**: Process killed or error thrown between `transaction.update()` and balance adjustment leaves transaction updated but account balance unchanged → balance/category count drift.

**Fix**: Use `transaction.prepareUpdate(...)` and accumulate all operations in a single `database.batch()`.

---

## MEDIUM (Consider Fixing)

### 10. `confirmTransactionSync` reads stale model state after sequential update
**Status**: ⚠️ Fragile Assumption

**Location**: `src/database/services/transaction-service.ts:460-474`

After `await t.update(...)`, the code reads `t.amount` and `t.type` on the same model. These fields are not changed in the updater, so this works, but it's a fragile assumption. If the updater ever also sets `amount` or `type`, the balance delta would compute from post-update values instead of pre-update values.

**Suggestion**: Add a comment documenting that `amount` and `type` are intentionally read from the pre-update model snapshot. Or refactor to pass these values explicitly:
```ts
const { amount, type } = t
ops.push(t.prepareUpdate(tx => { tx.isPending = false }))
const delta = getBalanceDelta(amount, type)
```

---

### 11. `validateBackup` lacks row-level type checking
**Status**: ⚠️ Correctness Risk

**Location**: `src/database/services/data-management-service.ts:343-395`

Validates that tables are present and are arrays, but does not validate individual row shapes. A corrupted backup with `amount: "DROP TABLE"` or `transaction_date: null` would pass validation and be written into `_raw` without type coercion.

**Risk**: Type errors at read time when imported data is consumed. Malicious backup data bypasses validation.

**Suggestion**: Add per-row type validation for critical fields:
```ts
for (const row of rows) {
  if (typeof row.id !== 'string' || !row.id) throw new Error('Invalid row: id')
  if (typeof row.amount !== 'number') throw new Error('Invalid row: amount')
  if (!isValidDate(row.transaction_date)) throw new Error('Invalid row: transaction_date')
}
```

---

### 12. `observeLoans` JS-sorts on every emission
**Status**: ⚠️ Performance

**Location**: `src/database/services/loan-service.ts:57-76`

The entire loan list is re-sorted in JavaScript on every reactive emission, including field changes that don't affect sort order. The sort runs even when the `due_date` or `name` haven't changed.

**Suggestion**: Apply `distinctUntilChanged` with a custom comparator checking loan IDs and due dates, or memoize at component level.

---

### 13. `isImageUrl` allows overly broad hostname matches
**Status**: ⚠️ Security (Low Risk)

**Location**: `src/utils/is-image-url.ts:39-43`

The check `urlObj.hostname.includes("imgur")` would also match `evil-imgur.com` or `imgur.com.attacker.net`. While HTTPS-only requirement mitigates most SSRF, the hostname check is overly permissive.

**Suggestion**:
```ts
const TRUSTED_HOSTS = ["imgur.com", "i.imgur.com", "unsplash.com", "images.unsplash.com", "www.pexels.com"]
const isKnownImageHost = TRUSTED_HOSTS.some(
  (host) => urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`)
)
```

---

### 14. Budget period "daily" and "weekly" ignore user locale for week start
**Status**: ⚠️ Localization

**Location**: `src/database/services/budget-service.ts:317-321`

`startOfWeek(now)` uses the default Sunday week start. Users in locales where weeks start on Monday (Europe, Middle East) see budgets reset on Sunday instead of Monday.

**Risk**: Incorrect budget period calculations for non-Sunday-week-start locales. The app supports Arabic/RTL, so this is real user impact.

**Suggestion**:
```ts
const weekStartsOn = getLocales()[0]?.regionCode === "US" ? 0 : 1
periodStart = startOfWeek(now, { weekStartsOn })
```

---

### 15. `edit-profile.tsx` deletes file without await
**Status**: ⚠️ Correctness

**Location**: `src/app/settings/edit-profile.tsx:109-115`

`new File(imageUri).delete()` inside `handleSave` is not awaited. The async error will never be caught by the `try/catch`.

**Risk**: Silent file deletion failures → leftover image files consuming storage.

**Suggestion**:
```ts
const handleSave = async () => {
  if (localImageUri !== imageUri && imageUri) {
    try {
      await new File(imageUri).delete()
    } catch {
      // file may already be gone — ignore
    }
  }
  // ...
}
```

---

### 16. Backup export includes soft-deleted (trashed) transactions
**Status**: ⚠️ Data Semantics

**Location**: `src/database/services/data-management-service.ts:162-168`

`generateJsonBackup()` fetches all transactions including `is_deleted = true`. Trashed transactions are included in the backup. This is correct for full-fidelity backup, but users may be surprised to find deleted transactions restored upon import (inconsistent with CSV export behavior which filters them).

**Suggestion**: Document this explicitly in the UI ("Backup includes deleted transactions in trash"), or offer an option to exclude them for consistency.

---

### 17. Schema version mismatch detection is bidirectional
**Status**: ⚠️ Design

**Location**: `src/database/services/data-management-service.ts:358-362`

The check `meta.schemaVersion !== SCHEMA_VERSION` rejects backups from older OR newer versions. A backup from schema v1 imported into schema v2 would be rejected, even though v1 data is a valid subset.

**Suggestion**: Use `meta.schemaVersion > SCHEMA_VERSION` to only block forward-incompatible imports, allowing older backups with the understanding that new columns get defaults.

---

### 18. Recurring sync calls `.getState()` on Zustand store outside React
**Status**: ⚠️ Implicit Dependency

**Location**: `src/services/auto-confirmation-service.ts:88-89`

`usePendingTransactionsStore.getState()` from a class method is correct in Zustand, but the comment acknowledges this only works because MMKV-backed stores hydrate synchronously. Changing storage to AsyncStorage would break this.

**Suggestion**: The pattern is correct; add a note that synchronous MMKV-backed storage is required.

---

### 19. Transfer balance fallback assumes current two-row convention
**Status**: ⚠️ Legacy Data

**Location**: `src/database/services/balance-service.ts:47-52`

The O(N) fallback treats `tx.type === "transfer"` as `sum + tx.amount` (signed). This assumes the current two-row convention (debit negative, credit positive). Legacy data from Flutter imports may not match.

**Suggestion**: Add a comment that this fallback assumes the current two-row signed-amount transfer convention and may be inaccurate for pre-migration data.

---

## LOW (Suggestions)

### 20. Module-level `_syncRunning` lock not resilient to Fast Refresh
**Status**: 🟢 Development Only

**Location**: `src/database/services/recurring-transaction-service.ts:222`

Module hot-reloading in React Native development can reinitialize `_syncRunning` to `false` while `synchronizeAllRecurringTransactions` is executing, removing the concurrency guard. Production is safe due to the idempotency check.

**Suggestion**: No fix needed. Documented for awareness; production behavior is correct.

---

## Positive Observations

- **Security**: Logger correctly strips `meta` in production (line 19-21), preventing financial data in crash reports.
- **Math Input Security**: `parse-math-expression.ts` implements a full recursive descent parser without `eval` or `new Function` — excellent security hygiene.
- **URI Validation**: `open-file.ts` validates URI scheme before opening (lines 17-19), blocking unexpected schemes.
- **Query Optimization**: `hydrateTransactionsBatch` uses O(4) batch queries regardless of list size — well-designed N+1 solution.
- **Transfer Atomicity**: `createTransferWriter` and `deleteTransferWriter` correctly use `prepareCreate`/`prepareUpdate` + `database.batch()`.
- **Secure Defaults**: `AppLock` store defaults `isLocked: true` before rehydration — secure by default.
- **Backup Validation**: `validateBackup` checks both `appId` and `schemaVersion`, providing meaningful rejection reasons.
- **Logging Discipline**: No `console.log/warn/error` found anywhere except in `logger.ts` — fully enforced.
- **SQL Safety**: `escapeLike` function properly escapes `%`, `_`, and `\` in LIKE patterns — prevents LIKE injection.
- **Image Loading**: `isImageUrl` enforces HTTPS-only — no `http://` loading.
- **Backup Column Firewall**: `ALLOWED_COLUMNS` allowlist prevents unknown columns in backup imports.

---

## Fixed Issues Summary

✅ **Issue #2**: `confirmTransactionSync` — Fixed 2026-04-10
- Refactored to use `prepareUpdate` + `database.batch()` for atomic updates
- All reads moved outside `database.write()`
- Accounts deduplicated in Map for efficient batch operations
- Verified with type check and linting

## Next Steps

**Priority 1** (Data Safety): Remaining issues
- Issue #1: Schema migration setup (deferred for pre-production)
- Issue #7: Recurring transaction idempotency — add `is_deleted` filter
- High priority atomicity issues (#3, #4, #6, #9)

**Priority 2** (Correctness): Fix issues #3, #4, #5, #6, #9
- Batch all database operations inside `database.write()`
- Eliminate sequential awaits
- Fix TOCTOU in `destroyAccount`

**Priority 3** (Quality): Issues #10–19
- Performance, localization, type safety improvements

---

## Mobile Testing Checklist (for confirmTransactionSync fix)

### Setup
- Run: `pnpm prebuild` (to sync native modules)
- Run: `pnpm android` (or `pnpm ios` on Mac)
- Have at least 3 test accounts with different currencies (if multi-currency support exists)

### Test 1: Pending Expense → Confirm
- [ ] Create a pending expense transaction in Account A
- [ ] Verify transaction shows "Pending" badge
- [ ] Verify Account A balance does NOT yet reflect the expense
- [ ] Confirm the transaction from the transaction detail screen
- [ ] ✅ Verify transaction is no longer pending
- [ ] ✅ Verify Account A balance correctly decreased by expense amount
- [ ] ✅ Verify transaction date is updated to "now" (if using updateTransactionDate)

### Test 2: Pending Income → Confirm
- [ ] Create a pending income transaction in Account A
- [ ] Verify Account A balance does NOT yet reflect the income
- [ ] Confirm the transaction
- [ ] ✅ Verify Account A balance correctly increased by income amount
- [ ] ✅ Verify no console errors or balance mismatches

### Test 3: Pending Transfer → Confirm
- [ ] Create a pending transfer: 100 from Account A → Account B
- [ ] Verify both accounts show pending state
- [ ] Verify neither account balance reflects the transfer yet
- [ ] Confirm the transfer
- [ ] ✅ Verify Account A balance decreased by 100 (at the exchange rate or as-is)
- [ ] ✅ Verify Account B balance increased by 100 (or equivalent if multi-currency)
- [ ] ✅ Verify BOTH transactions in the transfer pair are confirmed atomically
- [ ] ✅ Verify no orphaned "pending transfer" in either account

### Test 4: Hold (Re-pend) a Confirmed Transaction
- [ ] Create and confirm an expense in Account A
- [ ] Verify Account A balance reflects the expense (decreased)
- [ ] Hold the transaction to re-pend it
- [ ] ✅ Verify transaction is back to pending state
- [ ] ✅ Verify Account A balance is restored (reversed the expense)
- [ ] ✅ Verify re-confirming works correctly

### Test 5: Atomicity Under Load
- [ ] Create 10 pending transactions across multiple accounts
- [ ] Confirm them all in rapid succession (tap confirm on each, back, next)
- [ ] ✅ Verify all balances are correct after all confirmations
- [ ] ✅ Verify no balance drift or orphaned transactions
- [ ] ✅ Verify no crashes or console errors

### Test 6: Auto-Confirmation (Recurring)
- [ ] Set up a recurring transaction with auto-confirmation enabled
- [ ] Force app foreground or wait for next sync cycle
- [ ] ✅ Verify pending instances auto-confirm
- [ ] ✅ Verify account balances update correctly
- [ ] ✅ Verify no duplicate transactions created

### Test 7: Category Count Updates (if applicable)
- [ ] Create a pending expense in a specific category
- [ ] Verify category shows correct count in budget view (pending count, if tracked)
- [ ] Confirm the expense
- [ ] ✅ Verify category count is updated atomically with the transaction
- [ ] ✅ Verify no category count drift

### Test 8: List and Detail Screen Consistency
- [ ] Create a pending transaction
- [ ] View it in the transaction list (should show pending badge)
- [ ] Open the detail screen (should show pending state)
- [ ] Confirm from the detail screen
- [ ] ✅ Go back to the list — verify list immediately reflects confirmed state
- [ ] ✅ Reopen detail screen — verify it's confirmed
- [ ] ✅ No stale data or UI flicker

### Test 9: Performance with Large Account
- [ ] In an account with 100+ transactions, create a new pending transaction
- [ ] Confirm it
- [ ] ✅ Confirm completes within 1 second
- [ ] ✅ No lag or jank on the UI
- [ ] ✅ Balance updates smoothly

### Test 10: iOS Simulator (if Mac available)
- [ ] Run all tests 1–9 on iOS simulator
- [ ] ✅ Verify no iOS-specific issues (especially with async/await or database writes)
- [ ] ✅ Verify gesture/animation consistency

### Regression Testing
- [ ] Verify existing confirmed transactions still display correctly (no data corruption)
- [ ] Test undo/redo if implemented (should be independent of this fix)
- [ ] Test backup/restore with mixed pending/confirmed transactions
- [ ] ✅ Verify all balances are restored correctly

### Sign-Off
- [ ] All tests pass on Android
- [ ] All tests pass on iOS (if available)
- [ ] No console.log, errors, or warnings in the app log
- [ ] Database consistency verified (no orphaned rows)
