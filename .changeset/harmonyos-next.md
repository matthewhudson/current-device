---
"current-device": minor
---

Detect HarmonyOS NEXT. Huawei's Android-free HarmonyOS (OpenHarmony 5 and later, ArkWeb browser engine) sends `(Phone; OpenHarmony 5.0) ... Mobile`, `(Tablet; OpenHarmony 5.0)` or `(PC; OpenHarmony 5.0; HarmonyOS 5.0)`. Phones were `mobile` with `os: 'unknown'`, and tablets and PCs were `desktop` with no OS. All three now report `os: 'harmonyos'` and `device.harmonyos()` is true; phones are `mobile`, tablets `tablet`, PCs `desktop`, with the `harmonyos mobile`, `harmonyos tablet` and new `harmonyos desktop` classes. `device.android()` stays false for them; it is true only for the Android-based HarmonyOS 2 to 4.
