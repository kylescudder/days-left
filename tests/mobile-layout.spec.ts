import { expect, test } from '@playwright/test';

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
