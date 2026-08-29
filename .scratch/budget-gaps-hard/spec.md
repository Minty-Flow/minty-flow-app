# Spec: Budget-App Feature Gaps — Hard Tier

Status: ready-for-agent (spec only — build gated on an infrastructure decision)
Source: web research spike (`/home/adelfael/.claude/plans/crispy-shimmying-beaver.md`)
Tier definition: needs a backend, authentication, or live multi-device sync.
Conflicts with the current local-first, no-backend architecture, so this tier
is written as a spec to expand on later, not as immediate work.

Features in this tier:

1. Encrypted cloud backup file (shallow — pragmatic, no backend)
2. Single-user cross-device sync (full)
3. Shared / couples budgeting (multi-user)

These are ordered by increasing infrastructure cost. Feature 1 is a realistic
near-term option; features 2 and 3 require running a service.

---

## Problem Statement

Minty Flow data lives only on one device. If the phone is lost, wiped, or
replaced, the only recovery is a manual export the user must have remembered
to take. Users with a phone and a tablet cannot see the same data on both.
Couples — the single most common request for budget apps — cannot share a
budget where each person has their own login and device. Every competitor that
targets households (Monarch, YNAB, EveryDollar, Honeydue) solves this; Minty
Flow currently cannot.

## Solution

Three escalating answers:

- **Encrypted cloud backup file**: the app periodically writes an
  end-to-end-encrypted backup to the user's own cloud storage (iCloud Drive /
  Google Drive / Files). Restore on a new device with a passphrase. No server
  Minty Flow operates. Not live sync — a recovery and migration tool.
- **Single-user cross-device sync**: the same account's devices converge to
  one dataset automatically, using a sync service and a change-log/CRDT model.
- **Shared / couples budgeting**: multiple authenticated users attached to one
  shared "household" dataset, with per-user identity on transactions and
  role-based permissions.

## User Stories

### Encrypted cloud backup file
1. As a user, I want the app to automatically back up my data to my own cloud storage, so that I do not lose everything if my phone breaks.
2. As a user, I want backups encrypted with a passphrase only I know, so that my financial data is unreadable to the storage provider or anyone else.
3. As a user, I want to choose the backup destination (iCloud Drive, Google Drive, local Files), so that it fits how I already store things.
4. As a user, I want to set the backup frequency (on app close, daily, manual), so that I control the trade-off between freshness and noise.
5. As a user, I want to restore from a backup file on a new device by entering my passphrase, so that migrating phones is simple.
6. As a user, I want a clear warning that losing the passphrase means the backup is unrecoverable, so that I take it seriously.
7. As a user, I want to see when the last successful backup happened, so that I know my data is safe.
8. As a user, I want a failed backup to alert me, so that I am not falsely reassured.
9. As a user, I want old backups pruned to a configurable count, so that storage does not fill up.
10. As a user, I want restore to be all-or-nothing, so that I never end up with a partial dataset.
11. As a user, I want to verify a backup's integrity before relying on it, so that I trust the restore path.

### Single-user cross-device sync
12. As a user, I want my data to appear on all my devices automatically, so that I can use my phone and tablet interchangeably.
13. As a user, I want changes made offline to sync when I reconnect, so that connectivity is not required to use the app.
14. As a user, I want concurrent edits on two devices to merge without data loss, so that I never have to pick a "winner" manually.
15. As a user, I want a deleted item to stay deleted across devices, so that tombstones are respected.
16. As a user, I want sync traffic encrypted in transit and at rest, so that my data is protected end to end.
17. As a user, I want to see sync status (up to date / syncing / error), so that I know the state.
18. As a user, I want to sign out of a device and have its local copy wiped, so that a sold or lost device is safe.
19. As a user, I want sync to be optional and off by default, so that purely-local users are unaffected.
20. As a user, I want a way to export and fully delete my server-side data, so that I stay in control (and for regulatory compliance).

### Shared / couples budgeting
21. As a couple, we want to share one budget where each partner has their own login, so that we manage money together without sharing a password.
22. As a partner, I want transactions to record who entered them, so that we can see who spent what.
23. As a partner, I want to see the shared data update in near real time on my own device, so that we are always looking at the same picture.
24. As a household owner, I want to invite a partner by email or code, so that onboarding them is easy.
25. As a household owner, I want to remove a member and revoke their access, so that separations are handled cleanly.
26. As a partner, I want a role (owner / member / view-only), so that permissions match our arrangement.
27. As a partner, I want to keep some accounts private and share others, so that individual and joint finances coexist.
28. As a partner, I want to comment on or flag a transaction for the other to review, so that we can discuss specific charges.
29. As a partner, I want concurrent edits from both of us to merge safely, so that shared use does not corrupt data.
30. As a household, we want a clear record of what happens to the data if the household is dissolved, so that each person keeps their copy.

### Cross-cutting
31. As a user, I want any of these features to be entirely opt-in, so that the app stays fully functional with zero cloud involvement.
32. As a user, I want localisation (English/Arabic, RTL) across all new sync/sharing UI, so that the experience is consistent.
33. As a user, I want a clear privacy policy covering any data that leaves my device, so that I know exactly what is stored and where.

## Implementation Decisions

### Cross-tier

- All three features are **opt-in**; the default experience remains
  local-only with no account.
- The local SQLite database stays the source of truth on-device. Nothing in
  this tier replaces it; sync layers sit beside it.
- Encryption is end-to-end: keys derived from a user passphrase (Argon2id /
  scrypt KDF) on-device; the server (where one exists) only ever sees
  ciphertext.

### 1. Encrypted cloud backup file (recommended near-term)

