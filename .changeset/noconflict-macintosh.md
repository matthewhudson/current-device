---
"current-device": patch
---

- `device.noConflict()` returned `this`, so calling it unbound (`const { noConflict } = device; noConflict()`) returned `undefined` although its type says `Device`. It now always returns the `device` object.
- `device.macos()` matched any user agent containing "mac", which is why the "Mac Audio" and "Atmaca" device makers needed special cases. It now requires "Macintosh" or "Mac OS", which every Mac browser sends; iOS and Windows Phone user agents, which contain "Mac OS X", were already excluded.
