---
"current-device": minor
---

Add ChromeOS and Linux detection via `device.chromeos()` and `device.linux()`. ChromeOS and desktop Linux browsers now get the `chromeos desktop` / `linux desktop` CSS classes on `<html>` (previously just `desktop`), and `device.os` reports `'chromeos'` / `'linux'` instead of `'unknown'`. Android, HarmonyOS and smart TVs, which also report "Linux" in their user agent, are unchanged. The `DeviceOs` type gains `'chromeos'` and `'linux'`.
