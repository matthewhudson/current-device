# current-device

Browser device detection library (OS, type, orientation) — ~25k downloads/week on npm.
This is a widely-used public package. Follow semver strictly: breaking changes require a major version bump, new features bump minor, bug fixes bump patch. Always document breaking changes in CHANGELOG.md and PR descriptions.

## Commands

- `pnpm run build` — build with tsup to dist/ (CJS + ESM + .d.ts)
- `pnpm run test` — run Vitest tests with jsdom environment
- `pnpm run typecheck` — check types with tsc --noEmit
- `pnpm run test:watch` — run tests in watch mode
- `pnpm run test:coverage` — run tests with coverage report
- `pnpm changeset` — create a changeset describing your changes (run before committing)
- `pnpm changeset status` — check pending changesets

## Architecture

- Single source file: `src/index.ts` — all detection logic
- Tests: `tests/index.test.ts` — Vitest + jsdom
- Build output: `dist/` (index.js=CJS, index.mjs=ESM, index.d.ts/index.d.mts=types)
- Browser-only library: uses window, navigator, document, screen at module scope
- Module has side effects on import (adds CSS classes to <html>, attaches orientation listener)

## Key Conventions

- TypeScript strict mode — no `any` types
- pnpm as package manager (esbuild must be in pnpm.onlyBuiltDependencies)
- Node.js >= 16 (for consumers; development requires Node 22)
- Dual CJS/ESM via package.json exports field
- CI: GitHub Actions (.github/workflows/ci.yml)
- Releases: Changesets (.changeset/) — run `pnpm changeset` to describe changes, the release.yml workflow handles versioning and npm publish on merge to main

## Gotchas

- jsdom has `window.process` defined (Node.js), so `device.nodeWebkit()` returns true in tests — account for this in test assertions about CSS classes
- `device.noConflict()` restores `window.device` to its value before module import (undefined in jsdom)
- Orientation callback tests require dispatching a resize event since handleOrientation() runs at import time before callbacks are registered
- `pnpm approve-builds` is interactive — use `pnpm.onlyBuiltDependencies` in package.json instead
