import { useLayoutEffect } from "react";
import { STATUS_CORRECT, STATUS_INCORRECT, STATUS_PRESENT } from "../constants";
import { stopEvent } from "../utils/events";
import styles from "./Keyboard.module.css";

const TOP_ROW_LETTERS = "qwertyuiop".split("");
const MIDDLE_ROW_LETTERS = "asdfghjkl".split("");
const BOTTOM_ROW_LETTERS = "zxcvbnm".split("");

export default function Keyboard({
  addPendingGuess,
  deletePendingGuess,
  state,
  submitPendingGuesses,
}) {
  useLayoutEffect(() => {
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
          submitPendingGuesses();
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

  return (
    <div className={styles.Keyboard}>
      <div className={styles.TopRow}>
        {TOP_ROW_LETTERS.map((letter) => (
          <LetterKey
            key={letter}
            addPendingGuess={addPendingGuess}
            letter={letter}
            state={state}
          />
        ))}
        <DeleteKey deletePendingGuess={deletePendingGuess} state={state} />
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
        <EnterKey submitPendingGuesses={submitPendingGuesses} state={state} />
      </div>
      <div className={styles.BottomRow}>
        {BOTTOM_ROW_LETTERS.map((letter) => (
          <LetterKey
            key={letter}
            addPendingGuess={addPendingGuess}
            letter={letter}
            state={state}
          />
        ))}
      </div>
    </div>
  );
}

function DeleteKey({ deletePendingGuess, state }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.KeyAvailable}`}
      disabled={endGameStatus || pendingGuesses.length === 0}
      onClick={deletePendingGuess}
      title="Delete"
    >
      <DeleteIcon />
    </button>
  );
}

function EnterKey({ submitPendingGuesses, state }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.KeyAvailable}`}
      disabled={endGameStatus || pendingGuesses.length !== 4}
      onClick={submitPendingGuesses}
      title="Submit guess"
    >
      <EnterIcon />
    </button>
  );
}

function LetterKey({ addPendingGuess, letter, state }) {
  const { letterKeys, endGameStatus, pendingGuesses, submittedGuesses } = state;

  const disabled = endGameStatus || pendingGuesses.length === 4;
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
      disabled={disabled}
      onClick={handleClick}
    >
      {letter}
    </button>
  );
}

const DeleteIcon = () => (
  <svg className={styles.DeleteIcon} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12L19,15.59M22,3A2,2 0 0,1 24,5V19A2,2 0 0,1 22,21H7C6.31,21 5.77,20.64 5.41,20.11L0,12L5.41,3.88C5.77,3.35 6.31,3 7,3H22M22,5H7L2.28,12L7,19H22V5Z"
    />
  </svg>
);

const EnterIcon = () => (
  <svg className={styles.EnterIcon} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,7V11H5.83L9.41,7.41L8,6L2,12L8,18L9.41,16.58L5.83,13H21V7H19Z"
    />
  </svg>
);
