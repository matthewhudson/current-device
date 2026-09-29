import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    // Needs a build first; run with `pnpm run test:dist`
    exclude: ['tests/built/**'],
  },
})
