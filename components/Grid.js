import styles from "./Grid.module.css";

export default function Grid({ state }) {
  const guesses = [];
  for (let index = 0; index < 16; index++) {
    guesses.push(<Guess key={index} index={index} state={state} />);
  }

  return <div className={styles.Grid}>{guesses}</div>;
}

function Guess({ index, state }) {
  const { pendingGuesses, submittedGuesses, targetWord } = state;

  let isSubmitted = false;
  let isPending = false;
  let letter = "";
  if (index < submittedGuesses.length) {
    isSubmitted = true;
    letter = submittedGuesses[index];
  } else {
    index -= submittedGuesses.length;

    if (index < pendingGuesses.length) {
      isPending = true;
      letter = pendingGuesses[index];
    }
  }

  const classNames = [styles.Letter];
  if (letter) {
    if (isPending) {
      classNames.push(styles.Pending);
    } else if (isSubmitted) {
      if (targetWord.includes(letter)) {
        const charIndex = index % 4;
        if (targetWord.charAt(charIndex) === letter) {
          classNames.push(styles.Correct);
        } else {
          classNames.push(styles.Present);
        }
      } else {
        classNames.push(styles.Absent);
      }
    } else {
      classNames.push(styles.Absent);
    }
  } else {
    classNames.push(styles.Empty);
  }

  return <div className={classNames.join(" ")}>{letter}</div>;
}
