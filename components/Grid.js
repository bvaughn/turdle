import { MAX_GUESSES, STATUS_PENDING } from "../constants";
import Tile from "./Tile";
import styles from "./Grid.module.css";

export default function Grid({ state }) {
  const { pendingGuesses, submittedGuesses, targetWord } = state;

  // Use the length of the targetWord, not the wordLength preference,
  // because we might be viewing an old game with a different length.
  const wordLength = targetWord.length;

  const children = [];
  for (let guessIndex = 0; guessIndex < MAX_GUESSES; guessIndex++) {
    const guessedWord = submittedGuesses[guessIndex];
    for (let letterIndex = 0; letterIndex < wordLength; letterIndex++) {
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
        <Tile
          key={guessIndex * wordLength + letterIndex}
          letter={letter}
          status={status}
        />
      );
    }
  }

  let className;
  switch (wordLength) {
    case 3:
      className = styles.Grid3;
      break;
    case 4:
      className = styles.Grid4;
      break;
    case 5:
      className = styles.Grid5;
      break;
    case 6:
      className = styles.Grid6;
      break;
    default:
      throw Error(`Invalid Grid size ${wordLength}`);
  }

  return (
    <div className={className} data-testname="Grid">
      {children}
    </div>
  );
}
