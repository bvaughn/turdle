const { test, expect } = require("@playwright/test");
const { clickButton, loadPage } = require("./utils/general");
const { takeGridScreenshot } = require("./utils/grid");
const {
  enterWord,
  isKeyEnabled,
  pressKey,
  takeKeyboardScreenshot,
} = require("./utils/keyboard");
const {
  takeEndGameModalScreenshot,
  takeInvalidGuessModalScreenshot,
} = require("./utils/modals");

test.describe("game", () => {
  test.beforeEach(async ({ page }) => {
    await loadPage(page);
  });

  test.describe("input", () => {
    test("enter and delete keys should be disabled until a guess has been entered", async ({
      page,
    }) => {
      expect(await isKeyEnabled(page, "Enter")).toBe(false);
      expect(await isKeyEnabled(page, "Delete")).toBe(false);

      await takeKeyboardScreenshot(page, "default-no-guess.png");

      await enterWord(page, "poop");

      await takeKeyboardScreenshot(page, "enabled-valid-guess.png");
    });

    test("should accept input from the on-screen keyboard", async ({
      page,
    }) => {
      await enterWord(page, "poop", true);
      await pressKey(page, "Enter");
    });

    test("should accept input from the physical keyboard", async ({ page }) => {
      await enterWord(page, "poop", false);
      await pressKey(page, "Enter");
    });
  });

  test("should only accept guesses that are valid 4-letter poop words", async ({
    page,
  }) => {
    await enterWord(page, "test");
    await pressKey(page, "Enter");
    await takeKeyboardScreenshot(page, "invalid-guess.png");
    await takeInvalidGuessModalScreenshot(page, "invalid-guess-modal.png");
    await clickButton(page, "RetryButton");
    await expect(
      page.locator('[data-testname="InvalidGuessModal"]')
    ).toBeHidden();
  });

  test("should show play again modal when game is won", async ({ page }) => {
    await loadPage(page, ["poop", "turd"]);
    await enterWord(page, "poop");
    await pressKey(page, "Enter");
    await takeEndGameModalScreenshot(page, "end-of-game-won.png");
  });

  test("should show retry modal when game is lost", async ({ page }) => {
    await loadPage(page, ["crap"]);

    await enterWord(page, "turd");
    await pressKey(page, "Enter");
    await takeGridScreenshot(page, "guess-1.png");

    await enterWord(page, "soil");
    await pressKey(page, "Enter");
    await takeGridScreenshot(page, "guess-2.png");

    await enterWord(page, "scat");
    await pressKey(page, "Enter");
    await takeGridScreenshot(page, "guess-3.png");

    await enterWord(page, "caca");
    await pressKey(page, "Enter");

    await takeEndGameModalScreenshot(page, "end-of-game-lost.png");

    // Dismiss the end-of-game modal before taking a screenshot of the grid.
    await clickButton(page, "DismissButton");

    await takeGridScreenshot(page, "guess-4.png");
  });

  test("should show no-more-words modal when word list is empty", async ({
    page,
  }) => {
    await loadPage(page, ["poop"]);
    await enterWord(page, "poop");
    await pressKey(page, "Enter");
    await takeEndGameModalScreenshot(page, "end-of-game-no-more-words.png");
  });

  test("should track win/loss statistics and number of guesses across games", async ({
    page,
  }) => {
    await loadPage(page, ["crap", "poop", "turd"]);

    await enterWord(page, "crap");
    await pressKey(page, "Enter");
    await takeEndGameModalScreenshot(page, "end-of-game-win-1.png");

    await clickButton(page, "ReplayButton");
    await enterWord(page, "crap");
    await pressKey(page, "Enter");
    await enterWord(page, "caca");
    await pressKey(page, "Enter");
    await enterWord(page, "poop");
    await pressKey(page, "Enter");
    await takeEndGameModalScreenshot(page, "end-of-game-win-2.png");

    await clickButton(page, "ReplayButton");
    await enterWord(page, "turd");
    await pressKey(page, "Enter");
    await takeEndGameModalScreenshot(page, "end-of-game-win-3.png");
  });
});
