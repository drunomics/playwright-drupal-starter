// @ts-check
require('dotenv').config()
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  reporter: [ ['html', { open: 'never', outputFolder: 'html-report' }] ],
  timeout: 60000,
  workers: 1,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: false,
    video: 'off',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    baseURL: '$BASE_URL',
    httpCredentials: {
      username: '$HTTP_AUTH_USER',
      password: '$HTTP_AUTH_PASS'
    }
  },
};

module.exports = config;
