const { expect } = require('@playwright/test');
const { test } = require('./helpers/backend-test');
let helpers = require('./helpers/test-methods');
let drupal = require('./helpers/drupal-commands');

test.describe('Metatags, links and scripts are properly generated.', () => {
  test('Author metatags when author is published are sent properly.', async ({ page, backendURL }) => {
    let response = await drupal.visitNodeAPIByTitle([page, 'Demo article of text paragraph']);
    await helpers.checkMetaContentByProperty([response, 'property', 'author', 'John Snow']);
    await helpers.checkMetaContentByProperty([response, 'property', 'article:author', 'John Snow']);
    await helpers.checkMetaContentByProperty([response, 'name', 'twitter:creator', 'John Snow']);
  });
});