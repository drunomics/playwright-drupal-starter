const { expect } = require('@playwright/test');
const { test } = require('./helpers/backend-test');
let helpers = require('./helpers/test-methods');
let drupal = require('./helpers/drupal-commands');

test.afterAll(async ({ page }) => {
  await drupal.cleanUpContent('PLAYWRIGHT_SEARCH:');
});

test.describe('Search basically works', () => {

  test('Get no search result. @no-ldp-extension-cp', async ({ page,backendURL }) => {
    const response = await page.goto(`${backendURL}/api/api/search?text=string-not-found-!!@@!@@!!`);
    await expect(response.status()).toBe(200);
    await expect((await response.text())).toEqual(expect.stringContaining('{\"found\":\"0\"'));
  });

  test('Manual search works and gives correct results.', async ({ page }) => {
    await page.goto('/search');
    await page.fill('input[placeholder="Search..."]', 'freedom');
    await expect(page.locator('//div[contains(., "search results for freedom")]').first()).toBeVisible();

    await expect(page.locator('//div[contains(text(),\'1 search results for freedom\')]')).toHaveCount(1);
    await expect(page.locator('//h2[contains(text(),\'Table Test\')]')).toHaveCount(1);
    await expect(page.locator('//button[contains(.,"Load more")]')).toHaveCount(0);
  });

  test('Search results reflect changes to articles. @test', async ({ page }) => {
    // Search page works and shows default results.
    await page.goto('/search');
    await expect(page.locator('a[view-mode="search_teaser"]')).toHaveCount(4);
    await expect(page.locator('//button[contains(.,"Load more")]')).toHaveCount(1);

    await helpers.ILogInAs([page, 'dru_editor']);
    await drupal.cloneNodeByTitle([page, 'article', 'Demo article multi paragraph', 'PLAYWRIGHT_SEARCH: Demo article search page cache test']);

    await drupal.visitNodeEditPage([page, 'PLAYWRIGHT_SEARCH: Demo article search page cache test']);
    await page.click('header.region input[value="Save"]');
    await expect(page.locator('div.messages__content')).toContainText('Article PLAYWRIGHT_SEARCH: Demo article search page cache test has been updated.', { useInnerText: true});
    await page.goto('/user/logout');
    await page.goto('/search');
    await page.fill('input[placeholder="Search..."]', 'PLAYWRIGHT_SEARCH: Demo article search page cache test');
    await expect(page.locator('//div[contains(., "search results for PLAYWRIGHT_SEARCH: Demo article search page cache test")]').first()).toBeVisible();
    await expect(page.locator('a[view-mode="search_teaser"]')).toHaveCount(1);
    await expect(page.locator('//h2[contains(text(),"PLAYWRIGHT_SEARCH: Demo article search page cache test")]')).toHaveCount(1);
  });
});
