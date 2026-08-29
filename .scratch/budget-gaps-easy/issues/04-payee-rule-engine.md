# 04: Payee rule engine + create-from-form

**What to build:** When the user categorises a titled expense, offer to
remember it: "Always categorise "Tesco" as Groceries". Future transactions
whose title matches then get that category automatically, marked as
auto-applied so the user can tell it apart from manual choices.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

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

- [ ] `transaction_rules` + `category_source` migrations; schema types updated
- [ ] Pure `applyRules` with tests: empty-field-only, never on transfers, priority order + ties, contains/equals/starts_with, optional subtype/tags applied
- [ ] Auto-apply runs on transaction create and on manual edit-save
- [ ] Form toggle "Always categorise …" creates an active rule
- [ ] "auto" badge shown for rule-set categories; cleared on manual category change
- [ ] en + ar strings; RTL checked
- [ ] `pnpm lint`, `pnpm types`, `pnpm test` pass
