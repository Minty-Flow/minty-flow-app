# 05: Rules management screen + backlog apply

**What to build:** A screen to see, edit, reorder, enable/disable and delete
auto-categorisation rules, and a one-off action to apply the rules to existing
uncategorised transactions.

**Blocked by:** 04

**Status:** ready-for-agent

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
