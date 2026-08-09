# 01 — Remove transfer type from category create/modify

**What to build:** The category create and modify screens still offer "transfer" as a category type, but transfer was removed from the model — the DB even rejects it. This is the parent for cleaning the leak out of both screens and the model.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] "Transfer" no longer selectable in create screen nor modify screen
- [ ] No transfer category can be persisted anywhere
- [ ] Existing expense/income categories unaffected