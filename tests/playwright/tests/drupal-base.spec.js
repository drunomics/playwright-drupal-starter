const { test, expect } = require('@playwright/test');
let helpers = require('./helpers/test-methods');

test.describe('Drupal base', () => {
  test('Drupal generates a page', async ({ page }) => {
    const response = await page.goto('/');
    await expect(response.status()).toBe(200);
    await expect(await response.text()).toContain(('nuxt'));
  });

  test('Drupal generates a 404 response', async ({ page, backendURL}) => {
    const response = await page.goto(`/api/some-not-existing-page)`);
    await expect(response.status()).toBe(404);
  });

  test('I can log in and logout.', async ({ page, backendURL }) => {
    await helpers.IShouldNotBeLoggedIn(page);
    // Log in
    await helpers.ILogInAs([page, 'editor']);
    await helpers.IShouldBeLoggedIn(page);
    // Log out
    await page.goto(`/user/logout`);
    await helpers.IShouldNotBeLoggedIn(page);
  });
});
