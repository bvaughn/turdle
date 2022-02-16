import { GUESS_LENGTH, MAX_GUESSES, STATUS_PENDING } from "../constants";
import GridLetter from "./GridLetter";
import styles from "./Grid.module.css";

export default function Grid({ state }) {
  const { pendingGuesses, submittedGuesses } = state;

  const children = [];

  for (let guessIndex = 0; guessIndex < MAX_GUESSES; guessIndex++) {
    const guessedWord = submittedGuesses[guessIndex];
    for (let letterIndex = 0; letterIndex < GUESS_LENGTH; letterIndex++) {
      let letter = null;
      let status = null;

      const guessedLetter = guessedWord ? guessedWord[letterIndex] : null;
      if (guessedLetter) {
        letter = guessedLetter[0];
        status = guessedLetter[1];
      } else if (guessIndex === submittedGuesses.length) {
        // Pending row
        if (letterIndex < pendingGuesses.length) {
          letter = pendingGuesses[letterIndex];
          status = STATUS_PENDING;
        }
      }

      children.push(
        <GridLetter
          key={guessIndex * GUESS_LENGTH + letterIndex}
          letter={letter}
          status={status}
        />
      );
    }
  }

  return <div className={styles.Grid}>{children}</div>;
}
