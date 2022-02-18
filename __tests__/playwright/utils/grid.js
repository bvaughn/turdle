const { takeScreenshot } = require("./general");

async function takeGridScreenshot(page, fileName) {
  await takeScreenshot(page, "Grid", "grid", fileName);
}

module.exports = {
  takeGridScreenshot,
};