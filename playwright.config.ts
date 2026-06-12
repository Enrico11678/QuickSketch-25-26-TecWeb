// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',

  use: {
    // Puntiamo a localhost perché Nginx nel container è mappato sulla porta 80
    baseURL: 'http://localhost',
    trace: 'on',
    screenshot: 'on',
    // Tutti i test invieranno questo header, permettendo al backend di saltare il rate limit
    extraHTTPHeaders: {
      'x-playwright-test': 'true',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});