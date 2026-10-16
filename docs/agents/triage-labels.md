# Triage Labels

The skills speak in terms of five canonical triage roles. Where they live
depends on the tracker, and the owner picks the tracker per ticket (see
[issue-tracker.md](issue-tracker.md)): ask first, do not assume.

## Roles

| Canonical role     | Meaning                                  |
| ------------------ | ---------------------------------------- |
| `needs-triage`     | Maintainer needs to evaluate this issue  |
| `needs-info`       | Waiting on reporter for more information |
| `ready-for-agent`  | Fully specified, ready for an AFK agent  |
| `ready-for-human`  | Requires human implementation            |
| `wontfix`          | Will not be actioned                     |

- **Local markdown:** set the `Status:` line of the file to the role string.
- **GitHub issues:** apply the GitHub label with the same name. `needs-triage`
  and `ready-for-human` do not exist as labels yet; create them when first
  needed.

## GitHub labels

Keep the set small. Add a label only when it will be used more than once.

| Group    | Labels                                                                 |
| -------- | ---------------------------------------------------------------------- |
| Type     | `bug`, `enhancement`, `chore`, `refactor`, `performance`, `research`, `security`, `documentation`, `ux` |
| Area     | `ui`, `database`, `i18n`, `android`, `ios`, `build`, `rates`           |
| State    | `blocked`, `needs-decision`, `needs-info`, `migration`                 |
| Priority | `high priority`, `low priority` (no label means normal)                |
| Triage   | `ready-for-agent`, `wontfix`                                           |

`migration` marks a change to stored data or schema (a one-way door).
`needs-decision` marks work that waits on an owner decision.
