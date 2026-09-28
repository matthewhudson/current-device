# current-device

Browser device detection library (OS, type, orientation) — ~25k downloads/week on npm.
This is a widely-used public package. Follow semver strictly: breaking changes require a major version bump, new features bump minor, bug fixes bump patch. Always document breaking changes in CHANGELOG.md and PR descriptions.

## Commands

- `pnpm run build` — build with tsup to dist/ (CJS + ESM + .d.ts)
- `pnpm run test` — run Vitest tests with jsdom environment
- `pnpm run typecheck` — check types with tsc --noEmit
- `pnpm run test:watch` — run tests in watch mode
- `pnpm run test:coverage` — run tests with coverage report
- `pnpm run test:dist` — test the built files in dist/ (run `pnpm run build` first)
- `pnpm run test:browser` — load the <script> build in real Chromium/Firefox/WebKit with Playwright device profiles (run `pnpm run build` and `pnpm exec playwright install` first)
- `pnpm run check:es2015` — verify dist/ has no syntax or built-ins newer than ES2015
- `pnpm run check:package` — validate package.json exports and types (publint + attw)
- `pnpm changeset` — create a changeset describing your changes (run before committing)
- `pnpm changeset status` — check pending changesets

## Architecture

- Single source file: `src/index.ts` — all detection logic
- Tests: `tests/*.test.ts` run against src/ (Vitest + jsdom); `tests/built/` runs against the built files with its own config (`vitest.built.config.ts`); `tests/browser/` is Playwright (`playwright.config.ts`)
- Build output: `dist/` (index.js=CJS, index.mjs=ESM, index.d.ts/index.d.mts=types)
- Browser-only library: uses window, navigator, document, screen at module scope
- Module has side effects on import (adds CSS classes to <html>, attaches orientation listener)

## Key Conventions

- TypeScript strict mode — no `any` types
- Browser floor is ES2015 (README "Browser Support"): tsup `target: 'es2015'` down-levels syntax, tsconfig `lib: ES2015` blocks newer built-ins (no polyfills are shipped), and `pnpm run check:es2015` verifies dist/ in CI and before publish
- pnpm as package manager (esbuild must be in pnpm.onlyBuiltDependencies)
- Node.js >= 16 (for consumers; development and CI use Node 24, pinned in `.nvmrc`)
- Dual CJS/ESM via package.json exports field
- CI: GitHub Actions (.github/workflows/ci.yml)
- Demo site: `docs/` is deployed to GitHub Pages by .github/workflows/docs.yml when `docs/` changes on main
- Releases: Changesets (.changeset/) — run `pnpm changeset` to describe changes, the release.yml workflow handles versioning and npm publish on merge to main

## Gotchas

- jsdom has `window.process` defined (Node.js), so `device.nodeWebkit()` returns true in tests — account for this in test assertions about CSS classes
- `device.noConflict()` restores `window.device` to its value before module import (undefined in jsdom)
- Orientation callback tests must change the viewport (`innerWidth`/`innerHeight`) and then dispatch a resize event: handleOrientation() runs at import time before callbacks are registered, and callbacks only fire when the orientation changes
- dist tests load the <script> build via a real `<script>` element, not `window.eval()`: the build is strict mode, and strict eval keeps top-level `var`s local, which would hide leaked globals
- Never add `"sideEffects": false` (publint suggests it): importing the module adds <html> classes and a listener, so bundlers would drop the import
- `check:package` ignores attw's `missing-export-equals`: fixing it would change what `require('current-device')` returns (README documents `.default`), a breaking change
- Playwright's WebKit exposes `onorientationchange` even on desktop, so there the library follows screen (not window) orientation; the desktop rotate test is skipped for engines with that event
- UA fixtures (`tests/ua-strings.ts`) are shared by the src/ and dist/ tests. New real-world UAs must be copied verbatim with a `source` URL. A fixture with `knownIssue` holds the *correct* expectations and runs as `it.fails`; when you fix that bug the test fails, so remove `knownIssue` then. Every other fixture must also pass the invariants in `tests/fixture-assertions.ts`
- `pnpm approve-builds` is interactive — use `pnpm.onlyBuiltDependencies` in package.json instead
