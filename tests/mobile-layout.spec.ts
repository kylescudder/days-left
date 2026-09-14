import { expect, test } from '@playwright/test';

test('centers the complete composition on a desktop viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const bounds = await page.locator('.intro, .countdown-card, footer').evaluateAll((elements) => {
    const boxes = elements.map((element) => element.getBoundingClientRect());

    return {
      top: Math.min(...boxes.map(({ top }) => top)),
      bottom: Math.max(...boxes.map(({ bottom }) => bottom)),
    };
  });

  const compositionCenter = (bounds.top + bounds.bottom) / 2;
  expect(Math.abs(compositionCenter - 900 / 2)).toBeLessThan(12);
});

test('keeps the family photo in proportion on a portrait viewport', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('/');

  const photo = page.getByAltText('Two parent otters floating with their baby');
  await expect(photo).toBeVisible();

  const dimensions = await photo.evaluate((element) => {
    const image = element as HTMLImageElement;

    return {
      naturalRatio: image.naturalWidth / image.naturalHeight,
      renderedRatio: image.clientWidth / image.clientHeight,
    };
  });

  expect(dimensions.renderedRatio).toBeCloseTo(dimensions.naturalRatio, 2);
  await expect(photo).toBeInViewport({ ratio: 1 });
});
