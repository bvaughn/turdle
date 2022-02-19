import Icon from "./Icon";
import Modal from "./Modal";
import styles from "./CopyConfirmationModal.module.css";

export default function CopyConfirmationModal({ dismissModal, word }) {
  return (
    <Modal dismissModal={dismissModal} testName="CopyConfirmationModal">
      <button
        className={styles.CloseButton}
        data-testname="DismissButton"
        onClick={dismissModal}
      >
        <Icon className={styles.CloseIcon} type="close" />
      </button>

      <div className={styles.Header}>Copied to the clipboard</div>

      <div className={styles.Message}>Go share your 💩 with friends!</div>

      <button
        className={styles.Button}
        data-testname="RetryButton"
        onClick={dismissModal}
      >
        Okay!
      </button>
    </Modal>
  );
}
