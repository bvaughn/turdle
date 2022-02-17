import {
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";

export function copyEndGameStatus(state) {
  navigator.clipboard.writeText(
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
        .join("\n")
  );
}
