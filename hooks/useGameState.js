import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "../utils/localStorage";
import { isGuessValid } from "../utils/words";
import { getRandomWordList } from "../utils/words";
import {
  COMPLETE_STATUS_LOST,
  COMPLETE_STATUS_WON,
  DEFAULT_WORD_LENGTH,
  MAX_HISTORY_SIZE,
  LOCAL_STORAGE_KEY_GAME_STATS,
  LOCAL_STORAGE_SETTINGS,
  MAX_GUESSES,
  STATUS_CORRECT,
  STATUS_INCORRECT,
  STATUS_PRESENT,
} from "../constants";
import { getGuessedLetters, getUniqueLetters } from "../utils/game";

const ACTION_TYPE_ADD_PENDING_GUESS = "add-pending-guess";
const ACTION_TYPE_DELETE_PENDING_GUESS = "delete-pending-guess";
const ACTION_TYPE_DISMISS_MODAL = "dismiss-modal";
const ACTION_TYPE_GIVE_HINT = "give-hint";
const ACTION_TYPE_LOAD_PAST_GAME = "load-past-game";
const ACTION_TYPE_RESTART = "restart";
const ACTION_TYPE_SAVE_SETTINGS = "save-settings";
const ACTION_TYPE_SUBMIT_PENDING_GUESSES = "submit-pending-guesses";

const DEFAULT_GAME_STATS = {
  // How many games were won after N number of guesses?
  guessDistribution: {},

  // Serialized representation of the most recent N games.
  history: [],

  // How many games have been lost?
  lostCount: 0,

  // How many games have been won?
  wonCount: 0,
};

const DEFAULT_STATE = {
  // If the game is complete, this field will be either "won" or "lost".
  // If this field is null, the game is still in progress.
  endGameStatus: null,

  // The letters that have been given as hints.
  hasRemainingHints: true,
  hints: [],

  // We are currently viewing a past (read-only) game.
  isPastGame: false,

  // State of keyboard keys.
  // Each key is a lower case letter (e.g. "a") which maps to its visual state.
  // If a key is not present, this indicates that it has not yet been used as part of a guess.
  // if the key is present, it will map to a status: "correct", "present", or "incorrect".
  letterKeys: {},

  // This is the pending word being guessed.
  pendingGuesses: [],

  // Display end-of-game modal with sharing options.
  showEndGameModal: false,

  // Nested array of guessed "words".
  // Each "word" is an array of tuples: guessed "letters" and guess statuses.
  // which in turn is represented by an object with descriptive properties.
  submittedGuesses: [],

  // This is the word curently being guessed.
  targetWord: null,

  // The number of letters in the target word.
  wordLength: 0,

  // This is the list of remaining words to be guessed.
  wordList: [],
};

