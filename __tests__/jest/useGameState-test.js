import { createElement } from "react";
import { act, create } from "react-test-renderer";
import {
  LOCAL_STORAGE_KEY_GAME_STATS,
  LOCAL_STORAGE_SETTINGS,
} from "../../constants";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "../../utils/localStorage";
import useGameState from "../../hooks/useGameState";

describe("useGameState", () => {
  let testRendererInstance = null;

  let addPendingGuess = null;
  let currentGameState = null;
  let deletePendingGuess = null;
  let dismissModal = null;
  let loadPastGame = null;
  let restart = null;
  let saveSettings = null;
  let submitPendingGuesses = null;

  function guessWordHelper(word) {
    deleteGuessedWord();

    for (let i = 0; i < word.length; i++) {
      addPendingGuess(word.charAt(i));
    }

    submitPendingGuesses();
  }

  function deleteGuessedWord() {
    while (currentGameState.pendingGuesses.length > 0) {
      deletePendingGuess();
    }
  }

  function Component({ wordLength, wordList }) {
    const result = useGameState({
      initialWordLength: wordLength,
      initialWordList: wordList,
    });

    currentGameState = result.state;

    addPendingGuess = (guess) => {
      act(() => result.addPendingGuess(guess));
    };
    deletePendingGuess = () => {
      act(() => result.deletePendingGuess());
    };
    dismissModal = () => {
      act(() => result.dismissModal());
    };
    loadPastGame = (pastGame) => {
      act(() => result.loadPastGame(pastGame));
    };
    restart = (reuseWord) => {
      act(() => result.restart(reuseWord));
    };
    saveSettings = (settings, wordList) => {
      act(() => result.saveSettings(settings, wordList));
    };
    submitPendingGuesses = () => {
      act(() => result.submitPendingGuesses());
    };

    return null;
  }

  function getGameStats() {
    const raw = localStorageGetItem(LOCAL_STORAGE_KEY_GAME_STATS);
    return raw !== null ? JSON.parse(raw) : null;
  }

  function getSavedSettings() {
    const raw = localStorageGetItem(LOCAL_STORAGE_SETTINGS);
    return raw !== null ? JSON.parse(raw) : null;
  }

  beforeEach(() => {
    class LocalStorageMock {
      _store = {};
      clear() {
        this._store = {};
      }
      getItem(key) {
        return this._store[key] || null;
      }
      setItem(key, value) {
        this._store[key] = String(value);
      }
      removeItem(key) {
        delete this._store[key];
      }
    }

    global.localStorage = new LocalStorageMock();

    testRendererInstance = create(
      createElement(Component, { wordList: ["caca", "poop", "turd"] })
    );
  });

  afterEach(() => {
    testRendererInstance.unmount();
    testRendererInstance = null;

    global.localStorage = null;

    addPendingGuess = null;
    currentGameState = null;
    deletePendingGuess = null;
    dismissModal = null;
    restart = null;
    saveSettings = null;
    submitPendingGuesses = null;
  });

  it("should initialize correctly", () => {
    const { state } = currentGameState;
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.letterKeys).toEqual({});
    expect(currentGameState.pendingGuesses).toHaveLength(0);
    expect(currentGameState.submittedGuesses).toHaveLength(0);
    expect(currentGameState.targetWord).toEqual("caca");
  });

  it("should only accept guesses that are valid words", () => {
    guessWordHelper("test"); // Not a valid poop word
    expect(currentGameState.submittedGuesses).toHaveLength(0);
    deleteGuessedWord();
    guessWordHelper("poop"); // Valid poop word
    expect(currentGameState.submittedGuesses).toHaveLength(1);
  });

  it("should advance through the word list until there are no more", () => {
    const { state } = currentGameState;
    guessWordHelper("caca");
    expect(currentGameState.endGameStatus).toBe("won");

    restart();
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.targetWord).toBe("poop");
    guessWordHelper("poop");
    expect(currentGameState.endGameStatus).toBe("won");

    restart(true); // Re-add "poop" to the end of the queue
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.targetWord).toBe("turd");
    guessWordHelper("turd");
    expect(currentGameState.endGameStatus).toBe("won");

    // At this point, there will be only one word left in our list.
    // Let's fail it and see if we can try again.
    restart();
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.targetWord).toBe("poop");
    guessWordHelper("scat");
    guessWordHelper("scat");
    guessWordHelper("scat");
    guessWordHelper("scat");
    expect(currentGameState.endGameStatus).toBe("lost");

    restart(true);
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.targetWord).toBe("poop");
    guessWordHelper("poop");
    expect(currentGameState.endGameStatus).toBe("won");

    // We're out of words now.
    const clonedState = { ...currentGameState };
    restart();
    expect(currentGameState).toEqual(clonedState);
  });

  it("should support adding and deleting guesses", () => {
    addPendingGuess("a");
    addPendingGuess("b");
    expect(currentGameState.pendingGuesses).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
      ]
    `);

    deletePendingGuess();
    expect(currentGameState.pendingGuesses).toMatchInlineSnapshot(`
      Array [
        "a",
      ]
    `);

    deletePendingGuess();
    deletePendingGuess();
    expect(currentGameState.pendingGuesses).toHaveLength(0);
  });

  it("should correctly update guessed state", () => {
    guessWordHelper("shat");
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "a": "present",
        "h": "incorrect",
        "s": "incorrect",
        "t": "incorrect",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "incorrect",
          ],
          Array [
            "h",
            "incorrect",
          ],
          Array [
            "a",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
        ],
      ]
    `);

    guessWordHelper("crap");
    expect(currentGameState.endGameStatus).toBeNull();
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "a": "present",
        "c": "correct",
        "h": "incorrect",
        "p": "incorrect",
        "r": "incorrect",
        "s": "incorrect",
        "t": "incorrect",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "incorrect",
          ],
          Array [
            "h",
            "incorrect",
          ],
          Array [
            "a",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
        ],
        Array [
          Array [
            "c",
            "correct",
          ],
          Array [
            "r",
            "incorrect",
          ],
          Array [
            "a",
            "present",
          ],
          Array [
            "p",
            "incorrect",
          ],
        ],
      ]
    `);

    guessWordHelper("caca");
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "a": "correct",
        "c": "correct",
        "h": "incorrect",
        "p": "incorrect",
        "r": "incorrect",
        "s": "incorrect",
        "t": "incorrect",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "incorrect",
          ],
          Array [
            "h",
            "incorrect",
          ],
          Array [
            "a",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
        ],
        Array [
          Array [
            "c",
            "correct",
          ],
          Array [
            "r",
            "incorrect",
          ],
          Array [
            "a",
            "present",
          ],
          Array [
            "p",
            "incorrect",
          ],
        ],
        Array [
          Array [
            "c",
            "correct",
          ],
          Array [
            "a",
            "correct",
          ],
          Array [
            "c",
            "correct",
          ],
          Array [
            "a",
            "correct",
          ],
        ],
      ]
    `);
  });

  it("should mark a game as completed (won)", () => {
    guessWordHelper("caca");
    expect(currentGameState.endGameStatus).toEqual("won");
    expect(currentGameState.showEndGameModal).toBe(true);
    dismissModal();
    expect(currentGameState.showEndGameModal).toBe(false);
  });

  it("should mark a game as completed (lost)", () => {
    guessWordHelper("scat");
    expect(currentGameState.endGameStatus).toBeNull();
    guessWordHelper("scat");
    expect(currentGameState.endGameStatus).toBeNull();
    guessWordHelper("scat");
    expect(currentGameState.endGameStatus).toBeNull();
    guessWordHelper("scat");
    expect(currentGameState.endGameStatus).toEqual("lost");
    expect(currentGameState.showEndGameModal).toBe(true);
    dismissModal();
    expect(currentGameState.showEndGameModal).toBe(false);
  });

  describe("history", () => {
    it("should record game stats to localStorage", () => {
      let gameStats;

      localStorage.clear();

      guessWordHelper("caca");
      expect(currentGameState.endGameStatus).toBe("won");

      gameStats = getGameStats();
      expect(gameStats.lostCount).toBe(0);
      expect(gameStats.wonCount).toBe(1);
      expect(gameStats.history).toHaveLength(1);
      expect(gameStats.guessDistribution).toMatchInlineSnapshot(`
        Object {
          "1": 1,
        }
      `);

      restart();
      guessWordHelper("shit");
      guessWordHelper("shit");
      guessWordHelper("shit");
      guessWordHelper("shit");
      expect(currentGameState.endGameStatus).toBe("lost");

      gameStats = getGameStats();
      expect(gameStats.lostCount).toBe(1);
      expect(gameStats.wonCount).toBe(1);
      expect(gameStats.history).toHaveLength(2);
      expect(gameStats.guessDistribution).toMatchInlineSnapshot(`
        Object {
          "1": 1,
        }
      `);

      restart(true); // Put the word we just lost back into the queue.
      guessWordHelper("crap");
      guessWordHelper("turd");
      expect(currentGameState.endGameStatus).toBe("won");

      gameStats = getGameStats();
      expect(gameStats.lostCount).toBe(1);
      expect(gameStats.wonCount).toBe(2);
      expect(gameStats.history).toHaveLength(3);
      expect(gameStats.guessDistribution).toMatchInlineSnapshot(`
        Object {
          "1": 1,
          "2": 1,
        }
      `);

      const clonedGameStats = { ...gameStats };
      const clonedWordList = [...currentGameState.wordList];

      // Restore a previous game.
      loadPastGame(gameStats.history[1]);
      expect(currentGameState.submittedGuesses).toHaveLength(4);
      expect(currentGameState.endGameStatus).toBe("lost");

      // This should not affect the remaining word list.
      expect(currentGameState.wordList).toEqual(clonedWordList);

      // Load the first game (last in history)
      loadPastGame(gameStats.history[2]);
      expect(currentGameState.submittedGuesses).toHaveLength(1);
      expect(currentGameState.endGameStatus).toBe("won");

      // Load the most recent game (first in history)
      loadPastGame(gameStats.history[0]);
      expect(currentGameState.submittedGuesses).toHaveLength(2);
      expect(currentGameState.endGameStatus).toBe("won");

      // Start a new game.
      restart();
      expect(currentGameState.endGameStatus).toBe(null);
      expect(currentGameState.wordList).not.toEqual(clonedWordList);

      // Verify that no new history entries were added by the previous actions.
      expect(getGameStats()).toEqual(clonedGameStats);

      guessWordHelper("poop");
      expect(currentGameState.endGameStatus).toBe("won");

      gameStats = getGameStats();
      expect(gameStats.lostCount).toBe(1);
      expect(gameStats.wonCount).toBe(3);
      expect(gameStats.history).toHaveLength(4);
      expect(gameStats.guessDistribution).toMatchInlineSnapshot(`
        Object {
          "1": 2,
          "2": 1,
        }
      `);
    });
  });

  describe("settings", () => {
    it("should support changing game difficulty", () => {
      expect(currentGameState.targetWord).toHaveLength(4);
      expect(currentGameState.wordLength).toBe(4);

      saveSettings({ wordLength: 5 }, ["poopy"]);
      expect(currentGameState.targetWord).toHaveLength(5);
      expect(currentGameState.wordLength).toBe(5);

      saveSettings({ wordLength: 3 }, ["poo"]);
      expect(currentGameState.targetWord).toHaveLength(3);
      expect(currentGameState.wordLength).toBe(3);

      saveSettings({ wordLength: 6 }, ["sewage"]);
      expect(currentGameState.targetWord).toHaveLength(6);
      expect(currentGameState.wordLength).toBe(6);
    });

    it("should support viewing history items with different difficulty (word lengths)", () => {
      guessWordHelper("poop");
      guessWordHelper("caca");
      expect(currentGameState.endGameStatus).toBe("won");
      dismissModal();

      saveSettings({ wordLength: 5 }, ["poopy", "stool"]);
      guessWordHelper("poopy");
      expect(currentGameState.endGameStatus).toBe("won");
      dismissModal();

      const gameStats = getGameStats();

      loadPastGame(gameStats.history[1]);
      expect(currentGameState.endGameStatus).toBe("won");
      expect(currentGameState.submittedGuesses).toHaveLength(2);
      expect(currentGameState.targetWord).toBe("caca");
      expect(currentGameState.wordLength).toBe(5); // Does not change when viewing an old word.

      restart();
      expect(currentGameState.endGameStatus).toBeNull();
      expect(currentGameState.targetWord).toBe("stool");
      expect(currentGameState.wordLength).toBe(5);
    });

    it("should remember wordLength settings between sessions", () => {
      testRendererInstance.unmount();

      localStorageSetItem(
        LOCAL_STORAGE_SETTINGS,
        JSON.stringify({ wordLength: 5 })
      );

      testRendererInstance = create(createElement(Component));

      expect(currentGameState.targetWord).toHaveLength(5);
      expect(currentGameState.wordLength).toBe(5);
    });

    it("should erase current game data when settings are changed", () => {
      guessWordHelper("caca");
      expect(currentGameState.endGameStatus).toBe("won");
      dismissModal();

      saveSettings({ wordLength: 5 }, ["poopy"]);

      expect(currentGameState.endGameStatus).toBeNull();
      expect(currentGameState.letterKeys).toEqual({});
      expect(currentGameState.pendingGuesses).toHaveLength(0);
      expect(currentGameState.submittedGuesses).toHaveLength(0);
      expect(currentGameState.targetWord).toHaveLength(5);
    });

    it("should not erase past game data when settings are changed", () => {
      guessWordHelper("caca");
      expect(currentGameState.endGameStatus).toBe("won");
      dismissModal();

      const gameStats = getGameStats();
      loadPastGame(gameStats.history[0]);

      saveSettings({ wordLength: 5 }, ["poopy"]);

      expect(currentGameState.endGameStatus).toBe("won");
      expect(currentGameState.letterKeys).not.toEqual({});
      expect(currentGameState.pendingGuesses).toHaveLength(0);
      expect(currentGameState.submittedGuesses).toHaveLength(1);
      expect(currentGameState.targetWord).toHaveLength(4);
    });
  });

  describe("validation", () => {
    it("should not allow submitting an incomplete guess", () => {
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("s");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("c");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("a");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("t");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(1);
    });

    it("should do nothing when deleting without pending guesses", () => {
      const initialState = { ...currentGameState };
      deletePendingGuess();
      expect(currentGameState).toEqual(initialState);
    });

    it("should not allow modifying a completed game", () => {
      guessWordHelper("caca");
      expect(currentGameState.endGameStatus).toEqual("won");

      const completedState = { ...currentGameState };
      addPendingGuess("a");
      expect(currentGameState).toEqual(completedState);
      deletePendingGuess();
      expect(currentGameState).toEqual(completedState);
      submitPendingGuesses();
      expect(currentGameState).toEqual(completedState);
    });

    it("it should not allow saving invalid preferences", () => {
      jest.spyOn(global.console, "error").mockImplementation();

      saveSettings();
      expect(global.console.error).toHaveBeenCalledTimes(1);

      saveSettings({ wordLength: 4 });
      expect(global.console.error).toHaveBeenCalledTimes(2);

      saveSettings({ wordLength: 4 }, []);
      expect(global.console.error).toHaveBeenCalledTimes(3);

      saveSettings({}, ["poop"]);
      expect(global.console.error).toHaveBeenCalledTimes(4);

      saveSettings(null, ["poop"]);
      expect(global.console.error).toHaveBeenCalledTimes(5);
    });
  });
});
