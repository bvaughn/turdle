import Icon from "./Icon";
import { useEffect, useState } from "react";
import InvalidGuessModal from "./InvalidGuessModal";
import { STATUS_CORRECT, STATUS_INCORRECT, STATUS_PRESENT } from "../constants";
import { copyEndGameStatus } from "../utils/copy";
import { stopEvent } from "../utils/events";
import { isGuessValid } from "../utils/words";
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
  const [invalidGuess, setInvalidGuess] = useState(null);

  const dismissInvalidGuessModal = () => setInvalidGuess(null);

  const submitValidGuess = () => {
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

      {invalidGuess != null && (
        <InvalidGuessModal
          dismissModal={dismissInvalidGuessModal}
          word={invalidGuess}
        />
      )}
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

function EnterKey({ state, submitValidGuess }) {
  const { endGameStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.SpecialKey}`}
      disabled={endGameStatus || pendingGuesses.length !== 4}
      onClick={submitValidGuess}
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