function reduce(state, action) {
  const { payload, type } = action;

  switch (type) {
    case ACTION_TYPE_ADD_PENDING_GUESS: {
      const { endGameStatus, pendingGuesses, wordLength } = state;
      const { letter } = payload;

      if (endGameStatus != null) {
        return state;
      } else if (pendingGuesses.length >= wordLength) {
        return state;
      }

      return {
        ...state,
        pendingGuesses: [...pendingGuesses, letter],
      };
    }

    case ACTION_TYPE_DELETE_PENDING_GUESS: {
      const { endGameStatus, pendingGuesses } = state;

      if (endGameStatus) {
        return state;
      } else if (pendingGuesses.length === 0) {
        return state;
      }

      return {
        ...state,
        pendingGuesses: pendingGuesses.slice(0, pendingGuesses.length - 1),
      };
    }

    case ACTION_TYPE_DISMISS_MODAL: {
      const { showEndGameModal } = state;

      if (!showEndGameModal) {
        return state;
      }

      return {
        ...state,
        showEndGameModal: false,
      };
    }

    case ACTION_TYPE_GIVE_HINT: {
      const { hints, submittedGuesses, targetWord } = state;

      const targetWordLetters = getUniqueLetters(targetWord);
      const guessedLetters = getGuessedLetters(
        submittedGuesses,
        targetWordLetters
      );

      const unguessedLetters = Array.from(targetWordLetters.keys()).filter(
        (letter) => !guessedLetters.has(letter) && !hints.includes(letter)
      );
      if (unguessedLetters.length === 0) {
        return state;
      }

      const index = Math.floor(Math.random() * length);
      const letter = unguessedLetters[index];

      return {
        ...state,
        hasRemainingHints: unguessedLetters.length > 1,
        hints: [...hints, letter],
      };
    }

    case ACTION_TYPE_LOAD_PAST_GAME: {
      const { game } = payload;
      const { endGameStatus, letterKeys, submittedGuesses, targetWord } = game;

      return {
        ...state,
        endGameStatus,
        isPastGame: true,
        letterKeys,
        submittedGuesses,
        targetWord,
      };
    }

    case ACTION_TYPE_RESTART: {
      const { reuseWord } = payload;
      const { targetWord, wordList, wordLength } = state;

      const newWordList = [...wordList];

      // Add it back, but to the end of the list.
      if (reuseWord === true) {
        newWordList.push(targetWord);
      }

      if (newWordList.length === 0) {
        return state;
      }

      return {
        ...DEFAULT_STATE,
        targetWord: newWordList[0],
        wordLength,
        wordList: newWordList.slice(1),
      };
    }

    case ACTION_TYPE_SAVE_SETTINGS: {
      const { settings, wordList } = payload;
      const { isPastGame } = state;

      if (!wordList || wordList.length === 0) {
        console.error("Word list required");
        return state;
      }

      if (!settings?.wordLength) {
        console.error("Invalid settings objcet");
        return state;
      }

      if (isPastGame) {
        return {
          ...state,
          ...settings,

          wordList,
        };
      } else {
        return {
          ...state,
          ...settings,

          endGameStatus: null,
          letterKeys: {},
          pendingGuesses: [],
          submittedGuesses: [],
          targetWord: wordList[0],
          wordList: wordList.slice(1),
        };
      }
    }

    case ACTION_TYPE_SUBMIT_PENDING_GUESSES: {
      const {
        endGameStatus,
        letterKeys,
        pendingGuesses,
        submittedGuesses,
        targetWord,
        wordLength,
      } = state;

      if (endGameStatus) {
        return state;
      } else if (pendingGuesses.length !== wordLength) {
        return state;
      }

      const newWord = pendingGuesses.join("");
      if (!isGuessValid(newWord)) {
        return state;
      }

      let newEndGameStatus = null;

      const targetWordLetterCount = {};
      for (let index = 0; index < targetWord.length; index++) {
        const letter = targetWord.charAt(index);
        if (targetWordLetterCount[letter] == null) {
          targetWordLetterCount[letter] = 0;
        }
        targetWordLetterCount[letter]++;
      }

      const newLetterKeys = { ...letterKeys };
      const newGuess = [];
      for (let index = 0; index < pendingGuesses.length; index++) {
        const letter = pendingGuesses[index];
        newGuess.push([letter, STATUS_INCORRECT]);

        if (newLetterKeys[letter] == null) {
          newLetterKeys[letter] = STATUS_INCORRECT;
        }
      }

      // First, look for any "correct" letters.
      for (let index = 0; index < newGuess.length; index++) {
        const tuple = newGuess[index];
        const letter = tuple[0];
        if (targetWordLetterCount[letter] > 0) {
          const isCorrect = targetWord.charAt(index) === letter;
          if (isCorrect) {
            targetWordLetterCount[letter]--;
            tuple[1] = STATUS_CORRECT;
            newLetterKeys[letter] = STATUS_CORRECT;
          }
        }
      }

      // Then look for "present" letters (assuming we have remaining target word letters).
      for (let index = 0; index < newGuess.length; index++) {
        const tuple = newGuess[index];
        if (tuple[1] != STATUS_CORRECT) {
          const letter = tuple[0];
          if (targetWordLetterCount[letter] > 0) {
            const isPresent = targetWord.includes(letter);
            if (isPresent) {
              targetWordLetterCount[letter]--;
              tuple[1] = STATUS_PRESENT;

              if (newLetterKeys[letter] === STATUS_INCORRECT) {
                newLetterKeys[letter] = STATUS_PRESENT;
              }
            }
          }
        }
      }

      if (newWord === targetWord) {
        newEndGameStatus = COMPLETE_STATUS_WON;
      } else if (submittedGuesses.length === MAX_GUESSES - 1) {
        newEndGameStatus = COMPLETE_STATUS_LOST;
      }

      return {
        ...state,
        endGameStatus: newEndGameStatus,
        letterKeys: newLetterKeys,
        pendingGuesses: [],
        showEndGameModal: newEndGameStatus !== null,
        submittedGuesses: [...submittedGuesses, newGuess],
      };
    }

    default: {
      console.error(`Unrecognized action "${type}"`);
      return state;
    }
  }
}

