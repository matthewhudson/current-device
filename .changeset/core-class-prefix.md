---
"current-device": minor
---

Add `current-device/core`, an entry point with no side effects on import, for scripts that run on pages they don't own. Importing `current-device` adds generic class names such as `mobile` and `desktop` to `<html>`, which can collide with the page's own CSS. `current-device/core` exports `createDevice({ classPrefix })`: calling it adds the classes with the given prefix (`cd-ios cd-iphone cd-mobile cd-portrait`), starts the orientation listener and returns a device object with the whole API. The prefix applies to every class, the orientation classes included. The returned object is not assigned to the `device` global, and the user agent is read when `createDevice()` is called rather than at import, which also makes detection easy to unit-test. Without a DOM it returns the same `'unknown'` device as the main entry point. The main entry point, the `<script>` build and `current-device/react` are unchanged.
