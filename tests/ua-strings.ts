export interface UAFixture {
  name: string
  ua: string
  expected: {
    os: string
    type: string
    methods: Record<string, boolean>
  }
  navigatorOverrides?: {
    platform?: string
    maxTouchPoints?: number
  }
  /** Where the UA string was taken from (copied verbatim) */
  source?: string
  /**
   * A known detection bug. `expected` holds the *correct* result, and the
   * test is expected to fail until the bug is fixed; then remove this field.
   */
  knownIssue?: string
}

export const uaFixtures: UAFixture[] = [
  // === iOS: iPhone ===
  // Note: device.os returns 'ios' for all iOS devices because 'ios' is checked
  // first in findMatch. Use device.iphone()/ipad()/ipod() for specific detection.
  {
    name: 'iPhone Safari (iOS 18)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1',
    expected: {
      os: 'ios',
      type: 'mobile',
      methods: { iphone: true, ios: true, mobile: true, tablet: false, desktop: false, macos: false, android: false },
    },
  },
  {
    name: 'iPhone Chrome (iOS 18)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/134.0.6998.99 Mobile/15E148 Safari/604.1',
    expected: {
      os: 'ios',
      type: 'mobile',
      methods: { iphone: true, ios: true, mobile: true, tablet: false, desktop: false, macos: false, android: false },
    },
  },
  {
    name: 'iPhone (older iOS 15)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
    expected: {
      os: 'ios',
      type: 'mobile',
      methods: { iphone: true, ios: true, mobile: true, tablet: false, desktop: false },
    },
  },

  // === iOS: iPad ===
  {
    name: 'iPad Safari (mobile UA, iPadOS 17)',
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
    expected: {
      os: 'ios',
      type: 'tablet',
      methods: { ipad: true, ios: true, tablet: true, mobile: false, desktop: false, macos: false },
    },
  },
  {
    name: 'iPad Safari (desktop mode, iPadOS 13+)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.10 Safari/605.1.15',
    navigatorOverrides: { platform: 'MacIntel', maxTouchPoints: 5 },
    expected: {
      os: 'ios',
      type: 'tablet',
      methods: { ipad: true, ios: true, tablet: true, mobile: false, desktop: false },
    },
  },

  // === iOS: iPod ===
  {
    name: 'iPod Touch Safari',
    ua: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    expected: {
      os: 'ios',
      type: 'mobile',
      methods: { ipod: true, ios: true, mobile: true, tablet: false, desktop: false },
    },
  },

  // === Android: Phones ===
  {
    name: 'Android Chrome phone',
    ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
    expected: {
      os: 'android',
      type: 'mobile',
      methods: { android: true, androidPhone: true, androidTablet: false, mobile: true, tablet: false, desktop: false, linux: false },
    },
  },
  {
    name: 'Samsung Browser phone',
    ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36',
    expected: {
      os: 'android',
      type: 'mobile',
      methods: { android: true, androidPhone: true, mobile: true, tablet: false, desktop: false },
    },
  },
  {
    name: 'Android Chrome (older, specific device)',
    ua: 'Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36',
    expected: {
      os: 'android',
      type: 'mobile',
      methods: { android: true, androidPhone: true, mobile: true, tablet: false, desktop: false },
    },
  },

  // === Android: Tablets ===
  {
    name: 'Android tablet Chrome',
    ua: 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Safari/537.36',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { android: true, androidTablet: true, androidPhone: false, tablet: true, mobile: false, desktop: false },
    },
  },

  // === macOS ===
  {
    name: 'macOS Safari',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.10 Safari/605.1.15',
    navigatorOverrides: { platform: 'MacIntel', maxTouchPoints: 0 },
    expected: {
      os: 'macos',
      type: 'desktop',
      methods: { macos: true, desktop: true, ios: false, ipad: false, mobile: false, tablet: false },
    },
  },
  {
    name: 'macOS Chrome',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    navigatorOverrides: { platform: 'MacIntel', maxTouchPoints: 0 },
    expected: {
      os: 'macos',
      type: 'desktop',
      methods: { macos: true, desktop: true, ios: false, mobile: false, tablet: false },
    },
  },

  // === Windows ===
  {
    name: 'Windows Chrome',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    expected: {
      os: 'windows',
      type: 'desktop',
      methods: { windows: true, desktop: true, windowsPhone: false, windowsTablet: false, mobile: false, tablet: false },
    },
  },
  {
    name: 'Windows Edge',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.3124.85',
    expected: {
      os: 'windows',
      type: 'desktop',
      methods: { windows: true, desktop: true, windowsPhone: false, mobile: false, tablet: false },
    },
  },
  {
    name: 'Windows Firefox',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
    expected: {
      os: 'windows',
      type: 'desktop',
      methods: { windows: true, desktop: true, mobile: false, tablet: false },
    },
  },

  // === Linux ===
  {
    name: 'Linux Chrome',
    ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    expected: {
      os: 'linux',
      type: 'desktop',
      methods: { linux: true, chromeos: false, desktop: true, mobile: false, tablet: false, windows: false, macos: false, android: false },
    },
  },
  {
    name: 'Linux Firefox',
    ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
    expected: {
      os: 'linux',
      type: 'desktop',
      methods: { linux: true, chromeos: false, desktop: true, mobile: false, tablet: false },
    },
  },

  // === ChromeOS ===
  {
    name: 'ChromeOS Chrome (x86_64)',
    ua: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    expected: {
      os: 'chromeos',
      type: 'desktop',
      methods: { chromeos: true, linux: false, desktop: true, mobile: false, tablet: false, android: false },
    },
  },
  {
    name: 'ChromeOS Chrome (ARM)',
    ua: 'Mozilla/5.0 (X11; CrOS aarch64 15329.44.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    expected: {
      os: 'chromeos',
      type: 'desktop',
      methods: { chromeos: true, linux: false, desktop: true },
    },
  },

  // === Television ===
  {
    name: 'Smart TV (generic)',
    ua: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/63.0.3239.84 TV Safari/537.36 SmartTV',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, linux: false },
    },
  },
  {
    name: 'Roku',
    ua: 'Roku/DVP-11.5 (11.5.0), Roku/DVP-11.5 (11.5.0)',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true },
    },
  },
  {
    name: 'Apple TV',
    ua: 'AppleTV11,1/11.1',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true },
    },
  },

  // === HarmonyOS ===
  {
    name: 'HarmonyOS phone (Huawei Browser)',
    ua: 'Mozilla/5.0 (Linux; Android 10; HarmonyOS; ELS-AN10; HMSCore 6.0.0.306) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 HuaweiBrowser/11.1.2.301 Mobile Safari/537.36',
    expected: {
      os: 'harmonyos',
      type: 'mobile',
      methods: { harmonyos: true, android: true, androidPhone: true, mobile: true, tablet: false, desktop: false, linux: false },
    },
  },
  {
    name: 'HarmonyOS tablet (Huawei Browser)',
    ua: 'Mozilla/5.0 (Linux; Android 12; HarmonyOS; BRT-W09; HMSCore 6.14.0.322) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 HuaweiBrowser/15.0.9.300 Safari/537.36',
    expected: {
      os: 'harmonyos',
      type: 'tablet',
      methods: { harmonyos: true, android: true, androidTablet: true, tablet: true, mobile: false, desktop: false },
    },
  },

  // === Edge cases ===
  {
    name: 'Windows Phone',
    ua: 'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254',
    expected: {
      os: 'windows',
      type: 'mobile',
      methods: { windows: true, windowsPhone: true, mobile: true, tablet: false, desktop: false, chromeos: false },
    },
  },

  // ==========================================================================
  // Real-world UA strings copied verbatim from the cited source
  // ==========================================================================

  // === Android: WebView, Firefox, Amazon, Samsung ===
  {
    name: 'Android WebView (Android 5)',
    ua: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36',
    source: 'https://github.com/GoogleChrome/developer.chrome.com/blob/main/site/en/docs/multidevice/user-agent/index.md',
    expected: {
      os: 'android',
      type: 'mobile',
      methods: { android: true, androidPhone: true, androidTablet: false, linux: false },
    },
  },
  {
    name: 'Firefox for Android phone',
    ua: 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0',
    source: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent/Firefox',
    expected: {
      os: 'android',
      type: 'mobile',
      methods: { android: true, androidPhone: true, fxos: false },
    },
  },
  {
    name: 'Firefox for Android tablet',
    ua: 'Mozilla/5.0 (Android 4.4; Tablet; rv:41.0) Gecko/41.0 Firefox/41.0',
    source: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent/Firefox',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { android: true, androidTablet: true, fxos: false },
    },
  },
  {
    name: 'Amazon Fire tablet (Silk)',
    ua: 'Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/44.1.54 like Chrome/44.0.2403.63 Safari/537.36',
    source: 'https://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { android: true, androidTablet: true, mobile: false },
    },
  },
  {
    name: 'Kindle Fire (1st gen)',
    ua: 'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Kindle Fire Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Safari/533.1',
    source: 'https://developer.amazon.com/docs/fire-tablets/ft-user-agent-strings.html',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { android: true, androidTablet: true },
    },
  },
  {
    name: 'Samsung Internet tablet',
    ua: 'Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-T500) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.1 Chrome/79.0.3945.136 Safari/537.36',
    source: 'https://user-agents.net/string/mozilla-5-0-linux-android-10-samsung-sm-t500-applewebkit-537-36-khtml-like-gecko-samsungbrowser-12-1-chrome-79-0-3945-136-safari-537-36',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { android: true, androidTablet: true, mobile: false },
    },
  },

  // === iOS: other browsers ===
  {
    name: 'Chrome on iPad (CriOS)',
    ua: 'Mozilla/5.0 (iPad; CPU OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1',
    source: 'https://user-agents.net/string/mozilla-5-0-ipad-cpu-os-16-1-like-mac-os-x-applewebkit-605-1-15-khtml-like-gecko-crios-111-0-5563-101-mobile-15e148-safari-604-1',
    expected: {
      os: 'ios',
      type: 'tablet',
      methods: { ios: true, ipad: true, macos: false },
    },
  },
  {
    name: 'Firefox on iPhone (FxiOS)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
    source: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent/Firefox',
    expected: {
      os: 'ios',
      type: 'mobile',
      methods: { ios: true, iphone: true, macos: false },
    },
  },

  // === Desktop: Opera ===
  {
    name: 'Opera on Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 OPR/124.0.0.0 (Edition developer)',
    source: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent',
    expected: {
      os: 'windows',
      type: 'desktop',
      methods: { windows: true, desktop: true },
    },
  },
  {
    name: 'Opera on Linux',
    ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41',
    source: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/User-Agent',
    expected: {
      os: 'linux',
      type: 'desktop',
      methods: { linux: true, desktop: true },
    },
  },

  // === Legacy mobile platforms ===
  {
    name: 'BlackBerry 10',
    ua: 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
    source: 'https://firt.dev/blackberry-10/',
    expected: {
      os: 'blackberry',
      type: 'mobile',
      methods: { blackberry: true, blackberryPhone: true, blackberryTablet: false },
    },
  },
  {
    name: 'BlackBerry PlayBook',
    ua: 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+',
    source: 'https://user-agents.net/string/mozilla-5-0-playbook-u-rim-tablet-os-2-1-0-en-us-applewebkit-536-2-khtml-like-gecko-version-7-2-1-0-safari-536-2',
    expected: {
      os: 'blackberry',
      type: 'tablet',
      methods: { blackberry: true, blackberryTablet: true },
    },
  },
  {
    name: 'Windows Phone 8.1 (IE Mobile 11)',
    ua: 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    source: 'https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/hh869301(v=vs.85)',
    expected: {
      os: 'windows',
      type: 'mobile',
      methods: { windows: true, windowsPhone: true, macos: false, fxos: false },
    },
  },
  {
    name: 'Firefox OS phone',
    ua: 'Mozilla/5.0 (Mobile; rv:26.0) Gecko/26.0 Firefox/26.0',
    source: 'https://github.com/mdn/content/blob/cbe151a06d6e5b4d1fbb46081bd16e69ef4c1630/files/en-us/web/http/headers/user-agent/firefox/index.html',
    expected: {
      os: 'fxos',
      type: 'mobile',
      methods: { fxos: true, fxosPhone: true, fxosTablet: false },
    },
  },
  {
    name: 'Firefox OS tablet',
    ua: 'Mozilla/5.0 (Tablet; rv:26.0) Gecko/26.0 Firefox/26.0',
    source: 'https://github.com/mdn/content/blob/cbe151a06d6e5b4d1fbb46081bd16e69ef4c1630/files/en-us/web/http/headers/user-agent/firefox/index.html',
    expected: {
      os: 'fxos',
      type: 'tablet',
      methods: { fxos: true, fxosTablet: true, fxosPhone: false },
    },
  },

  // === Television ===
  {
    name: 'Samsung Tizen TV (2024)',
    ua: 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 8.0) AppleWebKit/537.36 (KHTML, like Gecko) 108.0.5359.1/8.0 TV Safari/537.36',
    source: 'https://developer.samsung.com/smarttv/develop/guides/fundamentals/retrieving-platform-information.html',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, linux: false },
    },
  },
  {
    name: 'LG webOS TV 24',
    ua: 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.211 Safari/537.36 WebAppManager',
    source: 'https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, linux: false },
    },
  },
  {
    name: 'HbbTV (Telefunken)',
    ua: 'Mozilla/5.0 (Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36 OPR/31.0.1890.0 OMI/4.6.1.40.Dominik2.0 VSTVB MB100 HbbTV/1.2.1 (; TELEFUNKEN; MB110; 2.9.8.0; ;) SmartTvA/3.0.0',
    source: 'https://deviceatlas.com/blog/list-smart-tv-user-agent-strings',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, linux: false },
    },
  },
  {
    name: 'Philips NetTV',
    ua: 'Opera/9.80 (Linux mips ; U; HbbTV/1.1.1 (; Philips; ; ; ; ) CE-HTML/1.0 NETTV/4.3.3 PHILIPSTV/1.1.1 Firmware/173.60.0 (PhilipsTV, 1.1.1,) en Presto/2.12.362 Version/12.11',
    source: 'https://user-agents.net/string/opera-9-80-linux-mips-u-hbbtv-1-1-1-philips-ce-html-1-0-nettv-4-3-3-philipstv-1-1-1-firmware-173-60-0-philipstv-1-1-1-en-presto-2-12-362-version-12-11',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, linux: false },
    },
  },
  {
    name: 'Google TV',
    ua: 'Mozilla/5.0 (Linux; GoogleTV 3.2; NSZ-GS7/GX70 Build/MASTER) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Safari/534.24',
    source: 'https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true, android: false, linux: false },
    },
  },
  {
    name: 'Panasonic Viera',
    ua: 'Mozilla/5.0 (X11; FreeBSD; U; Viera; de-DE) AppleWebKit/537.11 (KHTML, like Gecko) Viera/3.10.0 Chrome/23.0.1271.97 Safari/537.11',
    source: 'https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true },
    },
  },
  {
    name: 'DLNA player (Sharp)',
    ua: 'DLNADOC/1.50 SHARP-AQUOS-DMP/2.0W',
    source: 'https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true },
    },
  },
  // television() is true, but os reports the platform: television is checked last
  {
    name: 'POV TV stick (Android)',
    ua: 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; POV_TV-HDMI-KB-01 Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
    source: 'https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures',
    expected: {
      os: 'android',
      type: 'tablet',
      methods: { television: true, android: true },
    },
  },
  // television() is true, but os reports the platform: television is checked last
  {
    name: 'Kylo (TV browser on Windows)',
    ua: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2) Gecko/20100222 Firefox/3.6 Kylo/0.6.1.70394',
    source: 'https://github.com/matomo-org/device-detector/tree/master/Tests/fixtures',
    expected: {
      os: 'windows',
      type: 'desktop',
      methods: { television: true, windows: true },
    },
  },
]
