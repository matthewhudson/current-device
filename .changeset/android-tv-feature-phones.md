---
"current-device": minor
---

Improve device detection, measured against the Matomo device-detector fixtures (35,777 user agents): correctly typed user agents go from 84% to 89%.

- **Android TV.** Android TVs, Google TV, Fire TV, Chromecast, Sony Bravia, Xiaomi Mi TV and Android set-top boxes were detected as Android tablets (or phones). `device.television()` is now true for them, `device.androidPhone()`, `device.androidTablet()`, `device.mobile()` and `device.tablet()` are false, `device.type` is `'desktop'` as for every television, and the `<html>` classes are `android television` instead of `android tablet`. `device.os` stays `'android'`. Detection went from 2% to 48% of the Android TV fixtures; the rest only carry a bare model number.
- **Other televisions.** Vizio SmartCast, Hisense VIDAA, Opera TV, Vestel-based sets and TVs running Opera's OMI browser were detected as Linux desktops. They now report `os: 'television'`.
- **Feature phones and other handsets.** Java ME (MIDP/CLDC), Symbian, Nokia Series 40/60, MediaTek MAUI, Openwave and WAP browsers, UC Browser and Opera Mini, NTT DoCoMo, Samsung Bada, Tizen, Sailfish and Palm webOS phones were detected as desktops. `device.mobile()` is now true for them, `device.type` is `'mobile'` and `<html>` gets the `mobile` class; `device.os` is `'unknown'`. Linux-based phones (Tizen, Sailfish) no longer count as `device.linux()`.
- **Android tablets whose browser says "Mobile".** Chrome adds "Mobile" on screens narrower than 600dp, which includes many 7" and 8" tablets. Well-known tablet families (Galaxy Tab `SM-T`/`SM-P`/`SM-X`, Lenovo `TB-`, "Tab 3", Huawei MediaPad/MatePad, Kindle Fire, and the `/apad` token of Yandex apps) are now tablets. Android tablet detection went from 81% to 85%.
- **Android apps on Chromebooks** (an Android user agent naming the Chromebook) were Android tablets. They now report `os: 'chromeos'`, `type: 'desktop'` and the `chromeos desktop` classes; `device.android()` stays true.
- **Windows Mobile and Windows CE** handsets (`IEMobile`, `Windows CE`) and Internet Explorer on Windows Phone 8.1 in desktop mode (`WPDesktop`, previously a Windows tablet) are now Windows phones.
- **Fix:** a TV whose maker name contains "mac" (Atmaca/Sunny) was detected as macOS.

Known limitation: a phone whose model name contains "TV" as a separate word (for example "KAZAM TV 45") is now detected as a television.
