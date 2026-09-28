---
"current-device": patch
---

Fix five long-standing detection reports:

- **iPhone in "Request Desktop Website" mode** (#363) was an iPad: Safari sends the Mac user agent, and the touchscreen check could not tell the two apart. The screen size now does: a phone-sized screen is `iphone()`/`mobile()`, an iPad-sized (or unknown) one stays `ipad()`/`tablet()`.
- **iPad inside a Cordova app that reports an iPhone user agent** (#106) is now `ipad()`/`tablet()` when the screen is iPad-sized.
- **Huawei and Honor tablets whose user agent only carries a model code** such as `VRD-W09` or `BAH4-W09` and says `Mobile` (#362) were phones. Model codes ending in `-W09` (Wi-Fi tablets; phones use `-L09`/`-AL00`) are now tablets. A HarmonyOS tablet in that situation also got the `harmonyos mobile` classes while `device.type` was `'tablet'`; the classes now follow `device.type`.
- **Foldable phones unfolded** (#332): Chrome drops `Mobile` on the wide inner screen, so a Galaxy Z Fold or Pixel Fold was a tablet. Both families are now phones whatever the fold state.
- **Windows touch-screen laptops in Internet Explorer** (#64) were tablets because IE said `Touch` on every touch device. `windowsTablet()` now also requires `ARM`, i.e. a Windows RT device (#89). Modern browsers on Windows never say `Touch`, so a Surface in Edge, Chrome or Firefox stays `desktop`, as before.

The README gains a "Limitations" section that covers these cases and that `device.type`/`device.os` are computed once at import and do not follow window resizes (#273).
