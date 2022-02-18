import { useState } from "react";
import Modal from "./Modal";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  COMPLETE_STATUS_WON,
  LOCAL_STORAGE_KEY_GAME_STATS,
  MAX_GUESSES,
} from "../constants";
import { copyEndGameStatus } from "../utils/copy";
import Icon from "./Icon";
import styles from "./EndGameModal.module.css";

export default function EndGameModal({ dismissModal, restart, state }) {
  const [didCopy, setDidCopy] = useState(false);

  if (!state.showEndGameModal) {
    return null;
  }

  const didWin = state.endGameStatus === COMPLETE_STATUS_WON;
  const hasMoreWordsToGuess = state.wordList.length > 0 || !didWin;

  const text = didWin ? (
    <>
      <strong>Congratulations!</strong> You won! 🎉
    </>
  ) : (
    <>
      <strong>So close!</strong> You'll get it next time! ❤️
    </>
  );

  const share = () => {
    copyEndGameStatus(state);
    setDidCopy(true);
  };

  const replay = () => {
    restart(!didWin);
  };

  return (
    <Modal
      className={styles.DelayFadeIn}
      dismissModal={dismissModal}
      testName="EndGameModal"
    >
      <div className={styles.Content}>
        <div className={styles.Header}>{text}</div>

        <button
          className={styles.CloseButton}
          data-testname="DismissButton"
          onClick={dismissModal}
        >
          <Icon className={styles.CloseIcon} type="close" />
        </button>

        {!hasMoreWordsToGuess && (
          <>
            <div className={styles.EmptyWordList}>
              You've also guessed all of our 💩 words!
            </div>
            <div className={styles.EmptyWordList}>
              (If we missed one, please
              <a
                className={styles.EmptyWordListLink}
                href="https://github.com/bvaughn/turdle/issues/new?title=New%20poop%20word&labels=enhancement"
                rel="noreferrer"
                target="_blank"
              >
                tell us
              </a>
              !)
            </div>
          </>
        )}

        <History />

        {didCopy && (
          <div className={styles.CopiedToClipboard}>Copied to clipboard</div>
        )}

        <div className={styles.Buttons}>
          {hasMoreWordsToGuess && (
            <button
              className={`${styles.Button} ${styles.PlayAgainButton}`}
              data-testname="ReplayButton"
              onClick={replay}
            >
              Play again
              <Icon className={styles.ReplayIcon} type="replay" />
            </button>
          )}

          {didWin && (
            <button
              className={`${styles.Button} ${styles.ShareButton}`}
              data-testname="ShareButton"
              onClick={share}
            >
              Share
              <Icon className={styles.ShareIcon} type="share" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function History() {
  const [gameStats] = useLocalStorage(LOCAL_STORAGE_KEY_GAME_STATS);
  if (!gameStats) {
    return null;
  }

  const { lostCount, guessDistribution, wonCount } = gameStats;

  const winPercentage = Math.round(100 * (wonCount / (wonCount + lostCount)));
  const header = `You've won ${winPercentage}% of the games you've played!`;

  let maxGuessCount = 0;
  for (let i = 1; i <= MAX_GUESSES; i++) {
    maxGuessCount = Math.max(maxGuessCount, guessDistribution[i]);
  }

  return (
    <div className={styles.History}>
      <div className={styles.HistoryHeader}>{header}</div>
      <ul className={styles.HistoryList}>
        <HistoryListItem
          guessCount={guessDistribution[1]}
          label={1}
          maxGuessCount={maxGuessCount}
        />
        <HistoryListItem
          guessCount={guessDistribution[2]}
          label={2}
          maxGuessCount={maxGuessCount}
        />
        <HistoryListItem
          guessCount={guessDistribution[3]}
          label={3}
          maxGuessCount={maxGuessCount}
        />
        <HistoryListItem
          guessCount={guessDistribution[4]}
          label={4}
          maxGuessCount={maxGuessCount}
        />
      </ul>
    </div>
  );
}

function HistoryListItem({ guessCount, label, maxGuessCount }) {
  const boxClassName =
    guessCount > 0 ? styles.HistoryCorrextBox : styles.HistoryEmptyBox;

  const boxWidth =
    guessCount > 0 ? `${(100 * guessCount) / maxGuessCount}%` : undefined;

  return (
    <li className={styles.HistoryListItem}>
      <div className={styles.HistoryLabel}>{label}</div>
      <div className={boxClassName} style={{ width: boxWidth }}>
        {guessCount}
      </div>
    </li>
  );
}
