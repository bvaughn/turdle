import {
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";

export function copyEndGameStatus(state) {
  const textToCopy =
    `https://turdle.app (${state.submittedGuesses.length}/${MAX_GUESSES})\n\n` +
    state.submittedGuesses
      .map((guess) => {
        return guess
          .map(([_, status]) => {
            switch (status) {
              case STATUS_CORRECT:
                return "🟩";
              case STATUS_INCORRECT:
                return "⬛";
              case STATUS_PRESENT:
                return "🟨";
            }
          })
          .join("");
      })
      .join("\n");

  try {
    copyTextNavigatorClipboard(textToCopy);
  } catch (error) {
    // navigator.clipboard.writeText() doesn't work on iOS,
    // so fall back to using the browser "copy" command.
    copyTextDOMElement(textToCopy);
  }
}

function copyTextNavigatorClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy);
}

function copyTextDOMElement(textToCopy) {
  let textArea = document.createElement("textArea");
  textArea.value = textToCopy;

  document.body.appendChild(textArea);

  const range = document.createRange();
  range.selectNodeContents(textArea);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  textArea.setSelectionRange(0, 999999);

  document.execCommand("copy");

  document.body.removeChild(textArea);
}
