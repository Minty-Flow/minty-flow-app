# 02 — Purge transfer from category type end-to-end

**What to build:** Remove the "transfer" option from the shared category type picker (create and modify both use it), tighten the category schema so only expense/income are valid, align the category type model and mappers, and add a guard on category creation so a transfer value can never reach the DB.

**Blocked by:** 01 — Remove transfer type from category create/modify

**Status:** ready-for-agent

- [ ] Option gone from category type picker (both screens)
- [ ] Schema rejects transfer at validation, model type only expense/income
- [ ] Category create guards against transfer insert even if called programmatically
- [ ] Onboarding presets still create categories fine