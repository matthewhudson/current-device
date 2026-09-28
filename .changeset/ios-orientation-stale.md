---
"current-device": patch
---

Fix orientation detection in Safari on iOS 16.4+. `device.landscape()`, `device.portrait()`, the `landscape`/`portrait` CSS classes and `onChangeOrientation` callbacks reported the previous orientation after a rotation, because iOS updates `screen.orientation` only after the `orientationchange` event fires. iOS now uses `window.orientation`, which is updated in time. Fixes #367.
