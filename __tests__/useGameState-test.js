import { createElement } from "react";
import { act, create } from "react-test-renderer";
import useGameState from "../hooks/useGameState";

describe("useGameState", () => {
  let addPendingGuess = null;
  let currentGameState = null;
  let deletePendingGuess = null;
  let submitPendingGuesses = null;

  function guessWordHelper(word) {
    addPendingGuess(word.charAt(0));
    addPendingGuess(word.charAt(1));
    addPendingGuess(word.charAt(2));
    addPendingGuess(word.charAt(3));
    submitPendingGuesses();
  }

  function Component({ targetWord }) {
    const result = useGameState(targetWord);

    currentGameState = result.state;

    addPendingGuess = (guess) => {
      act(() => result.addPendingGuess(guess));
    };
    deletePendingGuess = () => {
      act(() => result.deletePendingGuess());
    };
    submitPendingGuesses = () => {
      act(() => result.submitPendingGuesses());
    };

    return null;
  }

  beforeEach(() => {
    create(createElement(Component, { targetWord: "test" }));
  });

  afterEach(() => {
    addPendingGuess = null;
    currentGameState = null;
    deletePendingGuess = null;
    submitPendingGuesses = null;
  });

  it("should initialize correctly", () => {
    const { state } = currentGameState;
    expect(currentGameState.completeStatus).toBeNull();
    expect(currentGameState.letterKeys).toEqual({});
    expect(currentGameState.pendingGuesses).toHaveLength(0);
    expect(currentGameState.submittedGuesses).toHaveLength(0);
    expect(currentGameState.targetWord).toEqual("test");
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
    guessWordHelper("sttt");
    expect(currentGameState.completeStatus).toBeNull();
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "s": "present",
        "t": "correct",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "present",
          ],
          Array [
            "t",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
          Array [
            "t",
            "correct",
          ],
        ],
      ]
    `);

    guessWordHelper("tset");
    expect(currentGameState.completeStatus).toBeNull();
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "e": "present",
        "s": "present",
        "t": "correct",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "present",
          ],
          Array [
            "t",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
          Array [
            "t",
            "correct",
          ],
        ],
        Array [
          Array [
            "t",
            "correct",
          ],
          Array [
            "s",
            "present",
          ],
          Array [
            "e",
            "present",
          ],
          Array [
            "t",
            "correct",
          ],
        ],
      ]
    `);

    guessWordHelper("taes");
    expect(currentGameState.completeStatus).toBeNull();
    expect(currentGameState.letterKeys).toMatchInlineSnapshot(`
      Object {
        "a": "incorrect",
        "e": "present",
        "s": "present",
        "t": "correct",
      }
    `);
    expect(currentGameState.submittedGuesses).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "s",
            "present",
          ],
          Array [
            "t",
            "present",
          ],
          Array [
            "t",
            "incorrect",
          ],
          Array [
            "t",
            "correct",
          ],
        ],
        Array [
          Array [
            "t",
            "correct",
          ],
          Array [
            "s",
            "present",
          ],
          Array [
            "e",
            "present",
          ],
          Array [
            "t",
            "correct",
          ],
        ],
        Array [
          Array [
            "t",
            "present",
          ],
          Array [
            "a",
            "incorrect",
          ],
          Array [
            "e",
            "present",
          ],
          Array [
            "s",
            "present",
          ],
        ],
      ]
    `);
  });

  it("should mark a game as completed (won)", () => {
    guessWordHelper("test");
    expect(currentGameState.completeStatus).toEqual("won");
  });

  it("should mark a game as completed (lost)", () => {
    guessWordHelper("aaaa");
    expect(currentGameState.completeStatus).toBeNull();
    guessWordHelper("bbbb");
    expect(currentGameState.completeStatus).toBeNull();
    guessWordHelper("cccc");
    expect(currentGameState.completeStatus).toBeNull();
    guessWordHelper("dddd");
    expect(currentGameState.completeStatus).toEqual("lost");
  });

  describe("validation", () => {
    it("should not allow submitting an incomplete guess", () => {
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("a");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("b");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("c");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(0);

      addPendingGuess("d");
      submitPendingGuesses();
      expect(currentGameState.submittedGuesses).toHaveLength(1);
    });

    it("should do nothing when deleting without pending guesses", () => {
      const initialState = { ...currentGameState };
      deletePendingGuess();
      expect(currentGameState).toEqual(initialState);
    });

    it("should not allow modifying a completed game", () => {
      guessWordHelper("test");
      expect(currentGameState.completeStatus).toEqual("won");

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
