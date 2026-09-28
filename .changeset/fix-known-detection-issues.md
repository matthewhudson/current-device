---
"current-device": patch
---

Fix three detection bugs found with real-world user agent strings:

- **Windows Phone 8.1** (IE Mobile 11) was detected as macOS, because its UA contains "Mac OS X". It now reports `os: 'windows'` with `windows mobile` classes, and `macos()` and `fxos()` return false.
- **Samsung Tizen smart TVs** were detected as Linux, because their UA says `SMART-TV` (with a hyphen). They now report `os: 'television'` with the `television` class.
- **BlackBerry PlayBook** was not detected, because its UA says "RIM Tablet OS" instead of BlackBerry. It now reports `os: 'blackberry'`, `type: 'tablet'` with `blackberry tablet` classes.
