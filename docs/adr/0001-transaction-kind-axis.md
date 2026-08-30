# 1. A dedicated `kind` column for transaction role

Date: 2026-08-30

## Status

Accepted

## Context

The transaction form is being reshaped around a single "what role does this
entry play" choice with six values: `default`, `upcoming`, `subscription`,
`repetitive`, `lent`, `borrowed`.

The `transactions` table already has a `subtype` column
(`recurring | one-time | refund | loan_borrowed | loan_repayment | loan_lent |
loan_received`) plus an `is_pending` flag and a `loan_id` FK. Between them they
already encode most of the new values indirectly: `recurring` ≈ repetitive,
`is_pending` ≈ upcoming, `loan_id` + `loans.loan_type` ≈ lent/borrowed. So the
role is currently spread across three mechanisms and is not directly queryable
or displayable without joins and derivation.

Options considered:

1. **Overload `subtype`** — add `subscription`, keep `recurring` for repetitive,
   keep the `loan_*` values, keep deriving `upcoming` from `is_pending`.
   Cheapest migration. But the role stays split across `subtype` + `is_pending` +
   `loan_id`, `subtype` keeps mixing orthogonal concerns (refund is an expense
   flavour, not a role), and every consumer keeps re-deriving the same thing.
2. **New `kind` column** as the single source of truth for role; `subtype`
   shrinks to just `refund`; `is_pending` and `loan_id` become consequences of
   `kind`, not inputs to it.

## Decision

Add `transactions.kind TEXT NOT NULL DEFAULT 'default'` with a column-level
CHECK listing the six values, via `ALTER TABLE ADD COLUMN` (additive, no table
rebuild — live users, no server backup). Backfill `kind` from the existing
`subtype` / `is_pending` / `loan_id` signals in migration `0001`. Stop writing
the non-`refund` `subtype` values; the existing `subtype` CHECK is left loose
rather than rebuilding the table to tighten it (CHECK is enforced only on
write).

`type` (expense/income/transfer) stays as its own axis — it is genuinely
orthogonal (a subscription is an expense; a Collected repayment is income).

## Consequences

- One column answers "what is this entry"; list items, filters and stats read it
  directly with no join.
- Every read model, mapper, the zod schema, the ledger service and the
  data-management snapshot must add the field — a wide but mechanical change,
  done once.
- The migration is additive (`ADD COLUMN` + backfill `UPDATE`s). It is still
  forward-only and runs on user devices at startup, hence this record, but it
  avoids the risk of a full table rebuild.
- The `subtype` column keeps a CHECK that lists values we no longer write. This
  is deliberate — tightening it would require the rebuild we are avoiding.
- `is_pending` is now derived from `kind = 'upcoming'` on write; the two must not
  drift. `confirmTransaction` resets `kind` to `default` when it clears
  `is_pending`.

## State model

```
kind axis (transaction):

              ┌─────────┐
    ┌─────────│ default │◀────────┐
    │         └────┬────┘         │ confirm (Mark paid / deposited)
    │              │              │
    │        set kind in form     │
    │   ┌──────────┼──────────┐   │
    ▼   ▼          ▼          ▼   │
 upcoming   subscription  repetitive
    │        (recurring rule spawns instances;
    │         future instances is_pending=1,
    │         kind preserved)
    └──────────────────────────────┘

 lent / borrowed  ── open one-time loan (opening entry) ──▶
       │
       ├─ Collect All / Settle All ─────▶ closed        (progress ≥ 1)
       │
       └─ Partially Collect / Settle ──▶ long_term loan (0 < progress < 1)
                                          └─ further repayments ─▶ completed

edit locks: once a transaction is loan-linked, kind / type / loanId are
immutable through the transaction form; recurring instances detach from their
rule if their kind is changed away from subscription/repetitive.
```

`type` (expense/income/transfer) is the orthogonal axis and does not change
after creation for loan-linked or recurring rows.
