import {
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PENDING,
  STATUS_PRESENT,
} from "../constants";
import GridLetter from "./GridLetter";
import Modal from "./Modal";
import styles from "./HelpModule.module.css";

export default function HelpModal({ dismissModal }) {
  return (
    <Modal dismissModal={dismissModal}>
      <button className={styles.CloseButton} onClick={dismissModal}>
        <CloseIcon />
      </button>

      <div className={styles.Paragraph}>
        Guess the <strong>TURDLE</strong> in six tries.
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
          <GridLetter letter="C" status={STATUS_CORRECT} />
          <GridLetter letter="R" status={STATUS_INCORRECT} />
          <GridLetter letter="A" status={STATUS_PRESENT} />
          <GridLetter letter="P" status={STATUS_INCORRECT} />
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

const CloseIcon = () => (
  <svg className={styles.CloseIcon} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z"
    />
  </svg>
);
