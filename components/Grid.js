import {
  GUESS_LENGTH,
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PENDING,
  STATUS_PRESENT,
} from "../constants";
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
        <Guess
          key={guessIndex * GUESS_LENGTH + letterIndex}
          letter={letter}
          status={status}
        />
      );
    }
  }

  return <div className={styles.Grid}>{children}</div>;
}

function Guess({ letter, status }) {
  const classNames = [styles.Letter];
  if (letter) {
    switch (status) {
      case STATUS_CORRECT:
        classNames.push(styles.Correct);
        break;
      case STATUS_INCORRECT:
        classNames.push(styles.Incorrect);
        break;
      case STATUS_PRESENT:
        classNames.push(styles.Present);
        break;
      case STATUS_PENDING:
        classNames.push(styles.Pending);
        break;
      default:
        classNames.push(styles.Empty);
        break;
    }
  } else {
    classNames.push(styles.Empty);
  }

  return <div className={classNames.join(" ")}>{letter}</div>;
}
