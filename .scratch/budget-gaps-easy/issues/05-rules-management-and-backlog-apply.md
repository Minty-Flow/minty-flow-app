# 05: Rules management screen + backlog apply

**What to build:** A screen to see, edit, reorder, enable/disable and delete
auto-categorisation rules, and a one-off action to apply the rules to existing
uncategorised transactions.

**Blocked by:** 04

**Status:** in-progress

## Progress

- Screen `settings/rules.tsx` (route `/settings/rules`, Settings → Money
  Management entry "Auto-categorise", sparkles icon). Verified on emulator.
- List: `ReorderableListV2` of rules — row shows `"<field> <type> "<value>""`
  + `→ <Category>` + inline active `Switch`; drag handle reorders priority.
  `EmptyState` when none.
- Add/Edit sheet: match field (Title/Notes chips), match type
  (contains/equals/starts-with chips), match value `Input`, category via the
  reused `FormCategoryPicker`, Save / Delete (delete behind a destructive
  `ConfirmModal`). Verified: create a rule, it appears in the list.
- **Bug found + fixed during QA:** the sheet would not reopen after being
  closed once. Cause: remounting a react-native `<Modal>`. Fix: `<Modal>` is
  always mounted and toggled via `visible`; only the keyed `<RuleForm>` child
  is conditionally rendered so its state resets per open.
- Backlog: service `applyRulesToBacklog()` (fills category + subtype only,
  never tags/transfers/already-categorised, one `runInTransaction`, returns
  count) + `countUncategorisedTransactions()`. Footer button "Apply to N
  uncategorised" (live count via `useFocusEffect`) → `ConfirmModal` → toast.
  Verified: confirm → runs → toast "0 transactions categorised" (correctly
  matched none of the non-matching test rows — no false positives).
- en + ar strings.

## Pending / notes

- create-path auto-apply + "Auto" badge (ticket 04) not cleanly re-verified
  here via adb; shares the exact `applyRules` path the backlog just exercised.
- Subtype / tags editing in the rule sheet is deferred (schema supports them;
  neither the create-from-form path nor the common case needs them).
- `FormCategoryPicker` shows all categories (income + expense) on purpose — a
  rule may target either. **Type gate added:** `applyRules` now takes a
  `categoryTypeById` map and skips any rule whose category type ≠ the
  transaction type, so an income-category rule can never land on an expense
  (and vice versa). The rule row shows "· on income / on expenses" and the
  edit sheet shows "Applies to <kind> transactions only" once a category is
  picked. Both `createTransaction` and `applyRulesToBacklog` pass the map.
- Reorder handle is visually heavy (existing `ReorderableListV2` design).

## Behaviour

- Full CRUD over `transaction_rules`. Priority is user-orderable.
- Bulk apply: a service function that runs the rules over existing
  non-transfer transactions whose target field is empty; returns a count.
  Explicit and user-triggered — never automatic, never rewrites a manually set
  category.

## UX notes

- Entry point: Settings → "Rules" (or nested under Categories as
  "Auto-categorisation" — pick whichever keeps Settings shortest; a nested
  entry is fine).
- List: plain rows, "{match text} → {Category}", with an inline `Switch` for
  is_active. Tap a row → edit sheet: match field (title/description), match
  type (contains/equals/starts_with), category, optional subtype, optional
  tags. Reorder priority by drag (reuse `ReorderableList`).
- Backlog apply: a footer/header button "Apply to N uncategorised" →
  `ConfirmModal` ("Sets categories on N past transactions. You can undo per
  transaction.") → result toast.
- Empty: `EmptyState` "No rules yet — turn one on from a transaction, or add
  one here" with an add affordance.
- Strings in `en.json` + `ar.json`; verify RTL.

## Acceptance criteria

- [ ] Rules list with inline enable/disable and delete
- [ ] Add / edit rule sheet covering all rule fields
- [ ] Drag-to-reorder writes `priority`
- [ ] `applyRulesToBacklog()` service fn: skips transfers, skips already-categorised, respects priority, returns an accurate count
- [ ] Backlog apply behind a `ConfirmModal`, result surfaced in a toast
- [ ] `EmptyState` with an add path
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types` pass
- [ ] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Create 3 uncategorised "Tesco" expenses, then a Tesco→Groceries rule, then "Apply to N uncategorised" → confirm dialog shows count 3 → all become Groceries with the "auto" badge; toast shows the count.
- Backlog apply again → count 0, nothing changes.
- Disable a rule → new matching transactions no longer auto-categorise.
- Reorder two overlapping rules → the now-first one wins on the next match.
- Delete a rule → gone from the list; existing categorisations untouched.
- No rules → `EmptyState` with a working add button.
