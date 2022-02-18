const { expect } = require("@playwright/test");

async function clickButton(page, testName) {
  await page.evaluate(async (targetTestName) => {
    const button = document.querySelector(
      `[data-testname="${targetTestName}"]`
    );
    button.click();
  }, testName);
}

async function isButtonEnabled(page, testName) {
  return await page.evaluate(async (targetTestName) => {
    const button = document.querySelector(
      `[data-testname="${targetTestName}"]`
    );
    return !button.disabled;
  }, testName);
}

async function isElementVisisble(page, testName) {
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
  isButtonEnabled,
  isElementVisisble,
  loadPage,
  takeScreenshot,
};
