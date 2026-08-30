# Context

Glossary of domain terms for Minty Flow. Definitions only — no implementation
detail.

## Transaction

A single ledger entry against one account. Amount is stored in integer minor
units. Its meaning is fixed by two independent axes plus one flag:

- **type** — `expense` | `income` | `transfer`. The cash-flow direction.
- **kind** — `default` | `upcoming` | `subscription` | `repetitive` | `lent` |
  `borrowed`. What role the entry plays. Orthogonal to type (a subscription is
  still an expense; a Collected loan repayment is still income).
- **refund** — an expense entry that increases the balance (a returned
  purchase). The only surviving `subtype` value.

### kind values

- **default** — an ordinary, already-happened entry.
- **upcoming** — an unpaid/planned entry. Does **not** count toward account
  balance or stats until it is confirmed ("Mark paid" / "Mark deposited"), at
  which point it becomes `default`.
- **subscription** — a recurring entry the user thinks of as a subscription
  (Netflix, rent). Same recurrence engine as `repetitive`; the distinction is
  presentation only.
- **repetitive** — a recurring entry that is not framed as a subscription.
- **lent** — money the user lent out. Expense-shaped. Opens a **one-time loan**.
- **borrowed** — money the user borrowed. Income-shaped. Opens a **one-time
  loan**.

## Recurrence

A rule that spawns transaction instances over time. Expressed as **interval +
unit**: "every `N` `day|week|month|year`". Ends either **Forever** or on an
**until** date. There is no fixed frequency vocabulary
(daily/weekly/biweekly/…) — those are just `interval`/`unit` combinations.

## Loan

Money owed in one direction, tracked to repayment.

- **loan type** — `lent` (owed to the user) | `borrowed` (owed by the user).
- **term** — `one_time` | `long_term`.
  - **one-time loan** — created from the transaction form via the `lent` /
    `borrowed` kind. The transaction being entered is its **opening entry**.
    Stays open until a single closing action settles it in full.
  - **long-term loan** — created on the loans screen, or a one-time loan that
    received a **partial** repayment (which promotes it). Tracks progress
    against the principal.
- **opening entry** — the transaction that establishes a loan's principal and
  moves the money.

### Loan repayment actions

- **Collect** — repayment toward a `lent` loan (money comes back to the user;
  income-shaped). "Collect All" closes a one-time lent loan.
- **Settle** — repayment toward a `borrowed` loan (user pays it back;
  expense-shaped). "Settle All" closes a one-time borrowed loan.
- **Paid** / **Collected** — the transaction-form top-tab labels shown when the
  entry is a repayment against an existing `borrowed` / `lent` loan
  respectively.

## Transaction form top tabs

The three-segment selector at the top of the transaction form. Normally
`Expense` / `Income` / `Transfer`. Relabels to `Lent` / `Borrowed` when the kind
is `lent`/`borrowed` with no linked loan, and to a single locked `Paid` or
`Collected` when the entry is a repayment against an existing loan.
