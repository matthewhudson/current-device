# current-device — Project Health Audit

_Audited on 2026-09-28 against commit `6ce27a8` (branch `claude/peaceful-gauss-oso6kt`, one commit ahead of `main` = `5fed1c2`, v2.3.0). Read-only investigation; nothing in the repository was changed except the addition of this file._

**Scope note.** The audited HEAD is the head of **open PR [matthewhudson/current-device#420](https://github.com/matthewhudson/current-device/pull/420)** (`6ce27a8`, "Detect Android TV, other televisions, and feature phones", changeset `.changeset/android-tv-feature-phones.md`), one commit ahead of `main`. Everything below refers to that state; where a finding differs on the published 2.3.0 / `main`, it is noted. GitHub state at audit time: 0 open issues, 109 closed issues, 2 open PRs (#420, #416).

---

## 1. Executive summary

- **Overall health is good, and far better than a year ago.** After four dormant years (5 commits in 2023, none in 2024–2025) the project was revived in 2026: TypeScript, tsup, Vitest, pnpm, Changesets, real-browser tests, a Matomo corpus benchmark, SSR support and React hooks all landed this year. The migration is complete; nothing from the old `nwb`/Karma/Travis toolchain remains except a few stale config and doc files (§4, §6).
- **Everything runs green.** `pnpm install --frozen-lockfile`, `typecheck`, `build`, `check:es2015`, `check:package`, `test:dist` (88 passed, 1 expected failure) and `test` (558 passed, 1 expected failure) all pass. The unit suite passed 5/5 consecutive runs with identical results; no flaky test was observed. The Playwright suite passes in Chromium for the three Chromium profiles I could run locally (Firefox/WebKit are not installed here).
- **The core approach has hard limits in 2026, and the README does not say so.** Chrome's reduced UA (`Android 10; K`) hides the model, so the new tablet-model heuristics cannot help small Chrome tablets; iPadOS and iPhone "desktop mode" send a Mac UA; Windows tablets and ChromeOS tablets are undetectable by UA; HarmonyOS NEXT (no Android layer) is not recognised at all; `navigator.userAgentData` (Client Hints) is not used. UA sniffing still works well for the cases that matter most (phone vs. tablet vs. desktop, iOS vs. Android: 89% type accuracy on 35,772 Matomo UAs), but the project should position itself as "good-enough OS/type classification for styling", not as accurate device identification (§3.1, §3.2).
- **Open PR #420 (the audited HEAD) has one defect to fix before merge:** a HarmonyOS tablet whose UA says both `MatePad` and `Mobile` gets `device.type === 'tablet'` but the `<html>` classes `harmonyos mobile` (§3.3 B0). It also changes observable behaviour for Android TVs, Fire/Galaxy tablets and Chromebook Android apps under a *minor* bump; the changeset describes this, the README does not (§8.2).
- **The README over-promises in several places.** `device.os` can never return `'iphone'`, `'ipad'` or `'ipod'` (§2.3); `'harmonyos'`, `device.harmonyos()`, `device.cordova()`, `device.nodeWebkit()` and the `cordova`/`node-webkit`/`harmonyos` classes are implemented but undocumented; MeeGo gets `meego mobile`, not `meego`; KaiOS is documented as "reported as mobile" but is actually reported as Firefox OS; the demo page cannot light up `chromeos`, `linux` or `harmonyos`; the three README screenshots date from 2017 and one shows a BlackBerry tablet (§2, §6).
- **Repository hygiene has leftovers from the pre-2026 era.** `codecov.yml` commits an upload token although Codecov is not used anywhere; `renovate.json` is stale (last Renovate PR January 2023; dependency bumps now come from Dependabot security alerts with no `dependabot.yml`); `CONTRIBUTING.md` says Node >= 4 and `npm run clean`; issue templates sit in `.github/` instead of `.github/ISSUE_TEMPLATE/` so GitHub never offers them; there is no `SECURITY.md`; there is no linter or formatter (§4, §6).
- **The CDN bundle is shipped unminified.** `dist/index.global.js` is 10.98 KB (2.72 KB gzip); minified it would be 5.9 KB (2.06 KB gzip). The 0.10.2 CDN file was a 5.7 KB `.min.js`. Every `<script src="https://unpkg.com/current-device">` user pays ~25% more transfer than necessary (§4.5).
- **Release pipeline risk:** the Changesets "version packages" PR is created with `GITHUB_TOKEN`, so CI never runs on it, and `release.yml` publishes without waiting for `ci.yml`; `prepublishOnly` runs the build, the ES2015 check and the dist tests but not the source tests or typecheck (§4.4).
- **Dev dependencies:** `pnpm audit` reports 13 advisories, all through `jsdom@25` (five majors behind, now 30.x); none affect the published package (§4.6).
- **Test gaps are narrow but real:** there is no MeeGo fixture and no positive Windows-tablet fixture although both are in the README tables; there is no test for a missing `navigator`, a web worker, `cordova()` or an empty UA (§5).

---

## 2. Does it deliver on its promises?

### 2.1 README claims vs. implementation

| Claim (README) | Reality | Severity |
| --- | --- | --- |
| `device.os` returns `'ios', 'iphone', 'ipad', 'ipod', ...` (Useful Properties table) | `findMatch` checks `'ios'` first (`src/index.ts:618-633`), so `os` is `'ios'` for every Apple handheld and can never be `'iphone'`, `'ipad'` or `'ipod'`. The three values are dead members of `DeviceOs` (`src/index.ts:5-7`). The fixture file even documents this (`tests/ua-strings.ts:24-25`). | Medium (doc bug, and a type that lies) |
| `device.os` value list | Omits `'harmonyos'`, which is implemented (`src/index.ts:15, 321-323, 624`) and released in 2.1.0. | Low |
| Device CSS class table | No rows for HarmonyOS (`harmonyos mobile` / `harmonyos tablet`, `src/index.ts:493-498`), `cordova` (`:542-544`) and `node-webkit` (`:529-530`). | Low |
| JS method table | `device.harmonyos()`, `device.cordova()`, `device.nodeWebkit()` exist in the `Device` interface (`src/index.ts:41, 45, 46`) but are not documented. | Low |
| MeeGo → `meego` | Code adds `meego mobile` (`src/index.ts:528`). | Info |
| "Feature phones and other handsets (Java ME, Symbian, **KaiOS**, ...) are reported as mobile" (Device Support) and "Other phone (feature phone, Symbian, Tizen...) → `mobile`" | KaiOS keeps the Firefox OS UA shape (`(Mobile; ...; rv:`), so `fxos()` is true and the result is `os: 'fxos'`, classes `fxos mobile`. The fixture at `tests/ua-strings.ts:711-720` encodes exactly that. Verified with two KaiOS UAs (2.5 and 3.0) in a scratch harness. The README and the code disagree; `'kaios'` is also in the `otherPhones` list (`src/index.ts:182`) where it can never be reached for a real KaiOS UA. | Low |
| "Windows: Phones, Tablets, Desktops" / `windows tablet` | `windowsTablet()` requires the literal token `touch` (`src/index.ts:300-302`). Only IE11 and Edge Legacy ever sent it; Chromium Edge, Chrome and Firefox on a Surface send a plain desktop UA. So a modern Windows tablet is always `desktop`, and an IE11 *desktop* with a touchscreen was a `tablet`. Effectively dead detection. | Low |
| `require("current-device").default` | Works: `dist/index.js` sets `__esModule` and exports `default` (verified by `tests/built/dist.test.ts:157-170`). | OK |
| CDN URL `unpkg.com/current-device/dist/index.global.js` | Matches the built filename; `unpkg`/`jsdelivr` fields point at it too; `curl -I` on unpkg redirects to `/current-device@2.3.0/dist/index.global.js`. | OK |
| `onChangeOrientation` returns an unsubscribe function | Implemented (`src/index.ts:576-589`), tested (`tests/orientation.test.ts:179-232`). | OK |
| `noConflict()` | Implemented (`src/index.ts:468-473`); tested in src and dist suites. See §3.6 for a `this` caveat. | OK |
| TypeScript: `Device`, `DeviceType`, `DeviceOs`, `DeviceOrientation` exported | All four exported plus `OrientationChangeCallback` (`src/index.ts:1-20`); `current-device/react` re-exports the three value types and adds `DeviceState`. `attw` passes for node10/node16/bundler; a scratch project importing both entry points type-checks under `moduleResolution` `bundler`, `node16` and `node`. | OK |
| Browser support table (ES2015) | Enforced by `tsup target: 'es2015'`, `lib: ES2015` and `es-check`; passes. | OK |
| SSR section | Verified by `tests/ssr.test.ts` and `tests/built/dist.test.ts:185-205`. | OK |
| React section (`useDevice`, `useOrientation`, React >= 18) | Verified; `useSyncExternalStore` is React 18+, matching `peerDependencies`. | OK |

Also undocumented, and worth documenting because it surprises users:

- `device.type` is `'desktop'` for every television (`src/index.ts:405-407`, `tests/fixture-assertions.ts:41-44`). The README table shows a `television` class but says nothing about `type`.
- Importing the ESM/CJS build in a browser **also** assigns `window.device` (`src/index.ts:78-80`), not only the `<script>` build. A bundler user gets an unrequested global.
- `declare global { interface Window { device: Device } }` (`src/index.ts:59-63`) is shipped in `dist/index.d.ts` and `dist/react.d.ts`, so every TypeScript consumer's `window.device` becomes a non-optional `Device`, even in files that never import the package.

### 2.2 Built output and package exports

All three formats are produced and correct: `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.global.js` (IIFE), plus `react.js`/`react.mjs`, `.d.ts`/`.d.mts` for both, and source maps. `publint` reports no errors (its two suggestions, `"type": "commonjs"` and `"sideEffects": false`, are correctly *not* applied; the second would break the library, as CLAUDE.md notes). `attw` is all green with `missing-export-equals` ignored, which is the documented, deliberate choice. `pnpm pack --dry-run` lists 18 files: `dist/*` (14), `LICENSE`, `package.json`, `react/package.json`, `README.md`. Nothing unwanted is published.

The IIFE has no `globalName`; it relies on the module's own `window.device = device` assignment. That is fine and is what the "adds only the `device` global" tests check.

### 2.3 Types

Accurate except that `DeviceOs` includes three unreachable members (`'iphone' | 'ipad' | 'ipod'`). Removing them from the union is technically breaking for anyone who wrote `const os: DeviceOs = 'ipad'`, so it belongs in 3.0 together with the README fix; in 2.x, fix the README only.

---

## 3. Detection correctness

Method: I read `src/index.ts` line by line, ran the built `<script>` bundle against 44 hand-picked user agents in a scratch harness (outside the repo, same fake-globals technique as `scripts/corpus.mjs`), and ran `pnpm run corpus -- --dump` against the Matomo fixtures (35,772 UAs).

### 3.1 The fundamental limits (say them in the README)

**Severity: High (positioning), not a bug.** UA sniffing in 2026 can still separate phone / tablet / desktop and iOS / Android / Windows / macOS well enough for styling, but the following cannot be fixed with more regexes:

1. **Chrome's reduced UA.** Since Chrome 110 every Android Chrome UA says `Android 10; K`. The library still gets phone vs. tablet right from the `Mobile` token (verified), but the new tablet-model regex (`src/index.ts:155-156`) is useless for these UAs, so any Chrome tablet under 600 dp is a phone. The corpus numbers (85% Android tablets) come from a historical corpus with full model names and overstate what you get from today's Chrome.
2. **iPadOS 13+ and iPhone "Request Desktop Website".** Both send the macOS Safari UA. The `maxTouchPoints > 1 && platform === 'MacIntel'` heuristic (`src/index.ts:248-255`) correctly recovers iPads, but it turns an iPhone in desktop mode into `ios ipad tablet` (verified). It also depends on `navigator.platform`, which is deprecated (still returned by Safari, but a Chrome-style freeze would break it), and on Chrome-on-iPad and Firefox-on-iPad reporting the same values (they do today).
3. **Windows and ChromeOS tablets** are not distinguishable from laptops by UA at all (verified: a ChromeOS UA with `maxTouchPoints: 10` is `chromeos desktop`; a Windows 11 UA with `maxTouchPoints: 10` is `windows desktop`).
4. **Client Hints are not used.** `navigator.userAgentData` (Chromium only) exposes `platform` and `mobile` synchronously and `model`/`platformVersion` via `getHighEntropyValues()` (asynchronous). It would restore Android model names for the tablet heuristic and give a reliable `mobile` bit, but only in Chromium, and only asynchronously for the high-entropy fields, which does not fit a library that must set `<html>` classes synchronously at import time. The synchronous low-entropy `mobile` and `platform` hints could be used as a tie-breaker today with no API change. This is an open question for the maintainer (§8).

**Recommendation:** add a "Limitations" section to the README that states 1–4 plainly and points to feature detection (`pointer`/`hover` media queries, `matchMedia('(orientation: ...)')`) for layout decisions. Position the library as "OS/type classes for CSS and analytics", not as device identification.

### 3.2 Corpus results (`pnpm run corpus`, HEAD build)

Overall type accuracy 89.0% (the changeset's claim of 84% → 89% reproduces). The rows that matter:

| Matomo group | n | type ok | os ok | Note |
| --- | --- | --- | --- | --- |
| Android smartphone | 22,744 | 96.6% | 99.1% | 751 → tablet (mostly no `Mobile` token) |
| Android tablet | 6,848 | 84.9% | 99.1% | 1,004 → mobile (small tablets that say `Mobile`) |
| Android TV | 2,186 | 47.5% | 99.6% | rest carry only a bare model number |
| iOS smartphone / phablet | 232 | 80–83% | 80–82% | misses are UC Browser's non-Mozilla UAs, not Safari |
| iOS tablet | 116 | 100% | 100% | |
| Windows / Mac / Linux / ChromeOS desktop | 538 | 100% | 94–100% | |
| Windows Mobile | 158 | 88.6% | 100% | misses are UC Browser |
| phones detected as TV | 14 | | | all have "TV" as a word in the model name (the documented `knownIssue`) |

Wearables, car browsers, consoles, smart speakers and cameras are systematically wrong (0%), but the library has no category for them and the README does not claim them. Fine as long as the README says so.

### 3.3 Confirmed bugs and misclassifications (reproduced in the scratch harness)

| # | Finding | Evidence | Severity |
| --- | --- | --- | --- |
| B0 | **PR #420 regression: HarmonyOS tablet type/class mismatch.** The HarmonyOS branch of the class chain (`src/index.ts:493-498`) decides `mobile` vs `tablet` with a bare `find('mobile')`, while `device.type` goes through `androidTablet()` and the new `androidTabletModel` regex (`:155-156, :270-272`). A MatePad UA that contains `Mobile` therefore gets `type: 'tablet'`, `tablet() === true` and the classes `harmonyos mobile`. On `main` the two agree (both `mobile`). Fix: use `device.androidTablet()` in that branch. | scratch harness: `... HarmonyOS; MatePad 11; ... Mobile Safari` → `os=harmonyos type=tablet classes="harmonyos mobile"` | **Medium** — ships a self-inconsistent result in the next minor |
| B1 | **HarmonyOS NEXT / OpenHarmony 5 is not detected.** Huawei's Android-free OS sends `Mozilla/5.0 (Phone; OpenHarmony 5.0) ... ArkWeb/4.1.6.1 Mobile` (phone) / `(Tablet; OpenHarmony 5.0) ...` (tablet). `harmonyos()` only looks for the literal `harmonyos` (`src/index.ts:321-323`). Result: phone → `os: 'unknown', type: 'mobile'`, classes `mobile`; **tablet → `os: 'unknown', type: 'desktop'`**, classes `desktop`. The UA shape is taken from Huawei's developer documentation; I could not verify it against a live device, so treat the exact string as "documented format", but the `openharmony` token is stable. | scratch harness | **Medium** — HarmonyOS NEXT ships on all new Huawei devices since 2024/2025 and the tablet case lands in the wrong type |
| B2 | **`node-webkit` class replaces the OS/type classes on Linux.** The class chain checks `nodeWebkit()` before `television`, `linux`, `mobile` and `desktop` (`src/index.ts:529-539`). An Electron/NW.js renderer with `window.process` on Linux gets only `node-webkit landscape` while `device.os === 'linux'` and `device.type === 'desktop'`. On Windows/macOS the earlier branches win, so the class and property disagree only on Linux (and in jsdom, which is why CLAUDE.md has a gotcha about it). | scratch harness with `window.process = {}` | Low |
| B3 | **KaiOS is Firefox OS.** See §2.1. Not wrong per se (KaiOS is a Firefox OS fork) but contradicts the README and the `otherPhones` entry. | harness, `tests/ua-strings.ts:711` | Low |
| B4 | **iPhone in desktop mode is an iPad** (`ios ipad tablet`). Inherent to the heuristic; needs documenting. | harness | Low |
| B5 | **Windows tablets:** see §2.1. A Surface in Edge/Chrome/Firefox is `desktop`; IE11 with a touchscreen on a desktop PC is `tablet`. | harness | Low (IE11 is gone) |
| B6 | **Kindle e-readers** (`Linux armv7l like Android ... Kindle/3.0+`) are `android tablet` because `android()` matches `like Android` and the tablet regex matches `kindle`. | harness | Info |
| B7 | **Meta Quest** headsets: Quest 2 (Android UA) → `android tablet`; Quest 3 (X11 UA) → `linux desktop`. No VR category exists, so "desktop" is the least-bad answer, but `android tablet` for Quest 2 means `tablet()` styling on a headset. | harness | Info |
| B8 | **`otherPhone()` treats any unknown UA containing `mobile` as a phone** (`src/index.ts:359-361`) and `linux()` excludes it. A desktop Linux UA with a `...Mobile...` app token (e.g. an ISP or carrier portal app) becomes `os: 'unknown', type: 'mobile'`. Contrived, but the substring test is very broad. | harness | Low |
| B9 | **Broad TV substrings.** `televisionDevices` (`src/index.ts:90-145`) includes bare substrings such as `uhd`, `iptv`, `mstar`, `sraf`, `viera`, `kylo`, `roku`, `mitv`. `uhd` in particular is a display-resolution word: an Android UA whose model or app token contains "UHD" is a television (`android television`, `type: 'desktop'`). The corpus shows only 14 phone → TV false positives (all the known "TV in model name" case), so this is a risk, not a measured problem. | code reading + harness | Low |

### 3.4 iPadOS 13+ handling

Correct for the common case and tested (`tests/ua-strings.ts:65-75` desktop-mode iPad, `:557-580` Windows/Android UAs reporting `MacIntel` with touch, and the Playwright `iPad Pro 11` profile in `tests/browser/device.spec.ts`). The 2.2.0 fix (require a Mac UA) closed the earlier false positive. Remaining weaknesses: depends on `navigator.platform` (deprecated); cannot tell iPad from iPhone-in-desktop-mode (B4); a visionOS Safari UA is identical to macOS Safari and, if visionOS reports `maxTouchPoints > 1`, would be an iPad (unverified; I had no way to check visionOS's `maxTouchPoints`).

### 3.5 Orientation

Implementation (`src/index.ts:420-461, 591-603`):

- iOS: `window.orientation` (deprecated, but still present in iOS Safari and updated before `orientationchange`; this is the #367 fix and is covered by unit and Playwright tests).
- Any other browser that has `onorientationchange` (Android Chrome/Firefox/Samsung, Playwright WebKit): `screen.orientation.type`.
- Everything else (desktop): `innerHeight >= innerWidth`, listening to `resize`.

Findings:

| # | Finding | Severity |
| --- | --- | --- |
| O1 | **Two different definitions of "orientation".** On phones and tablets it is the *screen* orientation; on desktop it is the *viewport* aspect ratio. In Android split-screen, on foldables with an app in one pane, or in a floating window, `screen.orientation` says landscape while the viewport (and the CSS `(orientation: portrait)` media query) says portrait. The library's own square-viewport comment (`src/index.ts:438`) appeals to the CSS definition; the phone branch does not follow it. A single `matchMedia('(orientation: portrait)')` (ES2015-compatible, supported everywhere in the README's browser table) would give one consistent answer and one event source; iOS's stale `screen.orientation` problem (#367) does not affect `matchMedia`, though that would need re-verifying on a device. | Medium |
| O2 | `window.orientation` is deprecated and iPadOS in desktop mode still exposes it, but `Object.prototype.hasOwnProperty.call(window, 'orientation')` is the only guard. If Apple removes it, iOS silently falls to the `screen.orientation` branch and #367 regresses. No test would catch that (jsdom has neither). | Low |
| O3 | `screen.orientation` is read without a null check on `.type` (`:436, :458`); some old Android WebViews expose `screen.orientation` as a string, not an object, which would make `includes()` throw at import time. Android WebView < 51 is outside the support table, so this is Info. | Info |
| O4 | Desktop portrait monitors report `portrait`; that is arguably correct, but the README never says orientation on desktop means the window's aspect ratio. | Info |

### 3.6 Other code-level observations

- `noConflict()` returns `this` (`src/index.ts:472`), so `const { noConflict } = device; noConflict()` returns `undefined` while the type says `Device`. Use `return device`. (Low)
- The `resize`/`orientationchange` listener is added once per module evaluation and never removed; there is no dispose. Fine for an app, but every `vi.resetModules()` re-import in the test suite adds another listener that stays alive for the rest of the file (§5.3). (Info)
- `find('mac')` (`src/index.ts:227`) is a bare substring; the changeset already had to special-case a TV maker containing "mac". Prefer `macintosh` / `mac os x`. (Low)
- `windows()` is `find('windows')`, so Xbox (`Windows NT 10.0; ... Xbox; Xbox One`) is `windows desktop`; acceptable, but a console is closer to a TV. (Info)
- Web workers: `typeof window === 'undefined'` makes `isBrowser` false, so a worker gets `'unknown'` everywhere even though `self.navigator.userAgent` is available there. Consistent with the SSR promise, just undocumented. (Info)
- A browser-like environment with `window` and `document` but no `navigator` throws at import (`src/index.ts:87`). No real browser lacks it; some test doubles do. (Info)

### 3.7 SSR and side effects

Correct. `isBrowser` guards every global (`src/index.ts:68-87, 370-380, 405, 421, 443, 469, 591`); `tests/ssr.test.ts` runs without a DOM and `tests/built/dist.test.ts:185-205` requires/imports the built files without globals. `sideEffects` is intentionally absent (defaults to true) — correct, and CLAUDE.md warns against `false`. `dist/react.*` carries `'use client'` and imports `current-device` rather than bundling a second copy (checked by `tests/built/dist.test.ts:231-237`).

---

## 4. Obsolete surface area, tooling and modernization

### 4.1 Dead platforms

Cost is measured on the minified+gzipped ESM build (5.9 KB / 2.06 KB gzip). Removing all five together saves roughly 400–500 bytes minified, well under 200 bytes gzipped. Bundle size is therefore not a reason to remove anything; API clarity and maintenance are.

| Platform | Code | Tests / fixtures | Recommendation | Reason |
| --- | --- | --- | --- | --- |
| BlackBerry | `src/index.ts:275-285` (3 methods) + class chain `:507-512` | 2 fixtures (BB10, PlayBook) | **Deprecate in 2.x docs, remove public methods in 3.0.** Keep the UA rule internally so a BlackBerry still reports `mobile`/`tablet`. | Platform dead since 2022; its browser cannot even run the ES2015 bundle (README says so). Removing `blackberry()` changes nothing for users who can run the code. |
| Firefox OS (`fxos*`) | `:305-315`, `:521-526` | 2 fixtures + KaiOS fixture | **Keep the detection, rename the story.** KaiOS (still sold in 2026 in India/Africa) uses this exact UA shape. Consider a `kaios()` alias in 2.x and folding `fxos*` into it in 3.0. | Firefox OS is dead, but the rule is what makes KaiOS `mobile`. |
| MeeGo | `:317-319`, `:527-528` | **no fixture** | **Remove in 3.0**; until then add a fixture or stop listing it. | One device (Nokia N9, 2011). Untested code path in the class chain. |
| Windows Phone | `:293-298`, `:513-520` | 3 fixtures | **Keep `windowsPhone()` internally, drop it from the public API in 3.0.** | The `windows()` exclusions in `iphone()`, `android()`, `fxos()` and `macos()` all exist because of Windows Phone UAs (`:223-224, 241, 258, 304-306`). The detection must stay; the method can go. |
| iPod | `:244-246`, `:485-486` | 1 fixture | **Keep.** | Two lines; iPod touch UAs still exist and are `ios mobile` either way. |

Remove-in-3.0 items should be announced as deprecated in the README and CHANGELOG of the last 2.x minor.

### 4.2 `noConflict()`

Meaningful only for the `<script>` build, where `device` is a common global name. For ESM/CJS consumers it exists only because the module unconditionally sets `window.device` (§2.1). Recommendation for 3.0: set `window.device` only in the IIFE build (tsup `define` or a separate entry) and keep `noConflict()` there; the ESM/CJS builds should not touch `window.device` at all. In 2.x, document that the global is set and that `noConflict()` undoes it.

### 4.3 Legacy patterns and targets

- The ES2015 floor is deliberate, enforced and documented; keep it. The `Object.prototype.hasOwnProperty.call(...)`, manual `for` loops and `indexOf` idioms are consistent with it; nothing is a leftover.
- `navigator.platform` (deprecated) is the one legacy API the library depends on (§3.4). `window.orientation` (deprecated) is the other (§3.5).
- Stale comments (§6.4) describe an older implementation but no legacy *code* remains.

### 4.4 Toolchain, CI and release pipeline

**Toolchain: keep it.** tsup + Vitest + pnpm + Changesets is the right size for a one-file library; there is no concrete benefit in changing any of them. Two additions have a concrete benefit:

- **Lint/format: none is configured** (ESLint and Prettier were removed in the 1.0.0 migration; only `.editorconfig` remains). The code base already drifts: `src/` has no trailing commas and no semicolons, `tests/` mixes trailing commas per file. A single Biome config (`biome.json`, one dev dependency, `pnpm biome check`) would cover both lint and format with near-zero maintenance. Severity: Low, but it is the cheapest quality gate you do not have.
- **Dependency automation is broken.** `renovate.json` (2019) extends the deprecated `config:base` preset, and Renovate has not opened a PR since January 2023 (`8fb33b5`). The 2026 bumps (`#395 #396 #398 #401`) are Dependabot *security* PRs, which GitHub sends without configuration; there is no `.github/dependabot.yml`, so no regular version updates happen. Pick one: delete `renovate.json` and add a `dependabot.yml` (npm + github-actions, monthly), or re-enable Renovate with `config:recommended`. Severity: Medium.

**Node versions:** `.nvmrc` = 24, both workflows use `node-version-file: .nvmrc`, `engines.node >= 16`. Consistent. Node 16 and 18 are end-of-life, but `engines` only matters for consumers running the CJS build on a server, and it works there. Raise to `>= 18` (or 20) in 3.0; there is no reason to do it in 2.x. Note that the local container had Node 22 and everything still passed.

**CI (`.github/workflows/ci.yml`):** typecheck → test → build → check:es2015 → test:dist → check:package, plus a `browsers` job that installs Chromium/Firefox/WebKit and runs Playwright in 7 device profiles. That is a strong pipeline for this library. Observations:

| Item | Finding | Severity |
| --- | --- | --- |
| Test matrix | Single OS, single Node. Fine: the package is a browser library; the only Node-specific code is the SSR path, and the dist tests cover both module formats. Not worth a matrix. | Info |
| Action pinning | `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`, `changesets/action@v1` are pinned to major tags, not SHAs. Current majors; consider SHA pinning with Dependabot `github-actions` updates. | Low |
| `pnpm install` without `--frozen-lockfile` in CI | pnpm defaults to frozen in CI (`CI=true`), so this is fine. | OK |
| Coverage | `test:coverage` exists but no coverage is uploaded or thresholded; `codecov.yml` is dead (§4.7). | Info |
| Playwright cache | Browsers are downloaded on every run (`playwright install --with-deps`). Caching `~/.cache/ms-playwright` keyed on the Playwright version would save ~1–2 min per run. | Info |

**Release (`.github/workflows/release.yml`):** Changesets action with npm trusted publishing (OIDC), `id-token: write`, provenance on, a fallback step that creates the GitHub release if the action did not. Tags v2.0.0–v2.3.0 all have matching GitHub releases and npm versions; `latest` is 2.3.0. This works. Two risks:

| Item | Finding | Severity |
| --- | --- | --- |
| Version PR is not CI-tested | `changesets/action` opens the "chore: version packages" PR with `GITHUB_TOKEN`; GitHub does not run `pull_request` workflows for PRs created by that token, so the version PR merges with no checks. And on merge to `main`, `release.yml` and `ci.yml` start in parallel: publishing does not wait for CI. The only gate before `npm publish` is `prepublishOnly` (build, es2015 check, dist tests) which skips `typecheck` and the source suite. Mitigation: either run `pnpm run typecheck && pnpm run test` as a step in `release.yml` before the Changesets step, or create the version PR with a fine-grained PAT / GitHub App token so CI runs on it. | Medium |
| Version history | npm has 0.10.2 → 2.0.0 with no 1.x; the CHANGELOG's "1.0.0 (2026-02-24)" section describes a version that was never published (the Changesets major bump from 1.0.0 produced 2.0.0). Confusing for anyone reading the changelog. | Low |

### 4.5 Bundle size

Measured on the HEAD build:

| File | Raw | Gzip | Minified | Minified + gzip |
| --- | --- | --- | --- | --- |
| `dist/index.global.js` (CDN) | 10,983 B | 2,718 B | 5,896 B | 2,057 B |
| `dist/index.mjs` | 10,215 B | 2,673 B | 5,907 B | 2,063 B |
| `dist/react.mjs` | 936 B | 370 B | 509 B | 264 B |
| 0.10.2 `umd/current-device.min.js` (for comparison) | | | 5,666 B | 1,945 B |

- **The CDN build is not minified** (`tsup.config.ts` has no `minify`). Bundler users minify anyway, but `<script src="https://unpkg.com/current-device">` users get the 11 KB file. Add `minify: true` for the IIFE entry (or emit an extra `index.global.min.js` and point `unpkg`/`jsdelivr` at it). Severity: Medium, effort 15 minutes.
- Nothing bloats the source. The largest single chunk is the 55-entry `televisionDevices` list plus `otherPhones` (`src/index.ts:90-186`), roughly 1 KB minified; it is the price of the TV/feature-phone detection added in the pending commit and is reasonable.
- The ESM build is ~5% larger minified than the old 0.10.2 build while detecting far more; that is fine.

### 4.6 Dependencies

`pnpm audit`: 13 advisories (form-data, ws, js-yaml, esbuild), **all reachable only through `jsdom@25`** and the rest of the dev tree; none ship to consumers. `pnpm outdated`: jsdom 25.0.1 → 30.1.1, @types/jsdom 21 → 30, vitest 4.1 → 5.0, typescript 5.9 → 7.0, @changesets/cli 2.29 → 3.0, changelog-github 0.5 → 1.0. Bumping jsdom is the one that clears the audit. Version pinning is inconsistent: `.npmrc` sets `save-exact=true` and some deps are exact (`@playwright/test 1.63.0`, `publint`, `attw`, changesets) while others are caret (`jsdom ^25`, `vitest ^4.1.11`, `tsup ^8`). Harmless, but pick one convention.

### 4.7 Repository hygiene

| Item | Finding | Severity |
| --- | --- | --- |
| `codecov.yml` | Contains a Codecov upload token in plain text (committed 2023-03-22, `af95870`). Codecov is not referenced anywhere else (no CI step, no badge). Upload tokens only allow posting coverage reports, so the blast radius is small, but it is still a committed secret. Delete the file and rotate/revoke the token in Codecov. | Medium |
| Issue templates | `.github/BUG_REPORT.md`, `FEATURE_REQUEST.md`, `QUESTION.md` have front matter for GitHub's template chooser, but GitHub only reads templates from `.github/ISSUE_TEMPLATE/`. They are never offered. (`BUG_REPORT.md` also says "Describe the Nug".) | Low |
| `SECURITY.md` | Missing. For a package with 25k weekly downloads, a two-line policy (report privately via GitHub security advisories; supported versions 2.x) is expected. | Low |
| `.github/CONTRIBUTING.md` | Says Node >= v4, `npm install`, `npm test`, `npm run clean` (no such script), and nothing about pnpm, changesets, `test:dist`, `test:browser` or the corpus. Everything CLAUDE.md gets right, CONTRIBUTING gets wrong. | Medium (contributors read this, not CLAUDE.md) |
| `AUTHORS` | Last touched 2018; lists "The Gitter Badger" and greenkeeper. Either regenerate from `git shortlog -se` or drop it in favour of `.all-contributorsrc`. | Info |
| `.all-contributorsrc` | Four entries, `commit: false`; no `all-contributors` tooling in `package.json`, so it is hand-maintained. Acceptable. | Info |
| `docs/plans/` | Three design/plan documents live under `docs/`, which is the GitHub Pages root, so they are published on the demo site's origin. One references a parent plan (`2026-02-25-phase1-v2x-hardening.md`) that does not exist in the repo. Move them to a non-published directory or delete. | Low |
| `FUNDING.yml`, `CODE_OF_CONDUCT.md`, `LICENSE`, `.editorconfig` | Current. | OK |

---

## 5. Tests

**Inventory:** 6 unit test files, 559 tests (558 pass, 1 expected failure); 1 dist test file, 89 tests; 1 Playwright spec × 7 profiles = 21 browser tests. 80 UA fixtures in `tests/ua-strings.ts`, every one with a `source` URL, shared by the src and dist suites, plus invariants in `tests/fixture-assertions.ts`. This is a genuinely good setup: the fixtures are recent (Chrome 134/139, iOS 18.3, Android 14/15, Tizen 2024, webOS 24), verbatim, and sourced.

**Stability:** 5 consecutive `pnpm run test` runs: identical results, 1.8–2.2 s each. No flaky test.

### 5.1 Coverage matrix (README promise × fixtures)

| README row | UA fixture(s) | Class assertion (dist) | Gap |
| --- | --- | --- | --- |
| iPad / iPhone / iPod | yes (8) | yes | — |
| Mac | yes (2) | yes | — |
| Android phone / tablet / TV | yes (many) | yes | Chrome reduced-UA (`Android 10; K`) phone and tablet are **not** in the fixtures although they are the majority of real Android traffic |
| BlackBerry phone / tablet | yes (2) | yes | — |
| Windows phone / desktop | yes | yes | **Windows tablet: no positive fixture** (only `windowsTablet: false` assertions) |
| Firefox OS phone / tablet | yes (2) | yes | — |
| MeeGo | **none** | **none** | untested README row and class-chain branch (`src/index.ts:527-528`) |
| Other phone → `mobile` | yes (9) | yes | — |
| Television | yes (18) | yes | — |
| ChromeOS / Linux | yes (2 + 4) | yes | — |
| HarmonyOS | yes (2) | yes | HarmonyOS NEXT missing (§3.3 B1) |
| Orientation × device | iOS (`window.orientation`), non-iOS (`screen.orientation`), desktop (resize), square viewport, unsubscribe | Playwright: 7 profiles | no test for the stale-`window.orientation` fallback (O2) or split-screen (O1) |
| SSR | yes (src + dist, both formats, hooks) | — | — |
| React hooks | yes (render, update, unmount, hydration) | — | — |

### 5.2 Modern UAs worth adding (all verbatim-able from public sources)

1. Chrome on Android, reduced UA, phone: `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36` and the tablet variant without `Mobile` (source: developer.chrome.com "User-Agent reduction").
2. HarmonyOS NEXT phone and tablet (`OpenHarmony 5.0`, ArkWeb) from Huawei's developer docs; make them `knownIssue` fixtures until B1 is fixed.
3. iPhone in desktop mode (Mac UA + `maxTouchPoints: 5`) as a `knownIssue` documenting B4.
4. Windows 11 Chromium Edge and Firefox with `maxTouchPoints: 10` asserting `desktop` (documents B5 rather than pretending).
5. Meta Quest 3 (X11 UA) and Quest 2 (Android UA); Xbox Edge; PlayStation 5; Nintendo Switch — assert current behaviour so a regression is visible.
6. Instagram/Facebook/WeChat in-app WebViews on Android (`; wv)`) and iOS.
7. Googlebot smartphone and desktop.
8. Samsung Internet 27 on Galaxy S24; Android 15 Pixel 9 (still `K` in Chrome, real model in Samsung Internet).
9. macOS Safari 18 on Apple Silicon (UA is frozen at `10_15_7`; document that).

### 5.3 Order- and environment-dependence (latent, not currently failing)

- `tests/index.test.ts:144-157` swaps `innerWidth`/`innerHeight` to trigger a callback and never restores them; every later test in the file sees a rotated viewport. Works today only because the following test derives its expectation from `device.orientation` itself.
- `tests/ua-detection.test.ts` and `tests/orientation.test.ts` re-import the module per test via `vi.resetModules()`. Each import registers a new `resize`/`orientationchange` listener on the shared jsdom `window` that is never removed, and each stale module keeps its own `currentOrientation` and its own captured UA. A later `dispatchEvent(new Event('resize'))` runs every stale handler, which adds/removes classes on the shared `documentElement`. It passes because every stale module computes the same orientation from the same `innerWidth/innerHeight`; a future test that changes viewport between imports without resetting classes would see phantom classes. A `beforeEach` that replaces `window.addEventListener` with a recorder, or a test-only `__dispose` export, would remove the hazard.
- `tests/classes.test.ts` and `tests/react.test.ts` rely on jsdom's default 1024×768 (landscape) starting state.
- `tests/index.test.ts:161-178` depends on jsdom exposing `window.process` (so `nodeWebkit()` is true). If jsdom stops doing that, the assertion silently switches to the other branch; not a failure, but the test then checks something different.

### 5.4 Edge cases with no test

Empty UA (behaves: `os: 'unknown', type: 'desktop'`, class `desktop` — verified in the harness, untested); missing `navigator` (throws — §3.6); web worker (`'unknown'` everywhere); `device.cordova()` true path (`file:` protocol + `window.cordova`); `noConflict()` called unbound; `screen.orientation` present but `onorientationchange` absent (desktop Chrome today — covered only implicitly by the "Desktop Chrome" Playwright profile).

---

## 6. Documentation and comments

### 6.1 README

Structure is good (install → CDN → React → SSR → TypeScript → CSS tables → JS tables → properties → best practices). Specific problems, in priority order:

1. **Fix the `device.os` value list** (§2.1) and add `'harmonyos'`; add HarmonyOS, `cordova`, `node-webkit` to the class table and `harmonyos()`, `cordova()`, `nodeWebkit()` to the method table; fix MeeGo (`meego mobile`); say that televisions have `type: 'desktop'`; say that KaiOS is reported as `fxos`.
2. **Add a "Limitations" section** (§3.1): reduced UAs, iPadOS/iPhone desktop mode, Windows/ChromeOS tablets, HarmonyOS NEXT, wearables/consoles/VR, and the two orientation definitions. Point to `matchMedia`, `pointer: coarse` and feature detection for layout decisions. The existing "Best Practices" paragraph is from the 2013 era and talks about Modernizr; keep the sentiment, refresh the text.
3. **Replace the 2017 screenshots** (`docs/iphone.png`, `android.png`, `blackberry.png`; last changed 2017-11-19). The BlackBerry tablet screenshot is the third thing a visitor sees. Either drop the images or show a modern iPhone/Android/desktop DevTools capture.
4. **Intro sentence** still lists "Blackberry, Windows, macOS, Firefox OS, MeeGo, AppleTV" (as does `package.json` `description`). Lead with iOS, Android, macOS, Windows, ChromeOS, Linux, TVs.
5. The React and SSR sections are good; add a short note for Vite/Astro/Remix users that the import has side effects (sets classes and `window.device`) and must not be tree-shaken, and that the classes appear only after the script runs (a flash of unstyled state with SSR).
6. Document that ESM/CJS imports also set `window.device` (§2.1) and what `noConflict()` returns.

### 6.2 Demo site (`docs/index.html`)

Works and uses the current build: it loads `https://unpkg.com/current-device` (resolves via the `unpkg` field to `dist/index.global.js`, verified with `curl`; the live GitHub Pages site serves the same file). Problems:

- The OS badge list and the CSS that lights badges (`docs/index.html:226-241`, `:434-446`) stop at `television`: **`chromeos`, `linux` and `harmonyos` never light up**, so a Chromebook or Linux visitor sees no OS badge even though the hero pill says the right thing.
- The quick-start comments say `device.orientation // 'portrait' or 'landscape'` and `device.type // 'mobile', 'tablet', or 'desktop'`; both omit `'unknown'`. Fine for a demo, but the README's TypeScript section shows the truth.
- The page loads `unpkg.com/current-device` unpinned, so a future 3.0 with a changed global would break the demo silently. Pin to `@2` (unpkg supports semver ranges).

### 6.3 CHANGELOG, CLAUDE.md

- `CHANGELOG.md` is complete and detailed from 2.0.0 onward (Changesets-generated). The "1.0.0" section describes a never-published version (§4.4); add one line saying so. There is no 0.x history (there never was a changelog before 2026), which is acceptable.
- `CLAUDE.md` is accurate about how the project works today; every command listed exists and works. Two nits: it says `pnpm exec playwright install` is needed for `test:browser` but does not say `--with-deps` on Linux; and the "Gotchas" list is now the best contributor documentation in the repo, which is why `CONTRIBUTING.md` should point at it or be rewritten from it.

### 6.4 Stale code comments (`src/index.ts`)

| Line | Comment | Why stale |
| --- | --- | --- |
| 86 | "Lowercase, so we can use the more efficient indexOf(), instead of Regex" | The file now uses three regexes (`:150, :156, :417`); the lowercase is still needed but the justification is wrong. |
| 191 | "Check if element exists" above `includes()` | It is a substring test, not an element check. |
| 466 | "Run device.js in noConflict mode" | The library was renamed from device.js years ago. |
| 191-199 | `includes()` + `find()` | Two names for one operation; `includes` is also the name of the ES2016 built-in the project deliberately avoids, which is confusing next to `lib: ES2015`. |
| 478 | "Insert the appropriate CSS class based on the user agent." | Still true, but the chain now also branches on `nodeWebkit()` and `cordova()`, which are not UA-based. |

`src/react.ts` comments are accurate.

### 6.5 Community files

Covered in §4.7: `CONTRIBUTING.md` stale (Medium), `SECURITY.md` missing (Low), `AUTHORS` stale (Info), issue templates in the wrong folder (Low), `.all-contributorsrc` fine.

---

## 7. Bugs

### 7.1 Confirmed (reproduced with the built bundle in a scratch harness outside the repo)

| ID | Bug | Repro | Suggested fix |
| --- | --- | --- | --- |
| B0 | (PR #420 only) HarmonyOS MatePad with `Mobile` → `type: 'tablet'` but classes `harmonyos mobile` | UA `Mozilla/5.0 (Linux; Android 10; HarmonyOS; MatePad 11; HMSCore 6.11.0.302) ... HuaweiBrowser/13.0.5.301 Mobile Safari/537.36` → `type=tablet tablet()=true classes="harmonyos mobile landscape"` | In `src/index.ts:493-498` branch on `device.androidTablet()` instead of `find('mobile')`; add the fixture |
| B1 | HarmonyOS NEXT tablet is `type: 'desktop'`, phone/tablet `os: 'unknown'` | UA `Mozilla/5.0 (Tablet; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 ArkWeb/4.1.6.1` → `os=unknown type=desktop classes="desktop"` | `harmonyos()` = `find('harmonyos') || find('openharmony')`; in the class chain use `find('(phone') / find('(tablet')` or the `mobile` token; add both fixtures |
| B2 | Linux + `window.process` → classes `node-webkit` only, no `linux desktop` | `Mozilla/5.0 (X11; Linux x86_64) ... Electron/30` with `window.process = {}` → `os=linux type=desktop classes="node-webkit landscape"` | Add `node-webkit` as an *additional* class (like `cordova`) instead of a branch of the OS chain |
| B3 | KaiOS reported as `fxos` while README says "mobile" | `Mozilla/5.0 (Mobile; rv:84.0) Gecko/84.0 Firefox/84.0 KAIOS/3.0` → `os=fxos classes="fxos mobile"` | Decide (README or code); the `'kaios'` entry in `otherPhones` is unreachable either way |
| B4 | iPhone in "Request Desktop Website" → `ios ipad tablet` | Mac Safari UA + `platform: 'MacIntel', maxTouchPoints: 5` → `os=ios type=tablet` | Not fixable by UA; document |
| B5 | IE11 desktop with touch → `windows tablet`; Surface in Edge/Chrome → `windows desktop` | `Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko` → `type=tablet`; `Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Chrome/129` + `maxTouchPoints: 10` → `type=desktop` | Document; or drop the `windows tablet` promise in 3.0 |
| B6 | `noConflict()` returns `undefined` when called unbound | `const { noConflict } = device; noConflict()` | `return device` |

### 7.2 Suspected (not reproduced; needs a device or more data)

- visionOS Safari being classified as iPad if it reports `maxTouchPoints > 1` (§3.4).
- Orientation on Android split-screen/foldables disagreeing with the CSS media query (O1). Logic is clear from the code; I had no device to confirm what `screen.orientation` reports in those modes.
- `uhd`/`iptv`/`mstar` substrings producing TV false positives on real phones (B9); the Matomo corpus shows none, but Matomo is not weighted by traffic.
- `window.orientation` removal in a future iOS regressing #367 (O2).

---

## 8. Issue and PR triage

Source: all 109 closed issues (there are no open issues) and all PRs from #420 down to #43 were read; behaviour claims were re-verified against the built bundle on both `main` and the PR #420 head.

### 8.1 Context that explains the issue history

- **Bulk close on 2026-02-25.** 34 issues were closed in one sweep with a boilerplate "closed as part of a major modernization … open a new issue if still relevant" comment and no linked fix. Most were later genuinely fixed by 2.1–2.3 (#367, #375, #153, #135, #182, #128, #90, #99) or are addressed by the pending PR #420 (#91, #22). The ones below were not, and still reproduce.
- The 2013–2019 orientation family (#2, #3, #44, #148, #164, #180, #183, #191, #216, #233, #367) is fully resolved on `main` and covered by `tests/orientation.test.ts` and the Playwright rotate test.
- Requests to widen scope (browser detection #178, OS versions #15, WeChat #107, retina #42, standalone #61, phablet #78) were all correctly declined; nothing in the README says so, which is why they keep coming.

### 8.2 Closed issues that still reproduce or were never really resolved

| Issue | Title (abridged) | Closed as | Still reproduces? | Recommendation |
| --- | --- | --- | --- | --- |
| [#363](https://github.com/matthewhudson/current-device/issues/363) | iPhone 6S Safari identified as tablet | bulk-closed, no fix | **Yes** on `main` and PR #420: Safari "Request Desktop Website" sends the Mac UA with `MacIntel` + `maxTouchPoints 5` → `ios ipad tablet` (B4). | Document as a known limitation; add a `knownIssue` fixture. Only a screen-size heuristic (`Math.min(screen.width, screen.height) < ~744`) could separate iPhone from iPad here. |
| [#362](https://github.com/matthewhudson/current-device/issues/362) | Huawei tablet not detected as tablet | bulk-closed, no fix | **Partial.** PR #420 fixes UAs naming `MediaPad`/`MatePad`; model-code-only UAs with `Mobile` (`VRD-W09`, `BAH4-W09`) are still `mobile` on both builds (verified). And on PR #420 the fixed case has the B0 class mismatch. | Add Huawei tablet model-code families (`-W09`, `-L09`, `-AL09` suffixes are tablet-only) to `androidTabletModel`; fix B0. |
| [#332](https://github.com/matthewhudson/current-device/issues/332) | 8-inch fold-out phone shows as tablet | bulk-closed, no fix | **Yes**: `SM-F926B` without `Mobile` → `android tablet` on both builds (verified). Chrome omits `Mobile` at ≥600 dp, so this is inherent. | Won't-fix and document, or a small foldable allow-list (`SM-F9xx`, `SM-F7xx`, Pixel Fold) if you accept a moving target. |
| [#273](https://github.com/matthewhudson/current-device/issues/273) (+ closed PR #376) | Re-evaluate device type on resize | bulk-closed | **Yes, by design**: `device.type`/`os` and their classes are computed once at import (`src/index.ts:617-633`); only orientation is live. Never documented. | State it in the README. If wanted, a `device.refresh()` that re-runs the class chain is what PR #376 tried to add. |
| [#64](https://github.com/matthewhudson/current-device/issues/64) / [#89](https://github.com/matthewhudson/current-device/issues/89) | Windows touch laptops / Surface Pro detected as tablet | bulk-closed; maintainer concluded in 2014 there is no reliable UA signal | **Yes** for IE11/EdgeHTML UAs with the `Touch` token (verified with the UA from #64); Surface in Chrome/Edge → `desktop`. | Low priority: only IE-era browsers send `Touch`, and they are outside the ES2015 floor. Document, or retire `windowsTablet()` in 3.0 (B5). |
| [#91](https://github.com/matthewhudson/current-device/issues/91) | Kindle Fire tablets detected as phone | bulk-closed, no fix | **Yes on `main`**, **fixed by PR #420** (`kf[a-z]{2,6}` in `androidTabletModel`; verified `KFTT … Silk … Mobile` → `android tablet`). | Merge #420. |
| [#22](https://github.com/matthewhudson/current-device/issues/22) | Symbian support | bulk-closed | **Yes on `main`** (`desktop/unknown`), **fixed by PR #420** (`otherPhones` → `mobile`). | Merge #420. |
| [#106](https://github.com/matthewhudson/current-device/issues/106) | iPad Pro inside Cordova reports iPhone | closed by reporter | **Yes, inherent**: that WebView's UA says `iPhone`. | Document. |
| [#72](https://github.com/matthewhudson/current-device/issues/72) | Wrong orientation inside an iframe | closed | **Partial**: non-iOS desktop falls back to the iframe's own `innerHeight >= innerWidth`. | Document if asked; otherwise none. |
| [#97](https://github.com/matthewhudson/current-device/issues/97) | Android soft keyboard flips to landscape | bulk-closed | **No** for Android Chrome/Firefox (they expose `onorientationchange`, so `screen.orientation` is used, which the keyboard does not change). Would still happen in a browser without that event. | None. |
| [#385](https://github.com/matthewhudson/current-device/issues/385) | unpkg URL broken after 2.0.0 | fixed in 2.0.1 | **No**, but the old `/umd/current-device.min.js` path is a 404 for `latest`; the README pins `@0.10.2` for it. | Add a one-line CHANGELOG note that `/umd/` is gone in 2.x. |

Everything else that was ever reported as a bug is verified fixed on `main`: iPadOS 13 (#217/#228/#260), BlackBerry `rim` false positives (#202), Windows Phone 8.1 (#90/#99), `screen.orientation` undefined (#164/#183), `for…in` callback crash (#216/#233), `cordova()` undefined (#247), SSR `window is not defined` (#128/#182), unsubscribe (#135), HarmonyOS (#375), Linux (#153), the `noConflict` typing (#269), and the whole iOS orientation family (#367 and predecessors).

### 8.3 Open pull requests

**[#420](https://github.com/matthewhudson/current-device/pull/420) "Detect Android TV, other televisions, and feature phones"** (author: the maintainer; `mergeable_state: clean`; CI green; no review comments). +645/−24 across 9 files; the changeset is *minor*. Verified effects on the built bundle: Chromecast `android tablet` → `android television` (type `desktop`); Chromebook Android app `tablet/android` → `desktop/chromeos`; `SM-T500 … Mobile` `mobile` → `tablet`; Fire tablets, Symbian and feature phones as above. It is relevant, not superseded, and resolves the still-open substance of #91, #22 and part of #362.

Before merging:

1. Fix **B0** (HarmonyOS class branch, `src/index.ts:493-498`) and add a `MatePad … Mobile` fixture.
2. Be explicit that this minor changes observable results for existing users: Android TVs lose the `tablet` class and `type` becomes `'desktop'`; several tablet UAs move from `mobile` to `tablet`; Chromebook Android apps change `os` from `android` to `chromeos`. The changeset says so; the PR body and the README's "Device Support" should too. Under strict semver these are arguably fixes, but they will change layouts for someone.
3. The documented regression (`KAZAM TV 45` phone → television, kept as an `it.fails` fixture) is an acceptable trade; the `uhd`/`iptv` substrings deserve one more corpus look (B9).

**[#416](https://github.com/matthewhudson/current-device/pull/416) "ci: deploy the demo site with a Docs workflow"** (maintainer; base is 3 commits behind `main` but `mergeable_state: clean`; CI green). Adds `.github/workflows/docs.yml` using `actions/deploy-pages@v5`, one CLAUDE.md line and an empty changeset. Still relevant, but its first run fails unless the repository's Pages source is switched to "GitHub Actions" first, and it stops Jekyll from rendering `docs/plans/*.md` (which is a good thing, see §4.7). Merge after flipping the Pages setting, or close if the default Pages build is fine.

### 8.4 Notable closed, unmerged PRs

| PR | Carried | Assessment |
| --- | --- | --- |
| [#405](https://github.com/matthewhudson/current-device/pull/405) ES5 output via SWC | Would have restored IE11/old-WebView support | Deliberately closed; policy formalised by #407 (ES2015 floor) and the README table. Not a lost fix. |
| [#392](https://github.com/matthewhudson/current-device/pull/392) "Expand device support" (bot-authored) | visionOS, ChromeOS/Linux, `classList`, console tokens, TV-first `os` order | Mostly superseded by #404/#412. **Never landed anywhere:** visionOS (its heuristic was unverified) and consoles (PS5/Switch → `desktop/unknown`, Xbox → `windows desktop` today). Its `os` reordering would have changed Android TV results, which #420 deliberately avoids. |
| [#376](https://github.com/matthewhudson/current-device/pull/376) re-runnable class insertion | Same need as #273 | Never landed; candidate feature if #273 is accepted. |
| [#380](https://github.com/matthewhudson/current-device/pull/380) HarmonyOS (external contributor) | HarmonyOS detection against the old JS source | Superseded by #391 (2.1.0). |

### 8.5 Recurring themes (issue numbers)

1. iPad / desktop-mode Safari UAs: #106, #217, #228, #260, #363, PR #392 (visionOS).
2. iOS orientation and event plumbing: #2, #3, #41, #44, #73, #97, #148, #164, #180, #183, #191, #216, #233, #367 — resolved.
3. Windows phone / tablet / touch laptop: #16, #33, #35, #64, #89, #90, #99.
4. Android tablet vs phone from the `Mobile` token: #78, #91, #332, #362, PR #420.
5. Televisions and set-top boxes: #79, #170, #183, #392, #411, #420; consoles still `unknown`.
6. SSR / non-browser / testability: #34, #111, #114, #128, #182 — resolved in 2.3.0.
7. Packaging and CDN paths: #85, #113, #115, #163, #201, #235, #265, #385, #405.
8. Scope creep requests: #15, #42, #61, #78, #107, #178 — declined, undocumented.
9. Static evaluation of type/OS: #273, PR #376 — undocumented.

---

## 9. Prioritized action plan

### Quick wins (under an hour each)

| Item | Effort |
| --- | --- |
| **Before merging #420:** fix B0 (`src/index.ts:493-498` → `device.androidTablet()`), add the MatePad-with-Mobile fixture, and list the behaviour changes in the PR body (§8.3) | 30 min |
| Merge or close #416 after switching the Pages source (§8.3) | 10 min |
| README: fix `device.os` values, add HarmonyOS/cordova/node-webkit rows, MeeGo class, TV `type`, KaiOS note (§2.1) | 30 min |
| Minify the IIFE build (`minify: true` on the first tsup entry, or a `.min.js`) (§4.5) | 15 min + a changeset |
| Delete `codecov.yml`, revoke the token (§4.7) | 10 min |
| Move issue templates to `.github/ISSUE_TEMPLATE/`, fix "Nug" (§4.7) | 10 min |
| Add `SECURITY.md` (§4.7) | 10 min |
| Rewrite `CONTRIBUTING.md` from CLAUDE.md's commands and gotchas (§4.7) | 30 min |
| Demo: add `chromeos`, `linux`, `harmonyos` badges; pin `unpkg.com/current-device@2` (§6.2) | 20 min |
| Fix the five stale comments (§6.4); `noConflict` `return device` (B6) | 15 min |
| Delete `renovate.json`, add `.github/dependabot.yml` for npm + github-actions (§4.4) | 15 min |
| Bump `jsdom` to 30 (clears all 13 audit advisories) (§4.6) | 15 min if the suite still passes |
| Move `docs/plans/` out of the Pages root (§4.7) | 5 min |

### Next minor release (2.4.0)

| Item | Effort |
| --- | --- |
| **HarmonyOS NEXT detection** (B1) + two fixtures | 1–2 h |
| Huawei tablet model-code families in `androidTabletModel` (#362) | 1 h |
| README: say that `type`/`os` are computed once at import and only orientation is live (#273); say that foldables (#332), desktop-mode iPhones (#363) and Cordova iPads (#106) are inherent misses | 30 min |
| `node-webkit` as an additive class (B2) — check whether anyone styles on `html.node-webkit:not(.linux)`; if in doubt, defer to 3.0 | 1 h |
| Add the modern fixtures in §5.2 (reduced UA, desktop-mode iPhone as knownIssue, Windows touch, VR/consoles, WebViews, Googlebot) | 2 h |
| Add a MeeGo fixture and a positive Windows-tablet fixture, or drop both rows from the README | 30 min |
| README "Limitations" section + refreshed intro and Best Practices (§6.1) | 2 h |
| Replace the 2017 screenshots (§6.1) | 1 h |
| Biome for lint + format, with a CI step (§4.4) | 1–2 h |
| Release workflow: run `typecheck` + `test` before the Changesets step, or create the version PR with a token that triggers CI (§4.4) | 1 h |
| Test hygiene: restore the viewport in `tests/index.test.ts`, stop stale listeners accumulating across `vi.resetModules()` (§5.3) | 2 h |
| Optional: low-entropy Client Hints (`navigator.userAgentData.mobile` / `.platform`) as a synchronous tie-breaker for Android phone vs. tablet under the reduced UA (§3.1, open question) | 3–4 h incl. tests |

### Next major release (3.0.0, breaking)

| Item | Effort |
| --- | --- |
| Remove `'iphone' | 'ipad' | 'ipod'` from `DeviceOs` (§2.3) | 30 min |
| Stop setting `window.device` from the ESM/CJS builds; keep it and `noConflict()` in the IIFE only (§4.2) | 2 h |
| Remove `blackberry*()`, `meego()`, `windowsPhone()` from the public API (keep the UA rules internally so those devices stay `mobile`/`tablet`); fold `fxos*()` into a `kaios()` or keep under a clearer name (§4.1) | 3 h incl. docs and changeset |
| Drop the `windows tablet` promise (B5) or replace it with a `pointer: coarse` heuristic (breaking because a touch laptop would become a tablet) | 2 h |
| One orientation definition via `matchMedia('(orientation: portrait)')`, re-verified on iOS for #367 (O1) | 4 h incl. device testing |
| Consider an optional `'television'` `DeviceType` (CLAUDE.md explains why it is breaking) | 2 h |
| `engines.node >= 18` or `>= 20` (§4.4) | 5 min |
| Remove the `declare global Window.device` augmentation from the ESM/CJS types (goes with the `window.device` change) | 30 min |

---

## 10. Open questions for the maintainer

1. **Positioning.** Do you want current-device to remain a "CSS classes for OS/type" utility (my recommendation: yes, and say so in the README), or to compete with ua-parser-js / device-detector on device identification? The second needs Client Hints, async APIs and a much larger rule set, which is a different library.
2. **Client Hints.** Should 2.x use the synchronous low-entropy `navigator.userAgentData` (`mobile`, `platform`) as a tie-breaker in Chromium? It improves Android phone/tablet under the reduced UA and costs ~150 bytes, but it introduces browser-specific behaviour and makes results differ between Chrome and Firefox on the same device.
3. **Dead platforms.** Are you comfortable removing `blackberry*()`, `meego()` and `windowsPhone()` from the public API in 3.0 (keeping the detection internal), and renaming the Firefox OS story to KaiOS? Or should 3.0 keep the full method list and only fix the types and globals?
4. **`window.device` for bundler users.** Is anyone relying on `import 'current-device'` producing a global? If not, 3.0 should stop setting it outside the IIFE build.
5. **Orientation semantics.** Screen orientation (current phone behaviour) or viewport orientation (CSS media query, current desktop behaviour)? One definition should win in 3.0; switching phones to the viewport definition changes what split-screen users see.
6. **`'television'` as a `DeviceType`.** TVs are `type: 'desktop'` today. A `'television'` type is the honest answer but changes `type` for existing TV users; is 3.0 the moment?
7. **B2 timing.** Making `node-webkit` additive changes the class list for Linux Electron apps that currently get only `node-webkit`. Patch, minor, or major?
8. **#273 / PR #376.** Should `device.type` ever be re-evaluated (a `refresh()` API)? Today it is a snapshot at import, which is simple and fast; a refresh API is a new surface with hydration implications for the React hooks.
9. **Codecov.** Do you want coverage reporting back (then wire it into CI properly) or should the token and file just go?
