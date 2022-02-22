const config = {
  expect: {
    toMatchSnapshot: {
      // Account for minor difference in e.g. text rendering and resolution
      // between headless and in-browser tests.
      threshold: 0.5,
    },
  },

  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 2 : 0,

  testDir: "__tests__/playwright",
  testMatch: "**/*-test.js",
  outputDir: "test-results/",

  use: {
    // Uncomment for easier local debugging
    // headless: false,
    // launchOptions: {
    //   slowMo: 250,
    // },

    browserName: "chromium",

    trace: "on-first-retry",
    video: "on-first-retry",

    viewport: {
      width: 700,
      height: 350,
    },
  },
};

module.exports = config;
