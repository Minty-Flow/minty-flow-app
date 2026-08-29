# Triage Labels

The skills speak in terms of five canonical triage roles. In this repo the
tracker is local markdown, so a "label" is the string on the `Status:` line
near the top of an issue/spec file.

| Canonical role     | String on the `Status:` line | Meaning                                  |
| ------------------ | ---------------------------- | ---------------------------------------- |
| `needs-triage`     | `needs-triage`              | Maintainer needs to evaluate this issue  |
| `needs-info`       | `needs-info`                | Waiting on reporter for more information |
| `ready-for-agent`  | `ready-for-agent`           | Fully specified, ready for an AFK agent  |
| `ready-for-human`  | `ready-for-human`           | Requires human implementation            |
| `wontfix`          | `wontfix`                   | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), set the
`Status:` line of the file to the matching string. No GitHub labels are used.
