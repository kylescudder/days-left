import { expect, test } from '@playwright/test'

test('centers the complete composition on a desktop viewport', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.clock.setFixedTime(new Date('2026-09-15T12:00:00Z'))
  await page.goto('/')
  // The entrance animations hold each block 14px low until its delay ends, and reduced
  // motion only shortens their duration. Measure the settled layout, not the mid-entrance one.
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map(({ finished }) => finished))
  )

  const bounds = await page
    .locator('header, #countdown-card, footer')
    .evaluateAll((elements) => {
      const boxes = elements.map((element) => element.getBoundingClientRect())

      return {
        top: Math.min(...boxes.map(({ top }) => top)),
        bottom: Math.max(...boxes.map(({ bottom }) => bottom))
      }
    })

  const compositionCenter = (bounds.top + bounds.bottom) / 2
  expect(Math.abs(compositionCenter - 900 / 2)).toBeLessThan(12)
})

test('keeps the family photo in proportion on a portrait viewport', async ({
  page
}) => {
  await page.setViewportSize({ width: 430, height: 932 })
  await page.clock.setFixedTime(new Date('2026-09-15T12:00:00Z'))
  await page.goto('/')

  const photo = page.getByAltText('Two parent otters floating with their baby')
  await expect(photo).toBeVisible()

  const dimensions = await photo.evaluate((element) => {
    const image = element as HTMLImageElement

    return {
      naturalRatio: image.naturalWidth / image.naturalHeight,
      renderedRatio: image.clientWidth / image.clientHeight
    }
  })

  expect(dimensions.renderedRatio).toBeCloseTo(dimensions.naturalRatio, 2)
  await expect(photo).toBeInViewport({ ratio: 1 })
})

test('shows the live countdown on a phone viewport without horizontal scrolling', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const timer = page.getByRole('timer')
  await expect(timer).toBeVisible()
  // Units start as placeholders; the script replaces them with numbers once it runs.
  await expect(timer.locator('strong').first()).toHaveText(/^\d+$/)

  const card = await page.locator('#countdown-card').boundingBox()
  expect(card).not.toBeNull()
  expect(card!.x).toBeGreaterThanOrEqual(0)
  expect(card!.x + card!.width).toBeLessThanOrEqual(390)

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
