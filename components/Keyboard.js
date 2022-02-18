import Icon from "./Icon";
import { useEffect } from "react";
import { STATUS_CORRECT, STATUS_INCORRECT, STATUS_PRESENT } from "../constants";
import { copyEndGameStatus } from "../utils/copy";
import { stopEvent } from "../utils/events";
import { getTargetWord } from "../utils/words";
import styles from "./Keyboard.module.css";

const TOP_ROW_LETTERS = "qwertyuiop".split("");
const MIDDLE_ROW_LETTERS = "asdfghjkl".split("");
const BOTTOM_ROW_LETTERS = "zxcvbnm".split("");

export default function Keyboard({
  addPendingGuess,
  deletePendingGuess,
  restart,
  state,
  submitPendingGuesses,
}) {
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
        <EnterKey submitPendingGuesses={submitPendingGuesses} state={state} />
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
    </div>
  );
}

function DeleteKey({ deletePendingGuess, state }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.SpecialKey}`}
      disabled={endGameStatus || pendingGuesses.length === 0}
      onClick={deletePendingGuess}
      title="Delete"
    >
      <Icon className={styles.SpecialKeyIcon} type="delete" />
    </button>
  );
}

function EnterKey({ submitPendingGuesses, state }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.SpecialKey}`}
      disabled={endGameStatus || pendingGuesses.length !== 4}
      onClick={submitPendingGuesses}
      title="Submit guess"
    >
      <div className={styles.SpecialKeyLabel}>Enter</div>
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
      title="Share score"
    >
      {letter}
    </button>
  );
}
