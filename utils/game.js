import {
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";

export function gameStateToCopyString(gameState) {
  return (
    `https://turdle.app (${gameState.submittedGuesses.length}/${MAX_GUESSES})\n\n` +
    gameState.submittedGuesses
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
      .join("\n")
  );
}
