import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    port: 4321,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
