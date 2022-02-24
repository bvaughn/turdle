const WORD_LISTS = {
  3: ["ass", "bum", "mud", "pie", "poo"],
  4: [
    "brap",
    "butt",
    "caca",
    "crap",
    "dirt",
    "dump",
    "dung",
    "fart",
    "lump",
    "muck",
    "plop",
    "poop",
    "scat",
    "shat",
    "shit",
    "soil",
    "turd",
  ],
  5: [
    "asses",
    "brown",
    "butts",
    "cacas",
    "craps",
    "drops",
    "dumps",
    "farts",
    "farty",
    "fecal",
    "feces",
    "filth",
    "fudge",
    "guano",
    "plops",
    "poops",
    "poopy",
    "scats",
    "shart",
    "shits",
    "stool",
    "turds",
    "waste",
  ],
  6: [
    "cowpie",
    "crappy",
    "doodoo",
    "dookie",
    "egesta",
    "faeces",
    "jobbie",
    "manure",
    "ordure",
    "sewage",
    "shitty",
    "sludge",
    "stools",
    "turdle",
  ],
};

// A true Wordle clone would use the GMT day as an index,
// but this variant is meant to be replayable multiple times a day...
export function getRandomWordList(length = 4) {
  const validWords = WORD_LISTS[length];

  if (!validWords) {
    throw Error(`Invalid length ${length}`);
  }

  return shuffle(validWords);
}

export function isGuessValid(word) {
  const validWords = WORD_LISTS[word.length];
  return validWords ? validWords.includes(word) : false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
