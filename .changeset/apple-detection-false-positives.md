---
"current-device": patch
---

Fix three false positives in Apple device detection:

- **iPads whose user agent says `iPad; CPU iPhone OS`** (seen on iPad mini) were detected as both iPhone and iPad, and reported `type: 'mobile'` with `ios ipad tablet` classes. `device.iphone()` and `device.mobile()` now return false for them and `device.type` is `'tablet'`.
- **Android devices with "mac" in their user agent**, such as a model named "Mac Audio", were given the `macos desktop` classes and `device.macos()` returned true. `device.macos()` is now false on Android.
- **The iPadOS 13+ check** (`navigator.platform` is `MacIntel` and the device has a touchscreen) ignored the user agent, so a Windows or Android user agent in such an environment was detected as an iPad. It now also requires a Mac user agent.