export default function useGameState({ initialWordLength, initialWordList }) {
  const [state, dispatch] = useReducer(reduce, null, () => {
    let preferences = localStorageGetItem(LOCAL_STORAGE_SETTINGS);
    if (preferences) {
      preferences = JSON.parse(preferences);
    } else {
      preferences = { wordLength: initialWordLength || DEFAULT_WORD_LENGTH };
    }

    const wordLength = initialWordLength || preferences.wordLength;
    const wordList = initialWordList || getRandomWordList(wordLength);

    return {
      ...DEFAULT_STATE,
      targetWord: wordList[0],
      wordLength,
      wordList: wordList.slice(1),
    };
  });

  const prevEndGameStatusRef = useRef(false);

  useEffect(() => {
    const {
      endGameStatus,
      isPastGame,
      letterKeys,
      submittedGuesses,
      targetWord,
    } = state;
    if (endGameStatus != null) {
      const prevEndGameStatus = prevEndGameStatusRef.current;

      // Only update game stats once per game.
      if (prevEndGameStatus !== endGameStatus) {
        // Never update stats when viewing old games.
        if (!isPastGame) {
          let gameStats = localStorageGetItem(LOCAL_STORAGE_KEY_GAME_STATS);
          if (gameStats == null) {
            gameStats = JSON.parse(JSON.stringify(DEFAULT_GAME_STATS));
          } else {
            gameStats = JSON.parse(gameStats);
          }

          if (endGameStatus === COMPLETE_STATUS_WON) {
            const guessDistribution = gameStats.guessDistribution;
            if (!guessDistribution[submittedGuesses.length]) {
              guessDistribution[submittedGuesses.length] = 1;
            } else {
              gameStats.guessDistribution[submittedGuesses.length]++;
            }

            gameStats.wonCount++;
          } else {
            gameStats.lostCount++;
          }

          // We only need some of the state to the history.
          const newGameStat = {
            date: Date.now(),
            endGameStatus,
            letterKeys,
            submittedGuesses,
            targetWord,
          };

          if (!gameStats.history) {
            // Handle data that was saved to localStorage before "history" field added.
            gameStats.history = [newGameStat];
          } else {
            // Add most recent entries to the front of the history array.
            gameStats.history.unshift(newGameStat);

            // Trim as needed.
            while (gameStats.history.length > MAX_HISTORY_SIZE) {
              gameStats.history.pop();
            }
          }

          localStorageSetItem(
            LOCAL_STORAGE_KEY_GAME_STATS,
            JSON.stringify(gameStats)
          );
        }
      }
    }

    prevEndGameStatusRef.current = endGameStatus;
  }, [state]);

  const addPendingGuess = useCallback((letter) => {
    dispatch({
      type: ACTION_TYPE_ADD_PENDING_GUESS,
      payload: {
        letter,
      },
    });
  }, []);

  const deletePendingGuess = useCallback(() => {
    dispatch({ type: ACTION_TYPE_DELETE_PENDING_GUESS });
  }, []);

  const dismissModal = useCallback(() => {
    dispatch({ type: ACTION_TYPE_DISMISS_MODAL });
  }, []);

  const giveHint = useCallback(() => {
    dispatch({ type: ACTION_TYPE_GIVE_HINT });
  }, []);

  const loadPastGame = useCallback((game) => {
    dispatch({ type: ACTION_TYPE_LOAD_PAST_GAME, payload: { game } });
  }, []);

  const restart = useCallback((reuseWord = false) => {
    dispatch({ type: ACTION_TYPE_RESTART, payload: { reuseWord } });
  }, []);

  const saveSettings = useCallback((settings, wordList) => {
    dispatch({
      type: ACTION_TYPE_SAVE_SETTINGS,
      payload: { settings, wordList },
    });
  }, []);

  const submitPendingGuesses = useCallback(() => {
    dispatch({ type: ACTION_TYPE_SUBMIT_PENDING_GUESSES });
  }, []);

  return {
    addPendingGuess,
    deletePendingGuess,
    dismissModal,
    giveHint,
    loadPastGame,
    restart,
    saveSettings,
    state,
    submitPendingGuesses,
  };
}
