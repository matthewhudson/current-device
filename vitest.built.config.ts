import { defineConfig } from 'vitest/config'

// Tests for the built files in dist/. Run after `pnpm run build`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/built/**/*.test.ts']
  }
})
