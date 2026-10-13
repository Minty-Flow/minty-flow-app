# Issue tracker: local markdown or GitHub issues

Issues and specs for this repo live in one of two places:

- **Local markdown** in `.scratch/`, which is gitignored: scratch planning that
  does not need to be shared.
- **GitHub issues** on the MintyFlowApp project board (org project 3): work
  other people should see. A new issue lands in the *Backlog* column on its
  own.

**Ask the owner which one before writing any ticket, spec or backlog item.**
Do not pick for them.

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

Ask which tracker to use, then:

- **Local:** create a new file under `.scratch/<feature-slug>/` (creating the
  directory if needed). Do not push anything to GitHub.
- **GitHub:** `gh issue create` with a body that follows the shape of #94
  (Why, Today, Study first, Then, Done when). Issue text carries no AI
  attribution (see `AGENTS.md`).

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

None in `.scratch/`. Finished efforts are deleted from it; open work is on the
project board.
