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
