const { takeScreenshot } = require("./general");

async function takeEndGameModalScreenshot(page, fileName) {
  await takeScreenshot(page, "EndGameModal", "modals", fileName);
}

async function takeHelpModalScreenshot(page, fileName) {
  await takeScreenshot(page, "HelpModal", "modals", fileName);
}

async function takeInvalidGuessModalScreenshot(page, fileName) {
  await takeScreenshot(page, "InvalidGuessModal", "modals", fileName);
}

module.exports = {
  takeEndGameModalScreenshot,
  takeHelpModalScreenshot,
  takeInvalidGuessModalScreenshot,
};