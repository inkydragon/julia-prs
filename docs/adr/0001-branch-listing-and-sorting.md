# ADR 0001: Branch listing and sorting

- Status: Accepted
- Date: 2026-08-31

## Context

The site lists all branches that open pull requests target. The source of the
list is `data.branches` in the composed database, which is derived from the
`baseRef.name` (target branch) of every pull request that is `OPEN` at build
time (see `compose-db.js`).

Because contributors regularly open PRs against short-lived personal/branch
names (e.g. `vc/llvm-dialects-tablegen`, `avi/infer_effects`, `codex/...`),
the raw list can contain branches that are not stable lines of development.

An earlier decision filtered the list down to a whitelist
(`master`, `release-*`, `backports-release-*`). This visually simplified the
UI, but it also made PRs targeting non-whitelisted branches impossible to
reach: the branch never appeared in the selector, so the corresponding PR list
could not be displayed. This was a functional regression for PRs like #62938.

## Decision

We do **not** filter which branches are offered. Every branch present in
`data.branches` is selectable in the UI, so any PR can be reached via its
target branch. Instead we only control the **ordering**:

1. `master` is always first.
2. `release-*` branches next, sorted by version number descending.
3. `backports-release-*` branches next, sorted by version number descending.
4. Any other branch (experimental / personal) is listed last.

The logic lives in `entry.js`:

- `_getBranchVersion(branch)` extracts the version token from a
  `release-*` / `backports-release-*` name.
- `_sortBranches(branches)` applies the ordering above.

## Consequences

- Stable branches (`master`, releases) stay prominent at the top.
- All PRs remain reachable through their target branch; nothing is hidden.
- The raw database (`compose-db.js`) is left untouched; ordering is a pure
  presentation concern in the front-end.
