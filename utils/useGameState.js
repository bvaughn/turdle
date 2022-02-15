import { useCallback, useReducer } from "react";

const DEFAULT_STATE = {
  completeStatus: null, // "won" or "lost"

  correctKeys: {},
  presentKeys: {},

  pendingGuesses: [],
  submittedGuesses: [],

  targetWord: "",
};

function reduce(state, action) {
  const { payload, type } = action;

  switch (type) {
    case "add-pending-guess": {
      const { completeStatus, pendingGuesses, submittedGuesses } = state;
      const { letter } = payload;

      if (completeStatus) {
        return state;
      } else if (pendingGuesses.length >= 4) {
        return state;
      }

      return {
        ...state,
        pendingGuesses: [...pendingGuesses, letter],
      };
    }
    case "delete-pending-guess": {
      const { completeStatus, pendingGuesses } = state;

      if (completeStatus) {
        return state;
      } else if (pendingGuesses.length === 0) {
        return state;
      }

      return {
        ...state,
        pendingGuesses: pendingGuesses.slice(0, pendingGuesses.length - 1),
      };
    }
    case "submit-pending-guesses": {
      const {
        completeStatus,
        correctKeys,
        pendingGuesses,
        presentKeys,
        submittedGuesses,
        targetWord,
      } = state;

      if (completeStatus) {
        return state;
      } else if (pendingGuesses.length !== 4) {
        return state;
      }

      let newCorrectKeys = { ...correctKeys };
      let newPresentKeys = { ...presentKeys };
      for (const index = 0; index < pendingGuesses.length; index++) {
        const letter = pendingGuesses[index];
        const isKeyCorrect = targetWord.charAt(index) === letter;
        const isKeyPresent = targetWord.includes(letter);

        if (isKeyCorrect) {
          newCorrectKeys[letter] = true;
        } else if (isKeyPresent) {
          newPresentKeys[letter] = true;
        }
      }

      const newWord = pendingGuesses.join("");
      const newSubmittedGuesses = [...submittedGuesses, ...pendingGuesses];

      let newCompleteStatus = null;
      if (newWord === targetWord) {
        newCompleteStatus = "won";
      } else if (submittedGuesses.length === 16) {
        newCompleteStatus = "lost";
      }

      return {
        ...state,
        completeStatus: newCompleteStatus,
        correctKeys: newCorrectKeys,
        pendingGuesses: [],
        presentKeys: newPresentKeys,
        submittedGuesses: newSubmittedGuesses,
      };
    }
    default:
      throw new Error(`Unrecognized action "${type}"`);
  }
}

export default function useGameState(targetWord) {
  const [state, dispatch] = useReducer(reduce, {
    ...DEFAULT_STATE,
    targetWord,
  });

  const addPendingGuess = useCallback((letter) => {
    dispatch({
      type: "add-pending-guess",
      payload: {
        letter,
      },
    });
  });

  const deletePendingGuess = useCallback(() => {
    dispatch({ type: "delete-pending-guess" });
  });

  const submitPendingGuesses = useCallback(() => {
    dispatch({ type: "submit-pending-guesses" });
  });

  return {
    addPendingGuess,
    deletePendingGuess,
    state,
    submitPendingGuesses,
  };
}
