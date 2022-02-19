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
import styles from "./HistoryModal.module.css";

export default function HistoryModal({ dismissModal, loadPastGame, state }) {
  return (
    <Modal dismissModal={dismissModal} testName="HistoryModal">
      <div className={styles.Content}>
        <div className={styles.Header}>Recent games</div>

        <button
          className={styles.CloseButton}
          data-testname="DismissButton"
          onClick={dismissModal}
        >
          <Icon className={styles.CloseIcon} type="close" />
        </button>

        <History
          dismissModal={dismissModal}
          loadPastGame={loadPastGame}
          state={state}
        />
      </div>
    </Modal>
  );
}

function History({ dismissModal, loadPastGame, state }) {
  const [gameStats] = useLocalStorage(LOCAL_STORAGE_KEY_GAME_STATS);
  if (!gameStats) {
    return null;
  }

  const { history, lostCount, wonCount } = gameStats;

  if (!history) {
    return null;
  }

  const additionalCount = wonCount + lostCount - history.length;

  return (
    <div>
      {history.map((entry, index) => (
        <HistoryListItem
          key={index}
          dismissModal={dismissModal}
          entry={entry}
          loadPastGame={loadPastGame}
          state={state}
        />
      ))}
      {additionalCount > 0 && (
        <div className={styles.AdditionalCount}>
          and {additionalCount} additional games.
        </div>
      )}
    </div>
  );
}

function HistoryListItem({ dismissModal, entry, loadPastGame, state }) {
  const { date, endGameStatus, submittedGuesses, targetWord } = entry;

  const handleClick = () => {
    loadPastGame(entry);
    dismissModal();
  };

  const blocks = [];
  const className =
    endGameStatus === COMPLETE_STATUS_WON ? styles.BlockWon : styles.BlockLost;
  for (let i = 0; i < submittedGuesses.length; i++) {
    blocks.push(<div key={i} className={className} />);
  }

  return (
    <div
      className={styles.HistoryList}
      data-testname="HistoryListItem"
      onClick={handleClick}
    >
      <div className={styles.PastGameWord}>{targetWord}</div>
      <div className={styles.PastGameStatus}>{blocks}</div>
      <time className={styles.PastGameTime}>
        {new Date(date).toLocaleString(undefined, {
          hourCycle: "h24",
          hour: "numeric",
          minute: "numeric",
          month: "short",
          day: "numeric",
        })}
      </time>
    </div>
  );
}
