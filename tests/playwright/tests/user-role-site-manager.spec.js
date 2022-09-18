const { test, expect } = require('@playwright/test');
let helpers = require('./helpers/test-methods');

test.describe('User role: Site manager permissions work.', () => {
  // Make sure teaser content listings are properly generated.
  test('Site manager can access "Basic site settings".', async ({ page }) => {
    await helpers.IShouldNotBeLoggedIn(page);
    await helpers.ILogInAs([page, 'dru_site_manager']);
    await helpers.IShouldBeLoggedIn(page);

    await page.goto('/admin/config/system/site-information');
    await expect(page.locator('h1.page-title')).toHaveText('Basic site settings');

  });
});