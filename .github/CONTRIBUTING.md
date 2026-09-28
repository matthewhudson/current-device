# Contributing to current-device

Thanks for taking the time to contribute! These are guidelines, not rules; use
your best judgment, and feel free to propose changes to this document in a pull
request.

## Setup

current-device uses [pnpm](https://pnpm.io) and the Node.js version in
`.nvmrc` (Node 24; `nvm use` picks it up).

```sh
pnpm install
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm run test` | Runs the Vitest suite against `src/` in jsdom |
| `pnpm run test:watch` | The same, on every change |
| `pnpm run test:coverage` | The same, with a coverage report |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run build` | Builds `dist/` (CJS, ESM, `<script>` build and types) with tsup |
| `pnpm run check:es2015` | Verifies `dist/` uses no syntax or built-ins newer than ES2015 |
| `pnpm run test:dist` | Tests the built files in `dist/` (run `pnpm run build` first) |
| `pnpm run check:package` | Validates `package.json` exports and types (publint and attw) |
| `pnpm run test:browser` | Loads the `<script>` build in real browsers with Playwright device profiles (run `pnpm run build` and `pnpm exec playwright install` first) |
| `pnpm run corpus` | Runs the built `<script>` build against the Matomo device-detector fixtures and prints detection accuracy per device type (run `pnpm run build` first) |

CI runs typecheck, test, build, check:es2015, test:dist, check:package and the
browser tests on every pull request.

## Making a change

1. Fork the repository and create a branch from `main`.
2. Make the change. For a detection change, run `pnpm run corpus` before and
   after to see what it does across 35,000 real user agents, and add a
   fixture for the user agent you are fixing (see below).
3. Run `pnpm run typecheck`, `pnpm run test`, `pnpm run build` and
   `pnpm run test:dist`.
4. Run `pnpm changeset` and describe the change for the changelog. Pick
   `patch` for a fix, `minor` for a new feature or a newly detected platform,
   `major` for anything that changes existing results or the API. Documentation
   and tooling changes need no changeset.
5. Open a pull request. Say which devices or user agents change their result.

## Conventions

- TypeScript strict mode; no `any`.
- The browser floor is ES2015 (see "Browser Support" in the README). tsup
  down-levels syntax; newer built-ins are blocked by `lib: ES2015` in
  `tsconfig.json` because no polyfills are shipped.
- `src/index.ts` holds all detection logic. Detection is user agent based and
  runs once at import; keep new rules to `indexOf` checks or a small regex,
  and measure them against the corpus.
- Never add `"sideEffects": false` to `package.json`: importing the module adds
  classes to `<html>` and a listener, so bundlers would drop the import.

## Fixtures

User agent fixtures live in `tests/ua-strings.ts` and are shared by the `src/`
tests and the `dist/` tests. A new fixture must be a real-world user agent,
copied verbatim, with a `source` URL. If it documents a bug that is not fixed
yet, give it a `knownIssue` and the *correct* expectations: the test runs as an
expected failure until the bug is fixed, and then fails so that you remove the
field. Every fixture must also satisfy the invariants in
`tests/fixture-assertions.ts` (exactly one type, at most one OS family).

## Releases

Releases use [Changesets](https://github.com/changesets/changesets). Merging a
pull request with a changeset updates a "chore: version packages" pull request;
merging that publishes to npm and creates the GitHub release.
