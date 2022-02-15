import { useLayoutEffect } from "react";
import styles from "./Keyboard.module.css";

const TOP_ROW_LETTERS = "qwertyuiop".split("");
const MIDDLE_ROW_LETTERS = "asdfghjkl".split("");
const BOTTOM_ROW_LETTERS = "zxcvbnm".split("");

function stopEvent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

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
  const { completeStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.KeyAvailable}`}
      disabled={completeStatus || pendingGuesses.length === 0}
      onClick={deletePendingGuess}
    >
      Delete
    </button>
  );
}

function EnterKey({ submitPendingGuesses, state }) {
  const { completeStatus, pendingGuesses } = state;

  return (
    <button
      className={`${styles.Key} ${styles.KeyAvailable}`}
      disabled={completeStatus || pendingGuesses.length !== 4}
      onClick={submitPendingGuesses}
    >
      Enter
    </button>
  );
}

function LetterKey({ addPendingGuess, letter, state }) {
  const {
    correctKeys,
    completeStatus,
    pendingGuesses,
    presentKeys,
    submittedGuesses,
  } = state;

  const disabled = completeStatus || pendingGuesses.length === 4;
  const classNames = [styles.Key];
  if (correctKeys.hasOwnProperty(letter)) {
    classNames.push(styles.KeyCorrect);
  } else if (presentKeys.hasOwnProperty(letter)) {
    classNames.push(styles.KeyPresent);
  }
  console.log("correctKeys:", correctKeys, "presentKeys:", presentKeys);

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
