const { join } = require("path");
const { test, expect } = require("@playwright/test");
const {
  clickButton,
  getElementBoundingRect,
  getElementEnabled,
  getElementVisisble,
  loadPage,
  takeScreenshot,
} = require("./utils/general");
const { takeGridScreenshot } = require("./utils/grid");
const {
  enterWord,
  isKeyEnabled,
  pressKey,
  takeKeyboardScreenshot,
} = require("./utils/keyboard");
const {
  changeDifficulty,
  takeSettingsScreenshot,
} = require("./utils/settings");
const {
  closeOpenModal,
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
      await enterWord(page, "caca", true);
      await pressKey(page, "Enter");
      await takeGridScreenshot(page, "on-screen-keyboard-input.png");
    });

    test("should accept input from the physical keyboard", async ({ page }) => {
      await enterWord(page, "caca", false);
      await pressKey(page, "Enter");
      await takeGridScreenshot(page, "physical-keyboard-input.png");
    });

    test("should visually show keys pressing down", async ({ page }) => {
      const rect = await getElementBoundingRect(page, "Key-a");
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      const padding = 4;
      const clip = {
        x: rect.x - padding,
        y: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      };

      const takeKeyScreenshot = async (name) => {
        expect(
          await page.screenshot({ clip, disableAnimations: true })
        ).toMatchSnapshot(["keyboard", "key", name]);
      };

      await takeKeyScreenshot("key-a-1-default.png");

      await page.mouse.move(x, y);
      await takeKeyScreenshot("key-a-2-hover.png");

      await page.mouse.down();
      await takeKeyScreenshot("key-a-3-down.png");

      await page.mouse.up();
      await takeKeyScreenshot("key-a-4-up.png");
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
    await closeOpenModal(page);

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

  test("should support viewing recent games", async ({ page }) => {
    await takeGridScreenshot(page, "history-new-game.png");

    let historyButtonEnabled = await getElementEnabled(page, "HistoryButton");
    expect(historyButtonEnabled).toBe(false);

    await loadPage(page, ["poop", "crap", "turd"]);
    await enterWord(page, "poop");
    await pressKey(page, "Enter");
    await clickButton(page, "DismissButton");
    await takeGridScreenshot(page, "history-first-game.png");

    await clickButton(page, "NewGameButton");

    historyButtonEnabled = await getElementEnabled(page, "HistoryButton");
    expect(historyButtonEnabled).toBe(true);

    await enterWord(page, "shit");
    await pressKey(page, "Enter");
    await enterWord(page, "crap");
    await pressKey(page, "Enter");
    await clickButton(page, "DismissButton");
    await takeGridScreenshot(page, "history-second-game.png");

    // View first game.
    await clickButton(page, "HistoryButton");
    await clickButton(page, "HistoryListItem", 1);
    await takeGridScreenshot(page, "history-first-game.png");

    // View second game.
    await clickButton(page, "HistoryButton");
    await clickButton(page, "HistoryListItem", 0);
    await takeGridScreenshot(page, "history-second-game.png");

    // Start new game.
    await clickButton(page, "NewGameButton");
    await takeGridScreenshot(page, "history-new-game.png");
  });

  test("should be able to change game difficulty", async ({ page }) => {
    // Guess 4 letter word
    await loadPage(page, ["poop", "crap", "turd"]);
    await enterWord(page, "poop");
    await pressKey(page, "Enter");
    await closeOpenModal(page);

    // Change difficulty to 3
    await clickButton(page, "SettingsButton");
    await takeSettingsScreenshot(page, "default-difficulty-4.png");
    await changeDifficulty(page, 3);
    await takeGridScreenshot(page, "settings-difficulty-3.png");

    // View history of different length
    await clickButton(page, "HistoryButton");
    await clickButton(page, "HistoryListItem");
    await takeGridScreenshot(page, "history-previous-difficulty-setting.png");

    // Change difficulty again, this time to 5
    await clickButton(page, "SettingsButton");
    await takeSettingsScreenshot(page, "default-difficulty-3.png");
    await changeDifficulty(page, 5);
    await takeGridScreenshot(page, "settings-difficulty-5-past-game.png");

    // If we are viewing a past game, changing the settings shouldn't affect the UI
    // until we explicilty start a new game.
    await clickButton(page, "NewGameButton");
    await takeGridScreenshot(page, "settings-difficulty-5-new-game.png");

    // Reload and verify that the new word length setting was remembered.
    await loadPage(page, null);
    await takeGridScreenshot(page, "settings-difficulty-5-new-game.png");
  });

  test("should render an error boundary if localStorage gets corrupted", async ({
    page,
  }) => {
    // Simulate a corrupted history
    await page.evaluate(() => {
      const gameStats = { history: ["bad-data"] };
      localStorage.setItem("turdle:game-stats", JSON.stringify(gameStats));
      window.dispatchEvent(new Event("storage"));
    });

    // Attempt to view the history (which will cause an error)
    await clickButton(page, "HistoryButton");

    // Next.js DEV error overlays make screenshot testing difficult 🤮
    // For our purposes it's sufficient to just verify that the overlay is shown.
    expect(await getElementVisisble(page, "ErrorBoundary")).toBe(true);

    // Clear session data
    await clickButton(page, "DeleteSessionDataButton");
    expect(await getElementVisisble(page, "ErrorBoundary")).toBe(false);
  });

  test.describe("layouts", () => {
    async function takeFullPageScreenshot(page, width, height) {
      // const viewport={ width, height };
      // const context = browser.new_context(viewport);

      page.setViewportSize({ width, height });

      await page.screenshot({
        path: join(
          __dirname,
          "game-test.js-snapshots",
          "layout",
          `${width}-by-${height}.png`
        ),
        fullPage: true,
      });
    }

    test("1200 x 800", async ({ page }) => {
      await takeFullPageScreenshot(page, 1200, 800);
    });

    test("720 x 350", async ({ page }) => {
      await takeFullPageScreenshot(page, 720, 350);
    });

    test("870 x 520", async ({ page }) => {
      await takeFullPageScreenshot(page, 870, 520);
    });

    test("400 x 600", async ({ page }) => {
      await takeFullPageScreenshot(page, 400, 600);
    });
  });
});
