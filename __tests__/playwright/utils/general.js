const { expect } = require("@playwright/test");

async function clickButton(page, testName, index) {
  await page.evaluate(
    async ({ index, testName }) => {
      let selector = `[data-testname="${testName}"]`;
      if (index != null) {
        selector += `:nth-of-type(${index + 1})`;
      }

      const button = document.querySelector(selector);
      button.click();
    },
    { index, testName }
  );
}

async function getElementBoundingRect(page, testName) {
  return page.evaluate((targetTestName) => {
    const element = document.querySelector(
      `[data-testname="${targetTestName}"]`
    );
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
  }, testName);
}

async function getElementEnabled(page, testName) {
  return await page.evaluate(async (targetTestName) => {
    const button = document.querySelector(
      `[data-testname="${targetTestName}"]`
    );
    return !button.disabled;
  }, testName);
}

async function getElementVisisble(page, testName) {
  return await page.evaluate(async (targetTestName) => {
    return (
      document.querySelector(`[data-testname="${targetTestName}"]`) != null
    );
  }, testName);
}

async function loadPage(page, wordList = ["turd"]) {
  let url = "http://localhost:3000";
  if (wordList) {
    url += `?wordList=${wordList.join(",")}`;
  }

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testname="Grid"]');
}

async function takeScreenshot(page, testName, ...path) {
  const selector = `[data-testname="${testName}"]`;

  await page.waitForSelector(selector);

  expect(
    await page.locator(selector).screenshot({ disableAnimations: true })
  ).toMatchSnapshot(path);
}

module.exports = {
  clickButton,
  getElementBoundingRect,
  getElementEnabled,
  getElementVisisble,
  loadPage,
  takeScreenshot,
};
