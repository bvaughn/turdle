const { takeScreenshot } = require("./general");

async function closeOpenModal(page) {
  // First hide any modals that may be visible.
  await page.evaluate(() => {
    const element = document.querySelector('[data-testname="ModalBackground"]');
    if (element) {
      element.click(); // Dismiss modal by clicking on the background.
    }
  });
}

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
  closeOpenModal,
  takeEndGameModalScreenshot,
  takeHelpModalScreenshot,
  takeInvalidGuessModalScreenshot,
};
