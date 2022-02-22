import { withAutoSizer } from "./AutoSizer";
import { MAX_GRID_SIZE, MAX_GUESSES, STATUS_PENDING } from "../constants";
import Tile from "./Tile";
import styles from "./Grid.module.css";

function Grid({ height, state, width }) {
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

  // The size of the grid depends on the difficult setting.
  const aspectRatio = wordLength / MAX_GUESSES;

  let gridGap = 0;
  let gridHeight = 0;
  let gridWidth = 0;
  if (width / aspectRatio > height) {
    gridHeight = Math.min(height, MAX_GRID_SIZE);
    gridGap = gridHeight / 50;
    gridWidth = gridHeight * aspectRatio;
  } else {
    gridWidth = Math.min(width, MAX_GRID_SIZE);
    gridGap = gridWidth / 50;
    gridHeight = gridWidth / aspectRatio;
  }

  return (
    <div
      className={className}
      data-testname="Grid"
      style={{
        "--grid-gap": `${gridGap}px`,
        "--grid-height": `${gridHeight}px`,
        "--grid-width": `${gridWidth}px`,
      }}
    >
      {children}
    </div>
  );
}

export default withAutoSizer(Grid);
