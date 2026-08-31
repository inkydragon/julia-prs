# AGENTS.md

## Environment

- Before running any `node`, `npm`, or `yarn` command in this repository, run `nvm use 20`.
- Assume Node.js 20 is required for dependency installation, builds, and maintenance scripts.

## Commands

- Install dependencies with `yarn install`.
- Build the static site with `yarn build`.
- Refresh the generated data with `yarn compose-db`.

## Notes

- This project builds a static web app; deployed output lives in `out/`.
- Prefer updating `package.json` and `yarn.lock` together when changing dependencies.

## Architecture Decisions Record (ADR)

- Record significant "why" decisions (trade-offs, alternatives, consequences) as ADRs in `docs/adr/`.
- Name files as `NNNN-short-kebab-description.md` with a leading zero-padded number (e.g. `0001-branch-listing-and-sorting.md`).
- Each ADR uses the sections `Status`, `Date`, `Context`, `Decision`, and `Consequences`.
- Keep this document for build/usage guidance; keep ADRs for design rationale.

## Git Commit Conventions

- Write commit messages in English only.
- Prefer atomic commits that keep each commit focused on one logical change.
- Use Conventional Commits when possible, such as `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, or `test:`.
- For simple changes, use a one-sentence summary in the commit body only when extra context is needed.
- For larger changes, include a short summary line and then list the concrete change details as separate bullet points in the commit body.
