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

export function getTargetWord() {
  // A true Wordle clone would use the GMT day as an index,
  // but this variant is meant to be replayable multiple times a day.
  const index = Math.floor(Math.random() * WORD_LIST.length);

  return WORD_LIST[index];
}
