import { useState } from "react";
import Modal from "./Modal";
import { COMPLETE_STATUS_WON } from "../constants";
import { copyEndGameStatus } from "../utils/copy";
import { getTargetWord } from "../utils/words";
import Icon from "./Icon";
import styles from "./EndGameModal.module.css";

export default function EndGameModal({ dismissModal, restart, state }) {
  const [didCopy, setDidCopy] = useState(false);

  if (!state.showEndGameModal) {
    return null;
  }

  const didWin = state.endGameStatus === COMPLETE_STATUS_WON;

  const text = didWin ? "Congratulations! You won!" : "Better luck next time!";

  const retry = () => {
    restart(getTargetWord());
  };

  const share = () => {
    copyEndGameStatus(state);
    setDidCopy(true);
  };

  return (
    <Modal className={styles.DelayFadeIn} dismissModal={dismissModal}>
      <div className={styles.Content}>
        <div className={styles.Header}>{text}</div>

        <button className={styles.CloseButton} onClick={dismissModal}>
          <Icon className={styles.CloseIcon} type="close" />
        </button>

        {didCopy && (
          <div className={styles.CopiedToClipboard}>Copied to clipboard</div>
        )}

        <div className={styles.Buttons}>
          <button
            className={`${styles.Button} ${styles.PlayAgainButton}`}
            onClick={retry}
          >
            Play again
            <Icon className={styles.ReplayIcon} type="replay" />
          </button>

          {didWin && (
            <button
              className={`${styles.Button} ${styles.ShareButton}`}
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
