import { useState } from "react";
import Modal from "./Modal";
import Tile from "./Tile";
import Icon from "./Icon";
import { LOCAL_STORAGE_SETTINGS } from "../constants";
import { localStorageSetItem } from "../utils/localStorage";
import { getRandomWordList } from "../utils/words";
import styles from "./SettingsModal.module.css";

export default function SettingsModal({ dismissModal, saveSettings, state }) {
  const [wordLength, setWordLength] = useState(state.wordLength);

  const saveSettingsAndClose = () => {
    const preferences = { wordLength };

    localStorageSetItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(preferences));

    let wordList = state.wordList;
    if (preferences.wordLength !== state.wordLength) {
      wordList = getRandomWordList(preferences.wordLength);
    }

    saveSettings(preferences, wordList);

    dismissModal();
  };

  return (
    <Modal dismissModal={dismissModal} testName="SettingsModal">
      <div className={styles.Content}>
        <button
          className={styles.CloseButton}
          data-testname="DismissButton"
          onClick={dismissModal}
        >
          <Icon className={styles.CloseIcon} type="close" />
        </button>

        <div className={styles.Header}>Game settings</div>

        <ul className={styles.WordLengthList}>
          <li className={styles.WordLengthListItem}>
            <WordLengthInput
              label="Easy"
              wordLength={wordLength}
              setWordLength={setWordLength}
              value={3}
            />
          </li>
          <li className={styles.WordLengthListItem}>
            <WordLengthInput
              label="Normal"
              wordLength={wordLength}
              setWordLength={setWordLength}
              value={4}
            />
          </li>
          <li className={styles.WordLengthListItem}>
            <WordLengthInput
              label="Hard"
              wordLength={wordLength}
              setWordLength={setWordLength}
              value={5}
            />
          </li>
          <li className={styles.WordLengthListItem}>
            <WordLengthInput
              label="Master"
              wordLength={wordLength}
              setWordLength={setWordLength}
              value={6}
            />
          </li>
        </ul>
      </div>

      <button
        className={styles.SaveButton}
        data-testname="SaveButton"
        onClick={saveSettingsAndClose}
      >
        Save
        <Icon className={styles.SaveIcon} type="save" />
      </button>
    </Modal>
  );
}

function WordLengthInput({
  dismissModal,
  label,
  wordLength,
  setWordLength,
  value,
}) {
  const handleChange = () => {
    setWordLength(value);
  };

  return (
    <label data-testname={`DifficultyRadio-${value}`}>
      <input
        type="radio"
        name="wordLength"
        value={value}
        checked={wordLength === value}
        onChange={handleChange}
      />{" "}
      <span className={styles.WordLengthLabel}>{label}</span>
      <span className={styles.WordLength}>({value} letters)</span>
    </label>
  );
}
