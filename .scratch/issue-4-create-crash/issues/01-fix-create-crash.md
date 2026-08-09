# 01 — Fix app crash when creating loan, budget, or goal

**What to build:** Creating a new loan, budget, or goal crashes the app — all three screens share the same render path. This is the parent for the root-cause fix and a defensive guard.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] New loan, budget, and goal all create without crashing
- [ ] Root cause documented in the solving ticket(s)