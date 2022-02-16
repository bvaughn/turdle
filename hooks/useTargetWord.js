import { useMemo } from "react";

const WORD_LIST = [
  "caca",
  "crap",
  "dirt",
  "dung",
  "poop",
  "scat",
  "shit",
  "soil",
  "turd",
];

export default function useTargetWord() {
  const targetWord = useMemo(() => {
    // A true Wordle clone would use the GMT day as an index,
    // but this variant is meant to be replayable multiple times a day.
    const index = Math.floor(Math.random() * WORD_LIST.length);

    return WORD_LIST[index];
  }, []);

  return targetWord;
}
