const { clickButton, takeScreenshot } = require("./general");

async function changeDifficulty(page, difficulty) {
  await clickButton(page, `DifficultyRadio-${difficulty}`);
  await clickButton(page, "SaveButton");
}

async function takeSettingsScreenshot(page, fileName) {
  await takeScreenshot(page, "SettingsModal", "settings", fileName);
}

module.exports = {
  changeDifficulty,
  takeSettingsScreenshot,
};
