const WORD_LIST = [
  "caca",
  "crap",
  "dirt",
  "dung",
  "poop",
  "scat",
  "shat",
  "shit",
  "soil",
  "turd",
];

// A true Wordle clone would use the GMT day as an index,
// but this variant is meant to be replayable multiple times a day...
export function getRandomWordList() {
  return shuffle([...WORD_LIST]);
}

export function isGuessValid(word) {
  return WORD_LIST.includes(word);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
