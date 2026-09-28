# Changelog

## 2.2.0

### Minor Changes

- [#404](https://github.com/matthewhudson/current-device/pull/404) [`defdd9e`](https://github.com/matthewhudson/current-device/commit/defdd9e72ba14320db487c0b342637efb17bf810) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Add ChromeOS and Linux detection via `device.chromeos()` and `device.linux()`. ChromeOS and desktop Linux browsers now get the `chromeos desktop` / `linux desktop` CSS classes on `<html>` (previously just `desktop`), and `device.os` reports `'chromeos'` / `'linux'` instead of `'unknown'`. Android, HarmonyOS and smart TVs, which also report "Linux" in their user agent, are unchanged. The `DeviceOs` type gains `'chromeos'` and `'linux'`.

### Patch Changes

- [#414](https://github.com/matthewhudson/current-device/pull/414) [`f0091b2`](https://github.com/matthewhudson/current-device/commit/f0091b2cd0cf03a5f99be52b37c31d59fd7ee927) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix three false positives in Apple device detection:

  - **iPads whose user agent says `iPad; CPU iPhone OS`** (seen on iPad mini) were detected as both iPhone and iPad, and reported `type: 'mobile'` with `ios ipad tablet` classes. `device.iphone()` and `device.mobile()` now return false for them and `device.type` is `'tablet'`.
  - **Android devices with "mac" in their user agent**, such as a model named "Mac Audio", were given the `macos desktop` classes and `device.macos()` returned true. `device.macos()` is now false on Android.
  - **The iPadOS 13+ check** (`navigator.platform` is `MacIntel` and the device has a touchscreen) ignored the user agent, so a Windows or Android user agent in such an environment was detected as an iPad. It now also requires a Mac user agent.

- [#412](https://github.com/matthewhudson/current-device/pull/412) [`e9f780e`](https://github.com/matthewhudson/current-device/commit/e9f780ebc5faf45095d03fa6ae075ca97c50f2b6) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix the `<html>` class handling when the page has its own classes that contain a class name current-device uses. Classes were matched as substrings, so with `<html class="landscape-hero">` the `landscape` class was never added, and with `<html class="theme portrait-gallery">` removing `portrait` rewrote the page's class to `theme-gallery`. An orientation class that was the first class on `<html>` was also never removed. Classes are now added and removed with `classList`.

- [#411](https://github.com/matthewhudson/current-device/pull/411) [`952baa4`](https://github.com/matthewhudson/current-device/commit/952baa4923352c30f92def79ef7fc73d70a0956d) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix three detection bugs found with real-world user agent strings:

  - **Windows Phone 8.1** (IE Mobile 11) was detected as macOS, because its UA contains "Mac OS X". It now reports `os: 'windows'` with `windows mobile` classes, and `macos()` and `fxos()` return false.
  - **Samsung Tizen smart TVs** were detected as Linux, because their UA says `SMART-TV` (with a hyphen). They now report `os: 'television'` with the `television` class.
  - **BlackBerry PlayBook** was not detected, because its UA says "RIM Tablet OS" instead of BlackBerry. It now reports `os: 'blackberry'`, `type: 'tablet'` with `blackberry tablet` classes.

- [#402](https://github.com/matthewhudson/current-device/pull/402) [`45809bb`](https://github.com/matthewhudson/current-device/commit/45809bbf8a989a5690e7c86a5363fbfe14e54bd4) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix orientation detection in Safari on iOS 16.4+. `device.landscape()`, `device.portrait()`, the `landscape`/`portrait` CSS classes and `onChangeOrientation` callbacks reported the previous orientation after a rotation, because iOS updates `screen.orientation` only after the `orientationchange` event fires. iOS now uses `window.orientation`, which is updated in time. Fixes #367.

- [#413](https://github.com/matthewhudson/current-device/pull/413) [`ba29fc5`](https://github.com/matthewhudson/current-device/commit/ba29fc5ccfd7e3b95268b4122094e779ffee38c7) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix `device.onChangeOrientation()` callbacks being called when the orientation did not change. On browsers without the `orientationchange` event (all desktop browsers) current-device listens to `resize`, and it called every callback and rewrote the `<html>` classes on each resize event, so dragging a window edge called them continuously. Callbacks are now called, and the `landscape`/`portrait` classes updated, only when the orientation changes.

- [#415](https://github.com/matthewhudson/current-device/pull/415) [`e363ec5`](https://github.com/matthewhudson/current-device/commit/e363ec573f98b10c849477e7fdcc4f0b88e1d20b) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Fix the orientation of a square viewport. When the viewport's width and height were equal, `<html>` got the `portrait` class, but `device.portrait()` and `device.landscape()` both returned false and `device.orientation` was `'unknown'`. A square viewport is now portrait everywhere, which matches the CSS `(orientation: portrait)` media query.

## 2.1.0

### Minor Changes

- [#390](https://github.com/matthewhudson/current-device/pull/390) [`4b860a1`](https://github.com/matthewhudson/current-device/commit/4b860a1ad5b159ed55967c25aefb77c1c7faa723) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Add HarmonyOS device detection via `device.harmonyos()`. HarmonyOS devices now get the `harmonyos` CSS class on `<html>` instead of `android`. Closes #375.

### Patch Changes

- [#390](https://github.com/matthewhudson/current-device/pull/390) [`4b860a1`](https://github.com/matthewhudson/current-device/commit/4b860a1ad5b159ed55967c25aefb77c1c7faa723) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Add real-world UA string test suite with 24 device fixtures covering iPhone, iPad, iPod, Android phones/tablets, macOS, Windows, Linux, Television, and edge cases. Fix `device.macos()` false positive on iOS devices (UA strings contain "Mac OS X").

## 2.0.2

### Patch Changes

- [#388](https://github.com/matthewhudson/current-device/pull/388) [`5253319`](https://github.com/matthewhudson/current-device/commit/52533192b45da80c26dfb6e35b1b6fa6fed8babf) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Remove Node.js >= 22 requirement for consumers (lowered to >= 16). Add CDN script tag usage docs to README.

## 2.0.1

### Patch Changes

- [`f44779e`](https://github.com/matthewhudson/current-device/commit/f44779e3493ab64412eb434bae73459b8fa51fee) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Add IIFE build output for browser `<script>` tag usage via CDN (unpkg, jsdelivr). Fixes #385 where the UMD build was removed in v2.0.0, breaking `<script src="https://unpkg.com/current-device">` imports.

## 2.0.0

### Major Changes

- [`e78a749`](https://github.com/matthewhudson/current-device/commit/e78a74932146f172a1db264591dc72c4dae03744) Thanks [@matthewhudson](https://github.com/matthewhudson)! - Migrated source code from JavaScript to TypeScript with strict type checking. Minimum Node.js version is now 22. Build output moved from lib/, es/, umd/ to dist/. See CHANGELOG.md for full migration guide.

## 1.0.0 (2026-02-24) - BREAKING

### Changed

- **BREAKING**: Migrated source code from JavaScript to TypeScript with strict type checking
- **BREAKING**: Minimum Node.js version is now 22 (previously 10)
- **BREAKING**: Package manager changed to pnpm (npm/yarn still work for consumers)
- **BREAKING**: Build output moved from `lib/`, `es/`, `umd/` to `dist/` — consumers using deep imports into those directories must update their paths
- Replaced `nwb` build toolchain with `tsup` (esbuild-based, faster builds)
- Replaced Karma/Mocha test setup with Vitest + jsdom
- Replaced Travis CI with GitHub Actions
- Removed legacy `window.attachEvent` fallback (IE-only, not needed for modern browsers)

### Added

- Full TypeScript type definitions exported from source (no separate `.d.ts` file needed)
- Exported types: `Device`, `DeviceType`, `DeviceOs`, `DeviceOrientation`, `OrientationChangeCallback`
- Proper `package.json` `exports` field for dual CJS/ESM support
- GitHub Actions CI workflow

### Removed

- `nwb` build dependency
- `eslint` and `prettier` dev dependencies (TypeScript compiler handles code quality)
- UMD build output (use ESM or CJS instead; for browser `<script>` tags, use a CDN that supports ESM)
- Travis CI configuration

### Migration Guide

**For npm/yarn consumers**: No changes needed to your import statements. The public API is identical:

```ts
import device from "current-device";
device.mobile(); // still works exactly the same
```

**If you were importing from internal paths** (e.g., `current-device/lib/...` or `current-device/umd/...`), update to use the package entry point instead.

**If you were using the UMD build via `<script>` tag**, switch to an ESM-compatible CDN or bundler.
