# UA Hardening: Two Sequential PRs

**Date:** 2026-03-21
**Status:** Approved
**Parent plan:** Phase 1 v2.x Hardening (`2026-02-25-phase1-v2x-hardening.md`)

## Overview

Execute Phase 1 hardening as two sequential PRs with clean separation of concerns.

## PR 1: UA String Test Suite + Bug Fixes (patch)

**Branch:** `test/ua-string-detection`

**New files:**
- `tests/ua-strings.ts` — 24 real-world UA fixtures (iPhone, iPad, iPod, Android phones/tablets, macOS, Windows, Linux, Television, Windows Phone) with expected `os`, `type`, and method results
- `tests/ua-detection.test.ts` — Test harness using `vi.resetModules()` + dynamic `import()` to re-import the module with mocked `navigator.userAgent` per fixture

**Bug fixes:** Any detection issues revealed by the test suite (e.g., macOS vs iPadOS disambiguation via `maxTouchPoints`).

**Changeset:** patch

## PR 2: HarmonyOS Detection (minor)

**Branch:** `feat/harmonyos-detection` (branched from PR 1)

**Changes:**
- `src/index.ts` — Add `DeviceOs` type member, `Device` interface method, detection function, CSS class chain entry (before Android), `findMatch` ordering (before Android)
- `tests/ua-strings.ts` — Add 2 HarmonyOS fixtures (phone + tablet)
- `tests/index.test.ts` — Add API shape test

**Key detail:** HarmonyOS UAs contain "Android", so detection must be checked before Android in priority order.

**Changeset:** minor

## Merge order

1. Merge PR 1 to main
2. Rebase PR 2 onto main
3. Merge PR 2 to main
