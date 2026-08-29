# 04: Payee rule engine + create-from-form

**What to build:** When the user categorises a titled expense, offer to
remember it: "Always categorise "Tesco" as Groceries". Future transactions
whose title matches then get that category automatically, marked as
auto-applied so the user can tell it apart from manual choices.

**Blocked by:** None (can start immediately).

**Status:** resolved

## Progress

- Schema: `transaction_rules` table + `transactions.category_source` column.
  Migration `drizzle/0001_add_transaction_rules.sql` (plain CREATE TABLE +
  ADD COLUMN — no `category_source` CHECK on purpose, to avoid a full
  transactions-table rebuild). `drizzle/migrations.js` updated. Verified: app
  boots and renders after the migration on the emulator.
- Types: `src/types/transaction-rules.ts`; `Transaction.categorySource`
  (optional).
- Pure `applyRules(target, rules)` in `src/utils/transaction-rules.ts` —
  ascending priority + id tie-break; only fills empty fields; skips
  transfers; first rule that matches *and* contributes wins.
- Service `transaction-rules-service.ts` — `listTransactionRules` (sync, for
  the ledger), create/update/delete/setActive/reorder.
- Read-model `transaction-rules-read-model.ts` — `useTransactionRules`.
- Wired into `createTransaction` (auto-apply on create) and `updateTransaction`
  (a manual edit-save sets `category_source = 'manual'`).
- Form: "Always categorise "{title}" like this" toggle appears after the
  category picker once a title + category are set; on save it creates a
  `title contains {title}` rule. Verified rendering on the emulator.
- Transaction item: "Auto" badge (sparkles) when `category_source = 'rule'`.
- en + ar strings.

## Pending

- Full end-to-end QA on device: create rule → create a matching uncategorised
  transaction → confirm auto-category + "Auto" badge; confirm a transfer is
  never touched; confirm a manual category change clears the badge.
- Rule management screen + backlog apply = ticket 05.

## Behaviour

- New table `transaction_rules`: id, match_field (`title | description`),
  match_type (`contains | equals | starts_with`), match_value,
  set_category_id (nullable), set_subtype (nullable), set_tag_ids (nullable
  json), priority integer, is_active (0/1), timestamps. Migration added.
  (Note: transactions have no `payee` column — matching is on `title` /
  `description`.)
- Pure `applyRules(draftTransaction, rules) -> patch`. Called by the
  ledger/transaction service on create and on manual edit-save, **only when
  the target field is empty**, **never** when `is_transfer = 1`. First match
  by ascending `priority` wins.
- Transactions gain a nullable `category_source` (`manual | rule`). A manual
  category edit sets it back to `manual`. Migration added.
- Rule creation in this ticket is limited to the one-tap toggle on the
  transaction form (full management screen is ticket 05).

## UX notes

- Creation lives where the user already is: after a category is chosen for a
  titled expense, an inline toggle row on the form — "Always categorise
  "{title}" as {Category}" — off by default, one tap. No modal, no wizard, no
  regex. Matches the form's existing toggle rows.
- Badge: a small muted "auto" chip next to the category on transaction rows and
  detail when `category_source = rule` — same visual weight as the existing
  subtype markers, not attention-grabbing. Changing the category by hand
  removes it.
- Strings in `en.json` + `ar.json`; verify RTL.

## Acceptance criteria

- [x] `transaction_rules` + `category_source` migrations; schema types updated
- [x] Pure `applyRules(draft, rules)` (no DB handle): applies only to an empty target field, never when `is_transfer = 1`, first match by ascending `priority` (deterministic on ties), supports contains/equals/starts_with, applies optional subtype/tags
- [x] Auto-apply runs on transaction create and on manual edit-save
- [x] Form toggle "Always categorise …" creates an active rule
- [x] "auto" badge shown for rule-set categories; cleared on manual category change
- [x] en + ar strings; RTL checked
- [x] `pnpm lint`, `pnpm types` pass
- [x] Manual QA section added to `QA.md`

## Manual QA (dev build)

- Add expense titled "Tesco", pick Groceries, enable the "Always categorise" toggle → a rule exists.
- Add another expense titled "Tesco Metro" (contains match) with no category → saves as Groceries, shows the "auto" badge.
- Add a transfer whose title contains "Tesco" → stays uncategorised.
- Add "Tesco" expense and manually pick Dining → rule does not override; badge absent.
- Change a rule-set category by hand → badge clears.
- Arabic → toggle row + badge translated, mirrored.
