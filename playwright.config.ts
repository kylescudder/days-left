import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:44321'
// Opt-in PR evidence: also keep each test's video and write a JSON report that maps its
// attachments to the test. Normal runs keep the default recording behaviour.
const evidence = process.env.E2E_EVIDENCE === '1'

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  reporter: evidence
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/report.json' }]
      ]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    screenshot: 'on',
    trace: 'retain-on-failure',
    ...(evidence ? { video: 'on' } : {})
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Serve the production build: the dev server injects Astro's toolbar, whose
        // shadow-DOM headers would be measured as part of the page composition.
        command:
          'bunx --no-install astro build && bunx --no-install astro preview --ignore-lock --host 127.0.0.1 --port 44321',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000
      }
})
