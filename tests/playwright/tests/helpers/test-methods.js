const { expect } = require('@playwright/test');

module.exports = {
  IShouldBeLoggedIn: async (page) => {
    await page.goto('/user', { waitUntil: 'networkidle' });
    await expect(page.locator('body.user-logged-in').first()).toHaveCount(1);
    await expect(page).toHaveURL(/.*(?!user\/login)/);
  },
  IShouldNotBeLoggedIn: async (page) => {
    await page.goto('/user/login', { waitUntil: 'networkidle' });
    await expect(page.locator('body.user-logged-in').first()).toHaveCount(0);
    await expect(page).toHaveURL(/.*user\/login/);
  },
  ILogInAs: async ([page, username]) => {
    await page.goto('/user/login');
    await page.fill('input[name="name"]', username);
    await page.fill('input[name="pass"]', process.env.APP_SECRET);
    await page.click('input[value="Log in"]', process.env.APP_SECRET);
  },
  theCacheHitExists: async ([page, response]) => {
    expect(await response.headerValue('X-Drupal-Cache') == 'HIT' ||
      await response.headerValue('X-Drupal-Dynamic-Cache') == 'HIT' ||
      await response.headerValue('X-Cache') == 'HIT' ||
      await response.headerValue('X-Varnish-Cache') == 'HIT').toBeTruthy();
  },
  theHeaderContains: async ([response, headerValue, shouldContain, ...headers]) => {
    for (const header of headers) {
      if (shouldContain) {
        expect(await response.headerValue(headerValue)).toContain(header);
      } else {
        expect(await response.headerValue(headerValue)).not.toContain(header);
      }
    }
  },
  checkMetaContentByProperty: async ([response, key, value, content]) => {
    let jsonContent = JSON.parse(await response.text());
    for (const meta_elem of jsonContent.metatags.meta) {
      if (meta_elem[key] === value) {
        expect(meta_elem['content']).toEqual(content);
      }
    }
  },
};
