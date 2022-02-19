const { clickButton, getElementEnabled, takeScreenshot } = require("./general");

async function enterWord(page, word, useOnScreenKeyboard = true) {
  if (useOnScreenKeyboard) {
    for (let i = 0; i < word.length; i++) {
      const letter = word.charAt(i);
      await pressKey(page, letter);
    }
  } else {
    await page.keyboard.type(word);
  }
}

async function isKeyEnabled(page, letterOrKeyName) {
  letterOrKeyName = letterOrKeyName.toLowerCase();

  let testName;
  switch (letterOrKeyName) {
    case "enter":
      testName = "EnterKey";
      break;
    case "delete":
      testName = "DeleteKey";
      break;
    default:
      testName = `Key-${letterOrKeyName}`;
      break;
  }

  return getElementEnabled(page, testName);
}

async function pressKey(page, letterOrKeyName, useOnScreenKeyboard = true) {
  letterOrKeyName = letterOrKeyName.toLowerCase();

  switch (letterOrKeyName) {
    case "enter":
      if (useOnScreenKeyboard) {
        await clickButton(page, "EnterKey");
      } else {
        await page.keyboard.press("Enter");
      }
      break;
    case "delete":
      if (useOnScreenKeyboard) {
        await clickButton(page, "DeleteKey");
      } else {
        await page.keyboard.press("Backspace");
      }
      break;
    default:
      if (useOnScreenKeyboard) {
        await clickButton(page, `Key-${letterOrKeyName}`);
      } else {
        await page.keyboard.type(letterOrKeyName);
      }
      break;
  }
}

async function takeKeyboardScreenshot(page, fileName) {
  await takeScreenshot(page, "Keyboard", "keyboard", fileName);
}

module.exports = {
  enterWord,
  isKeyEnabled,
  pressKey,
  takeKeyboardScreenshot,
};
