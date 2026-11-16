import type { Page, TestInfo } from '@playwright/test'

// Waits for the entrance animations to finish so a capture shows the settled page.
export const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(document.getAnimations().map(({ finished }) => finished))
  )

// Captures the settled page as a PNG attached to the test, for the PR evidence run.
export const attachScreenshot = async (
  page: Page,
  testInfo: TestInfo,
  name: string
) => {
  await settle(page)
  const path = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ path, fullPage: true })
  await testInfo.attach(name, { path, contentType: 'image/png' })
}