- No Minty Flow server. Reuses the existing backup/export format
  (json/zip snapshot) as the payload.
- Payload is encrypted client-side (libsodium / `expo-crypto` +
  authenticated encryption) with a key derived from the user passphrase, then
  written to a user-selected cloud location via `expo-file-system` +
  `expo-document-picker` / `StorageAccessFramework`, or iOS/Android system
  document providers.
- Scheduler: a background/foreground task writes a new encrypted file on the
  chosen cadence; retention prunes to N files.
- Restore: pick file -> enter passphrase -> decrypt -> validate (reuse
  existing `validateBackup`) -> import inside one `runInTransaction`,
  replacing local data atomically.
- Metadata (last backup time, file list, integrity hash) stored in a
  preference store; failures raise a local notification.
- **This is the only feature in the tier buildable without new infrastructure**
  and should be its own issue, delivered first.

### 2. Single-user cross-device sync (full)

- Requires an operated sync service. Model options, in order of preference:
  - **Change-log + last-writer-wins per field** with tombstones: simplest,
    adequate for a single user's own devices; each row carries `updated_at`
    and `deleted_at`; sync is push/pull of changes since a cursor.
  - **CRDT** (e.g. per-table op logs): stronger merge guarantees, much more
    complex; only if LWW proves insufficient.
- Transport: authenticated HTTPS; payloads are E2E-encrypted blobs keyed by
  the user passphrase, so the service stores opaque ciphertext + minimal
  routing metadata.
- Auth: lightweight account (email + passphrase, or OAuth) purely to associate
  devices; no plaintext financial data server-side.
- Client: a sync engine module that batches local changes, resolves on pull,
  and applies within `runInTransaction`; sync status exposed via a store.
- Sign-out wipes the local DB and keys for that device.
- Schema impact: every synced table needs stable ids (already true),
  `updated_at`, and `deleted_at` tombstone columns; a `sync_state` table holds
  the cursor.

### 3. Shared / couples budgeting (multi-user)

- Builds on feature 2's sync service plus a **shared dataset** ("household")
  that multiple authenticated users can attach to.
- Because the dataset is shared, E2E encryption shifts to a **household key**
  distributed to members via an invite (wrapped with each member's key).
  Removing a member requires a household-key rotation and re-encrypt.
- Data model additions: `household`, `household_member` (user, role), and a
  `created_by_user_id` on transactions (and other user-attributable rows).
  Accounts gain a `visibility` (`private | shared`).
- Merge model: field-level LWW with tombstones is the baseline; per-row author
  is recorded but does not gate merges except for permission checks.
- Permissions enforced server-side on the sync endpoints (owner / member /
  view-only) and mirrored client-side for UX.
- Optional transaction comments/flags: a `transaction_comment` table, synced
  like any other.
- Real-time feel: short-poll or a websocket channel for change
  notifications; not strictly required for correctness.
- Household dissolution: each member's device keeps its last full local copy;
  server-side household data is deleted on owner request.

## Testing Decisions

- **What a good test is here:** exercises the sync/merge engine and the
  encryption boundary as pure units — feed two divergent change sets, assert
  the converged result and that tombstones win; encrypt then decrypt a
  snapshot and assert round-trip equality and that ciphertext is not
  plaintext. No test asserts on wire format internals or UI.
- Same single seam philosophy: a **sync-engine module** and a **crypto module**
  with pure, deterministic interfaces, tested under `vitest`. The database
  application step reuses the in-memory-SQLite seam from the Easy/Medium
  tiers.
- Modules under test: passphrase KDF + authenticated encrypt/decrypt
  round-trip and tamper detection; change-log diff since cursor; LWW merge
  with clock ties; tombstone precedence; household-key wrap/unwrap and
  rotation on member removal; permission checks for each role.
- Representative cases: offline edits on two devices to the same field;
  delete on device A, edit on device B; restore of a backup whose passphrase
  is wrong (must fail cleanly); member removed mid-sync; view-only member
  attempting a write; corrupted backup file.
- A backend, if built, needs its own integration tests for the sync endpoints
  and permission enforcement; those live with the backend, not the app repo,
  and are out of scope for this spec's testing seam.
- **Prior art:** the existing backup format, `validateBackup`, and the
  `runInTransaction` atomic-import path are the templates for the local
  restore/apply half. There is no prior art in-repo for sync or crypto; those
  modules establish it.

## Out of Scope

- Building or specifying the server implementation, hosting, and ops for
  features 2 and 3 — this spec defines the client contract and data model
  only.
- Any feature that would send plaintext financial data to a third party.
- Bank aggregation / open-banking connections.
- Real-time collaborative editing of a single transaction (last-writer-wins is
  accepted).
- Web client.
- Making sync mandatory or changing the default local-only behaviour.

## Further Notes

- Recommended path: ship **feature 1 (encrypted cloud backup file)** as a
  standalone issue now — it answers most of the "don't lose my data" demand
  with zero infrastructure and reuses the existing backup format. Treat it as
  effectively Medium-tier in cost.
- Features 2 and 3 should not start until there is an explicit decision to
  operate a service (cost, on-call, privacy policy, data-deletion process).
  When that decision is made, split them into their own specs; feature 3
  strictly depends on feature 2.
- Adding `updated_at` / `deleted_at` tombstone columns to synced tables is
  cheap and non-destructive; doing it early (even before sync is built) keeps
  the future migration small. This could be pulled forward into the Medium
  tier if desired.
- The couples feature is the highest-demand item in the whole research spike
  but also the highest cost; the encrypted backup file is the
  highest-value-per-effort item in this tier.
