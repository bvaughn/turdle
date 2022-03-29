import {
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PENDING,
  STATUS_PRESENT,
} from "../constants";
import Modal from "./Modal";
import Tile from "./Tile";
import Icon from "./Icon";
import styles from "./HelpModal.module.css";

export default function HelpModal({ dismissModal }) {
  return (
    <Modal dismissModal={dismissModal} testName="HelpModal">
      <button
        className={styles.CloseButton}
        data-testname="DismissButton"
        onClick={dismissModal}
      >
        <Icon className={styles.CloseIcon} type="close" />
      </button>

      <div className={styles.Paragraph}>
        Guess the <strong>TURDLE</strong> in four tries.
      </div>
      <div className={styles.Paragraph}>
        Each guess must be a valid four-letter word for 💩.
      </div>
      <div className={styles.Paragraph}>
        Hit the enter button to submit. After each guess, the color of the tiles
        will change to show how close your guess was to the word.:
      </div>
      <div className={styles.Paragraph}>
        <div className={styles.Example}>
          <Tile letter="C" status={STATUS_CORRECT} />
          <Tile letter="R" status={STATUS_INCORRECT} />
          <Tile letter="A" status={STATUS_PRESENT} />
          <Tile letter="P" status={STATUS_INCORRECT} />
        </div>
      </div>
      <div className={styles.Paragraph}>
        The letter <strong>C</strong> is in the word and in the correct spot.
        <br />
        The letter <strong>A</strong> is in the word but in the wrong spot.
        <br />
        The letters <strong>R</strong> and <strong>P</strong> are not in the
        word.
      </div>
    </Modal>
  );
}
