import { expect, test } from '@playwright/test';

test('dashboard scaffold loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Candidate repositories')).toBeVisible();
});
