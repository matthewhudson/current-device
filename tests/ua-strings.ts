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
      methods: { android: true, androidPhone: true, androidTablet: false, mobile: true, tablet: false, desktop: false },
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
      os: 'unknown',
      type: 'desktop',
      methods: { desktop: true, mobile: false, tablet: false, windows: false, macos: false, android: false },
    },
  },
  {
    name: 'Linux Firefox',
    ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
    expected: {
      os: 'unknown',
      type: 'desktop',
      methods: { desktop: true, mobile: false, tablet: false },
    },
  },

  // === Television ===
  {
    name: 'Smart TV (generic)',
    ua: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/63.0.3239.84 TV Safari/537.36 SmartTV',
    expected: {
      os: 'television',
      type: 'desktop',
      methods: { television: true },
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
      methods: { harmonyos: true, android: true, androidPhone: true, mobile: true, tablet: false, desktop: false },
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
      methods: { windows: true, windowsPhone: true, mobile: true, tablet: false, desktop: false },
    },
  },
]
