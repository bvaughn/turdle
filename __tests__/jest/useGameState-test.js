import { createElement } from "react";
import { act, create } from "react-test-renderer";
import useGameState from "../../hooks/useGameState";

describe("useGameState", () => {
  let addPendingGuess = null;
  let currentGameState = null;
  let deletePendingGuess = null;
  let dismissModal = null;
  let restart = null;
  let submitPendingGuesses = null;

  function guessWordHelper(word) {
    addPendingGuess(word.charAt(0));
    addPendingGuess(word.charAt(1));
    addPendingGuess(word.charAt(2));
    addPendingGuess(word.charAt(3));
    submitPendingGuesses();
  }

  function deleteGuessedWord() {
    deletePendingGuess();
    deletePendingGuess();
    deletePendingGuess();
    deletePendingGuess();
  }

  function Component({ wordList }) {
    const result = useGameState(wordList);

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
    restart = (reuseWord) => {
      act(() => result.restart(reuseWord));
    };
    submitPendingGuesses = () => {
      act(() => result.submitPendingGuesses());
    };

    return null;
  }

  beforeEach(() => {
    create(createElement(Component, { wordList: ["caca", "poop", "turd"] }));
  });

  afterEach(() => {
    addPendingGuess = null;
    currentGameState = null;
    deletePendingGuess = null;
    dismissModal = null;
    restart = null;
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
  });
});
