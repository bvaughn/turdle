// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const WORD_LIST = [
  "poop",
  "shit",
  "crap",
  "turd",
  "dung",
  "soil",
  "scat",
  "dirt",
  "caca"
];

export default function handler(req, res) {
  // A true Wordle clone would use the GMT day as an index,
  // but this variant is meant to be replayable multiple times a day.
  const index = Math.floor(Math.random() * WORD_LIST.length);
  const word = WORD_LIST[index];

  res.status(200).json({ word });
}
