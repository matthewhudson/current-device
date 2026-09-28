import { defineConfig, devices } from '@playwright/test'

// Real-engine tests for the <script> build (dist/index.global.js). Run after
// `pnpm run build`. Each project is a Playwright device profile, which sets
// the engine, UA, viewport, touch and mobile emulation.
export const deviceProfiles = [
  'Desktop Chrome',
  'Desktop Firefox',
  'Desktop Safari',
  'iPhone 15',
  'iPad Pro 11',
  'Pixel 7',
  'Galaxy Tab S4'
] as const

export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  projects: deviceProfiles.map((name) => ({ name, use: { ...devices[name] } }))
})
