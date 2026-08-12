# 02 — Fix empty-currency crash in amount input

**What to build:** The shared amount input asks the currency registry for decimal places on every render, and the registry throws on an unknown/empty code — with no error boundary anywhere, the throw blanks the whole screen. New budget and goal screens start with an empty currency, and new loan starts empty until an account is picked. Fix the registry to fall back safely instead of throwing (or the input to guard), so all three create screens render with no currency selected.

**Blocked by:** 01 — Fix app crash when creating loan, budget, or goal

**Status:** ready-for-agent

- [ ] Budget create screen renders with no currency selected
- [ ] Goal create screen renders with no currency selected
- [ ] Loan create screen renders before account picked, and after picking
- [ ] Transaction form (which passes a blocked fallback currency) still renders normally