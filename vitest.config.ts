import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['tests/unit/**/*.test.ts', 'tests/build/**/*.test.ts'],
  },
})
