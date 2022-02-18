import Icon from "./Icon";
import Modal from "./Modal";
import styles from "./InvalidGuessModal.module.css";

export default function InvalidGuessModal({ dismissModal, word }) {
  return (
    <Modal dismissModal={dismissModal} testName="InvalidGuessModal">
      <button
        className={styles.CloseButton}
        data-testname="DismissButton"
        onClick={dismissModal}
      >
        <Icon className={styles.CloseIcon} type="close" />
      </button>

      <div className={styles.Header}>Oops!</div>

      <div className={styles.Message}>
        <span className={styles.InvalidWord}>{word}</span> isn't a valid 💩
      </div>

      <button
        className={styles.Button}
        data-testname="RetryButton"
        onClick={dismissModal}
      >
        Try again!
      </button>
    </Modal>
  );
}
