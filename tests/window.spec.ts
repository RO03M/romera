import { test, expect } from '@playwright/test';

test("window buttons", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.locator(".application-item").first().dblclick();
  const window = await page.locator(".window").first();

  expect(window).not.toBeUndefined();
  expect(window).toBeVisible();
  expect(window).toBeInViewport();

  const maximizeButton = await page.locator(".window .maximize-button").first();
  const closeButton = await page.locator(".window .close-button").first();

  expect(maximizeButton).not.toBeUndefined();
  expect(closeButton).not.toBeUndefined();
  expect(maximizeButton).toBeVisible();
  expect(closeButton).toBeVisible();

  await maximizeButton.click();

  const windowBoundingBox = await window.boundingBox();
  const viewportSize = await page.viewportSize();

  expect(windowBoundingBox).not.toBeNull();
  expect(viewportSize).not.toBeNull();
  expect(viewportSize!.width).toBe(windowBoundingBox!.width);
  expect(viewportSize!.height).toBe(windowBoundingBox!.height);

  await closeButton.click();

  expect(await page.locator(".window").count()).toBe(0);

  await page.close();
});