# Changelog

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
