const config = {
  expect: {
    toMatchSnapshot: {
      // Account for minor difference in e.g. text rendering and resolution
      // between headless and in-browser tests.
      threshold: 0.5,
    },
  },

  reporter: "html",

  testDir: "__tests__/playwright",
  testMatch: "**/*-test.js",

  use: {
    // Uncomment for easier local debugging
    // headless: false,
    // launchOptions: {
    //   slowMo: 250,
    // },

    browserName: "chromium",

    viewport: {
      width: 700,
      height: 350,
    },
  },
};

module.exports = config;
