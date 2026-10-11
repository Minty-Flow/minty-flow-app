# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`, tracked
in git. Nothing goes to GitHub Issues. Skill config (`docs/agents/`) stays
local and gitignored.

## Conventions

- One feature/effort per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a
  single combined tickets file
- Triage state is a `Status:` line near the top of each file (role strings in
  `triage-labels.md`)
- Comments / conversation history append at the bottom under a `## Comments`
  heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if
needed). Do **not** call `gh issue create` or push anything to GitHub.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user normally passes the path or the
issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from
  `01`. A `Type:` line records the ticket type
  (`research`/`prototype`/`grilling`/`task`); a `Status:` line records
  `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. Unblocked when every
  file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open,
  unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set
  `Status: resolved`, then append a context pointer to the map's
  Decisions-so-far in `map.md`.

## Existing efforts

- `.scratch/issue-1-account-select-scroll/` … `issue-5-precommit-reenable/` —
  historical, pre-existing.
- `.scratch/budget-gaps-easy/`, `budget-gaps-medium/`, `budget-gaps-hard/` —
  specs from the 2026-08-29 feature-gap research spike.
