import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { withAutoSizer } from "./AutoSizer";
import Icon from "./Icon";
import InvalidGuessModal from "./InvalidGuessModal";
import {
  MAX_KEYBOARD_HEIGHT,
  MAX_KEYBOARD_WIDTH,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";
import { stopEvent } from "../utils/events";
import { isGuessValid } from "../utils/words";
import styles from "./Keyboard.module.css";

const TOP_ROW_LETTERS = "qwertyuiop".split("");
const MIDDLE_ROW_LETTERS = "asdfghjkl".split("");
const BOTTOM_ROW_LETTERS = "zxcvbnm".split("");

function Keyboard({
  addPendingGuess,
  deletePendingGuess,
  height,
  modalContainerRef,
  restart,
  state,
  submitPendingGuesses,
  width,
}) {
  const { endGameStatus, pendingGuesses, wordLength } = state;

  const [invalidGuess, setInvalidGuess] = useState(null);

  const dismissInvalidGuessModal = () => setInvalidGuess(null);

  const submitValidGuess = () => {
    if (endGameStatus || pendingGuesses.length !== wordLength) {
      return;
    }

    const guessedWord = state.pendingGuesses.join("");
    if (isGuessValid(guessedWord)) {
      submitPendingGuesses();
    } else {
      setInvalidGuess(guessedWord);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { ctrlKey, key, keyCode, metaKey } = event;

      if (ctrlKey || metaKey) {
        return;
      }

      switch (key) {
        case "Backspace":
          deletePendingGuess();
          stopEvent(event);
          break;
        case "Enter":
          submitValidGuess();
          stopEvent(event);
          break;
        default:
          if (keyCode >= 65 && keyCode <= 90) {
            stopEvent(event);
            addPendingGuess(key.toLowerCase());
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // There are three rows of keys and the longest one has 10 letters.
  const aspectRatio = 10 / 3;

  let gridHeight = 0;
  let gridWidth = 0;
  if (width / 3.33 > height) {
    gridHeight = Math.min(height, MAX_KEYBOARD_HEIGHT);
    gridWidth = gridHeight * aspectRatio;
  } else {
    gridWidth = Math.min(width, MAX_KEYBOARD_WIDTH);
    gridHeight = gridWidth / aspectRatio;
  }

  return (
    <div
      className={styles.Keyboard}
      data-testname="Keyboard"
      style={{
        "--grid-height": `${gridHeight}px`,
        "--grid-width": `${gridWidth}px`,
      }}
    >
      <div className={styles.TopRow}>
        {TOP_ROW_LETTERS.map((letter) => (
          <LetterKey
            key={letter}
            addPendingGuess={addPendingGuess}
            letter={letter}
            state={state}
          />
        ))}
      </div>
      <div className={styles.MiddleRow}>
        {MIDDLE_ROW_LETTERS.map((letter) => (
          <LetterKey
            key={letter}
            addPendingGuess={addPendingGuess}
            letter={letter}
            state={state}
          />
        ))}
      </div>
      <div className={styles.BottomRow}>
        <EnterKey state={state} submitValidGuess={submitValidGuess} />
        {BOTTOM_ROW_LETTERS.map((letter) => (
          <LetterKey
            key={letter}
            addPendingGuess={addPendingGuess}
            letter={letter}
            state={state}
          />
        ))}
        <DeleteKey deletePendingGuess={deletePendingGuess} state={state} />
      </div>

      {invalidGuess != null && createPortal(
        <InvalidGuessModal
          dismissModal={dismissInvalidGuessModal}
          word={invalidGuess}
        />,
        modalContainerRef.current,
      )}
    </div>
  );
}

function DeleteKey({ deletePendingGuess, state }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.SpecialKey}`}
      data-testname="DeleteKey"
      disabled={endGameStatus || pendingGuesses.length === 0}
      onClick={deletePendingGuess}
      title="Delete"
    >
      <Icon className={styles.SpecialKeyIcon} type="delete" />
    </button>
  );
}

function EnterKey({ state, submitValidGuess }) {
  const { endGameStatus, pendingGuesses, wordLength } = state;

  return (
    <button
      className={`${styles.Key} ${styles.SpecialKey}`}
      data-testname="EnterKey"
      disabled={endGameStatus || pendingGuesses.length !== wordLength}
      onClick={submitValidGuess}
      title="Submit guess"
    >
      <div className={styles.SpecialKeyLabel}>Enter</div>
    </button>
  );
}

function LetterKey({ addPendingGuess, letter, state }) {
  const {
    letterKeys,
    endGameStatus,
    pendingGuesses,
    submittedGuesses,
    wordLength,
  } = state;

  const disabled = endGameStatus || pendingGuesses.length === wordLength;
  const classNames = [styles.Key];
  switch (letterKeys[letter]) {
    case STATUS_CORRECT:
      classNames.push(styles.KeyCorrect);
      break;
    case STATUS_PRESENT:
      classNames.push(styles.KeyPresent);
      break;
    case STATUS_INCORRECT:
      classNames.push(styles.KeyIncorrect);
      break;
  }

  const handleClick = () => addPendingGuess(letter);

  return (
    <button
      className={classNames.join(" ")}
      data-testname={`Key-${letter}`}
      disabled={disabled}
      onClick={handleClick}
      title="Share score"
    >
      {letter}
    </button>
  );
}

export default withAutoSizer(Keyboard);
