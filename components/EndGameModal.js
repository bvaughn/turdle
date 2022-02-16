import { useRef, useState } from "react";
import useModalDismissSignal from "../hooks/useModalDismissSignal";
import {
  COMPLETE_STATUS_WON,
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";
import { getTargetWord } from "../utils/words";
import styles from "./EndGameModal.module.css";

export default function EndGameModal({ dismissModal, restart, state }) {
  const ref = useRef(null);
  const [didCopy, setDidCopy] = useState(false);

  useModalDismissSignal(ref, dismissModal, true);

  if (!state.showEndGameModal) {
    return null;
  }

  const didWin = state.endGameStatus === COMPLETE_STATUS_WON;

  const text = didWin ? "Congratulations! You won!" : "Better luck next time!";

  const retry = () => {
    restart(getTargetWord());
  };

  const share = () => {
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

    setDidCopy(true);
  };

  return (
    <div className={styles.Background}>
      <div className={styles.Dialog}>
        <div className={styles.Header}>{text}</div>

        <button className={styles.CloseButton} onClick={dismissModal}>
          <CloseIcon />
        </button>

        {didCopy && (
          <div className={styles.CopiedToClipboard}>Copied to clipboard</div>
        )}

        <div className={styles.Buttons}>
          <button className={styles.PlayAgainButton} onClick={retry}>
            Play again
          </button>

          {didWin && (
            <button className={styles.ShareButton} onClick={share}>
              Share
              <ShareIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const CloseIcon = () => (
  <svg className={styles.CloseIcon} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg className={styles.ShareIcon} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.91 18 21.91S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08M18 4C18.55 4 19 4.45 19 5S18.55 6 18 6 17 5.55 17 5 17.45 4 18 4M6 13C5.45 13 5 12.55 5 12S5.45 11 6 11 7 11.45 7 12 6.55 13 6 13M18 20C17.45 20 17 19.55 17 19S17.45 18 18 18 19 18.45 19 19 18.55 20 18 20Z"
    />
  </svg>
);