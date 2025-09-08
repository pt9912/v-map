import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // oder 'happy-dom'
    globals: true,
    setupFiles: ['src/testing/setupTests.vitest.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
