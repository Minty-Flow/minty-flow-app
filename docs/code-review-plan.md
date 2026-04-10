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
**Status**: 🔴 NEW — Must Fix

**Location**: `src/database/services/transaction-service.ts:459-474`

The function calls `t.update(...)` to flip `isPending`, then reads `t.amount` and `t.type` and applies a balance delta. Multiple sequential `await` calls inside `database.write()` without batching. An unhandled error mid-loop leaves some transactions confirmed and some accounts inconsistent.

**Risk**: Data corruption. Accounts and transactions fall out of sync — account balances are updated without their transactions being marked confirmed, or vice versa.

**Fix**:
Use `prepareUpdate` + a single `database.batch()` for all operations:
```ts
export const confirmTransactionSync = async (
  transactions: TransactionModel[],
  shouldConfirm: boolean,
): Promise<void> => {
  await database.write(async () => {
    const ops = []
    for (const t of transactions) {
      // Prepare transaction update
      ops.push(t.prepareUpdate(tx => { tx.isPending = false }))
      
      // Prepare account balance update
      if (shouldConfirm && t.isPending) {
        const delta = getBalanceDelta(t.amount, t.type)
        const account = await t.account.fetch()
        ops.push(account.prepareUpdate(a => { a.balance += delta }))
      }
    }
    await database.batch(...ops)
  })
}
```

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

## Next Steps

**Priority 1** (Data Safety): Fix issues #1, #2, #7
- Schema migration setup
- `confirmTransactionSync` atomicity
- Recurring transaction idempotency

**Priority 2** (Correctness): Fix issues #3, #4, #5, #6, #9
- Batch all database operations inside `database.write()`
- Eliminate sequential awaits
- Fix TOCTOU in `destroyAccount`

**Priority 3** (Quality): Issues #10–19
- Performance, localization, type safety improvements
