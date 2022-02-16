import {
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PENDING,
  STATUS_PRESENT,
} from "../constants";
import styles from "./Tile.module.css";

export default function Tile({ letter, status }) {
  const classNames = [styles.Tile];
  if (letter) {
    switch (status) {
      case STATUS_CORRECT:
        classNames.push(styles.Correct);
        break;
      case STATUS_INCORRECT:
        classNames.push(styles.Incorrect);
        break;
      case STATUS_PRESENT:
        classNames.push(styles.Present);
        break;
      case STATUS_PENDING:
        classNames.push(styles.Pending);
        break;
      default:
        classNames.push(styles.Empty);
        break;
    }
  } else {
    classNames.push(styles.Empty);
  }

  return <div className={classNames.join(" ")}>{letter}</div>;
}
