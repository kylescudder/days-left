import { expect, test } from '@playwright/test'
import { attachScreenshot, settle } from './support/evidence'

test('counts down to the London wall-clock start of leave', async ({
  page
}, testInfo) => {
  // 12:00 UTC in September is 13:00 BST, 136 days and 3 hours before 16:00 GMT on 29 January 2027.
  await page.clock.setFixedTime(new Date('2026-09-15T12:00:00Z'))
  await page.goto('/')

  const card = page.locator('#countdown-card')
  await expect(card.locator('#days')).toHaveText('136')
  await expect(card.locator('#hours')).toHaveText('03')
  await expect(card.locator('#minutes')).toHaveText('00')
  await expect(card.locator('#seconds')).toHaveText('00')
  await expect(card).not.toHaveAttribute('data-finished')
  await settle(page)
  await attachScreenshot(page, testInfo, 'counting-down-1280x720')
})

test('celebrates once the countdown reaches zero', async ({
  page
}, testInfo) => {
  await page.clock.setFixedTime(new Date('2027-01-29T16:00:01Z'))
  await page.goto('/')

  const card = page.locator('#countdown-card')
  await expect(card).toHaveAttribute('data-finished', '')
  await expect(card.locator('#days')).toHaveText('0')
  await expect(page.locator('#countdown-date')).toHaveText(
    'You made it — maternity leave begins!'
  )
  await settle(page)
  await attachScreenshot(page, testInfo, 'celebrating-1280x720')
})
